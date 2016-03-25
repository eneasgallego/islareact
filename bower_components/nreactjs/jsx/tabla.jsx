window.Tabla = React.createClass({
	getInitialState: function() {
    	return {
    		filas_cargadas: false,
    		cargando: false,
    		filas: [],
    		cols: parseCols(this.props.cols),
    		combos_dataset: {},
    		orden: {},
    		velo: false,
    		anchos: [],
    		alto_tabla: undefined,
    		alto_body: undefined
    	};
  	},
	getDefaultProps: function() {

		return {
			id_campo: '',
			url_editar: '',
			url_crear: '',
			url: '',
			params: {},
			cols: [],
			acciones: [],
			guardar: undefined,
			claseFila: function(){},
			onResize: function(){},
			onResizeFila: function(){},
			onResizeCelda: function(){},
			onChangeValor: function(){},
			onClickAcciones: function(){}
		};
	},
	componentWillUpdate: function() {
		if (this.isCombosCompletos()) {
			this.cargarFilas();
		}
	},
	componentDidMount: function() {
		if (this.isCombosCompletos()) {
			this.cargarFilas();
		} else {
			this.cargarCombos();
		}

		var dom = ReactDOM.findDOMNode(this);
		dom.addEventListener('resize', this.onResize);
		this.triggerResize({
			width: dom.offsetWidth,
			height: dom.offsetHeight,
			top: dom.offsetTop,
			left: dom.offsetLeft,
			index: dom.cellIndex
		});
	},
	triggerResize: function (offset) {
		this.calcAltoTabla();
		this.props.onResize(offset, this);
	},
	onResize: function (e) {
		this.triggerResize({
			width: e.currentTarget.offsetWidth,
			height: e.currentTarget.offsetHeight,
			top: e.currentTarget.offsetTop,
			left: e.currentTarget.offsetLeft,
			index: e.currentTarget.cellIndex
		});
	},
	onResizeCelda: function (offset, celda, fila) {
		var anchos = this.state.anchos;
		var ancho = anchos[offset.index];
		if ((!ancho) || ancho < offset.width) {
			anchos[offset.index] = offset.width;
			this.setState({anchos: anchos});
		}
		this.props.onResizeCelda(offset, celda, fila, this);
	},
	onResizeFila: function (offset, fila) {
		this.props.onResizeFila(offset, fila, this);
	},
	calcAltoTabla: function () {
		var dom = ReactDOM.findDOMNode(this);
		var alto_tabla = dom.offsetHeight;
		var domMenu = dom.querySelector('.menu-tabla');
		alto_tabla -= domMenu.offsetHeight;

		this.setState({alto_tabla: alto_tabla}, function () {
			this.calcAltoBody();
		});
	},
	calcAltoBody: function () {
		var dom = ReactDOM.findDOMNode(this);
		var domDiv = dom.querySelector('.tabla-div');
		var alto_body = domDiv.offsetHeight;
		var domHead = domDiv.querySelector('thead');
		alto_body -= domHead.offsetHeight;

		this.setState({alto_body: alto_body});
	},
	onChangeValor: function (valor, celda, fila) {
		this.props.onChangeValor(valor, celda, fila, this);
	},
	guardar: function (valor, field, celda, fila) {
		if (typeof(this.props.guardar) === 'function') {
			this.props.guardar(valor, field, celda, fila, this);
		}
	},
	accionMenu: function (tag) {
		if (tag == 'nuevo') {
			this.nuevaFila();
		}
	},
	getValorDefecto: function (tipo) {
		var ret;

		if (tipo == 'string') {
			ret = '';
		} else if (tipo == 'int' || tipo == 'float' || tipo == 'object') {
			ret = 0;
		} else if (tipo == 'bool') {
			ret = false;
		}

		return ret;
	},
	nuevaFila: function () {
		var filas = this.state.filas.slice();
		var obj = {};
		for (var i = 0 ; i < this.props.cols.length ; i++) {
			var col = this.props.cols[i];

			obj[col.campo] = this.getValorDefecto(col.tipo.tipo);
		}
		filas.push(obj);
		this.setState({
			filas: filas
		});
	},
	cargarFilas: function (fn) {
		if (!this.state.filas_cargadas && !this.state.cargando) {
			this.setState({cargando: true}, function () {
				ajax({
					metodo: 'get',
					params: this.props.params,
					url: this.props.url,
					success: function (res) {
						this.setState({
							filas: res,
							filas_cargadas: true,
							cargando: false
						}, function () {
							if (typeof(fn) === 'function') { 
								fn.call(this);
							}
						}.bind(this));

					}.bind(this)
				}, this);
			}.bind(this));
		}
	},
	isCombosCompletos: function () {
		var ret = true;
		for (var i = 0 ; i < this.state.cols.length ; i++) {
			var col = this.state.cols[i];

			if (col.tipo.tipo == 'object') {
				if (this.state.combos_dataset && !this.state.combos_dataset[col.campo]) {
					ret = false;
					break;
				}
			}
		}

		return ret;
	},
	cargarCombos: function () {
		var cargarCombo = function (col) {

			var params = {
				_sort: col.tipo.texto,
				_order: 'ASC'
			};

			ajax({
				metodo: 'get',
				url: col.tipo.url,
				params: params,
				success: function (response) {
					var combos_dataset = this.state.combos_dataset;
					combos_dataset[col.campo] = response;
					this.setState({combos_dataset: combos_dataset});
				}.bind(this)
			}, this);
		}.bind(this);

		for (var i = 0 ; i < this.state.cols.length ; i++) {
			var col = this.state.cols[i];

			if (col.tipo.tipo == 'object') {
				if (!this.state.combos_dataset[col.campo]) {
					cargarCombo(col);
				}
			}
		}
		
	},
	onClickCelda: function (e, celda) {
		e.preventDefault();
		if (!celda.props.header && this.props.guardar) {
			celda.setState({editar:true});
		}
	},
	onClickAcciones: function (tag, fila) {
		this.props.onClickAcciones(tag, fila, this);
	},
	onClickCeldaHeader: function (e, celda) {
		e.preventDefault();
		celda.changeOrden();
	},
	ordenar: function(orden, celda, fila) {

		this.setState({
			orden: {
				campo: celda.props.campo,
				desc: orden < 0
			}
		});
	},
	refrescar: function () {
		this.state.filas_cargadas = false;
		this.cargarFilas(this.forceUpdate);
	},
	renderMenu: function () {
		var ret;

		if (this.props.guardar) {
			var menu = [{
				texto: 'NUEVO',
				tag: 'nuevo'
			}];
			ret = <Menu ref="menu" className="menu-tabla" children={menu} accion={this.accionMenu}></Menu>
		}

		return ret;
	},
	renderFilas: function () {
		var filas = [];

		for (var i = 0 ; i < this.state.filas.length ; i++) {

			var fila = this.state.filas[i];
			var objFila = <Fila
					key={i}
					cols={this.state.cols}
					datos={fila}
					guardar={this.guardar}
					id_campo={this.props.id_campo}
					acciones={this.props.acciones}
					claseFila={this.props.claseFila}
					onResize={this.onResizeFila}
					onResizeCelda={this.onResizeCelda}
					onClickCelda={this.onClickCelda}
					onClickAcciones={this.onClickAcciones}
					onChangeValor={this.onChangeValor}
					combos_dataset={this.state.combos_dataset}
					anchos={this.state.anchos}
				/>

			var campo = this.state.orden.campo;
			if (campo) {
				var desc = this.state.orden.desc;
				var index = filas.indice(function (v, k) {
					var valor1 = parseFloat(v.props.datos[campo]);
					valor1 = isNaN(valor1) ? v.props.datos[campo] : valor1;
					
					var valor2 = parseFloat(fila[campo]);
					valor2 = isNaN(valor2) ? fila[campo] : valor2;
					return ((desc && valor1 < valor2) ||
						((!desc) && valor1 > valor2));
				}.bind(this));
				if (!~index) {
					filas.push(objFila);
				} else {
					filas.splice(index, 0, objFila);
				}
			} else {
				filas.push(objFila);
			}
		}

		return filas;
	},
	renderVelo: function () {
		var ret;

		if (this.state.velo) { 
			ret = 	<div className="velo">
						<div className="velo-fondo" />
						<div className="velo-imagen" />
					</div>
		}

		return ret;
	},
	renderStyleBody: function () {
		var ret = {};

		if (this.state.alto_body) {
			ret.height = this.state.alto_body + 'px';
		}

		return ret;
	},
	renderStyleTabla: function () {
		var ret = {};

		if (this.state.alto_tabla) {
			ret.height = this.state.alto_tabla + 'px';
		}

		return ret;
	},
	renderTabla: function () {
		var ret;
		
		var datos_header = {};
		for (var i = 0 ; i < this.state.cols.length ; i++) {
			var col = this.state.cols[i];

			datos_header[col.campo] = col.texto;
		}

		return (
			<div className="tabla-div" style={this.renderStyleTabla()}>
				<table className="tabla">
					<thead>
						<Fila
							header={true}
							ref={this.refFilas}
							cols={this.state.cols}
							datos={datos_header}
							onResize={this.onResizeFila}
							onResizeCelda={this.onResizeCelda}
							onClickCelda={this.onClickCeldaHeader}
							onChangeDesc={this.ordenar}
							acciones={this.props.acciones}
							combos_dataset={this.state.combos_dataset}
							anchos={this.state.anchos}
							orden={this.state.orden}
						/>
					</thead>
					<tbody style={this.renderStyleBody()}>
						{this.renderFilas()}
					</tbody>
				</table>
			</div>
		);
	},
	render: function() {
		return (
			<div className="tabla-cont">
				{this.renderMenu()} 
				{this.renderTabla()} 
				{this.renderVelo()}
			</div>
		);
    }
});
