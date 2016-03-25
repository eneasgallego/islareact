window.Fila = React.createClass({
	getInitialState: function() {
    	return {
    		cols: parseCols(this.props.cols)
    	};
  	},
	getDefaultProps: function() {
		return {
			id_campo: '',
			datos: {},
			cols: [],
			acciones: [],
			combos_dataset: {},
			header: false,
			guardar: undefined,
    		anchos: [],
			orden: {},
			claseFila: function(){},
			onResize: function(){},
			onResizeCelda: function(){},
			onClickCelda: function(){},
			onClickAcciones: function(){},
			onChangeValor: function(){},
			onChangeDesc: function(){}
		};
	},
	componentDidMount: function() {
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
	onResizeCelda: function (offset, celda) {
		this.props.onResizeCelda(offset, celda, this);
	},
	onChangeValor: function (valor, celda) {
		this.props.onChangeValor(valor, celda, this);
	},
	onChangeDesc: function (desc, celda) {
		this.props.onChangeDesc(desc, celda, this);
	},
	getIdFila: function () {
		return this.props.datos[this.props.id_campo];
	},
	setIdFila: function (id) {
		this.props.datos[this.props.id_campo] = id;
	},
	guardar: function (valor, field, celda) {
		if (typeof(this.props.guardar) === 'function') {
			this.props.guardar(valor, field, celda, this);
		}
	},
	accionMenu: function (tag) {
		this.props.onClickAcciones(tag, this);
	},
	renderAcciones: function () {
		var ret;

		if (this.props.acciones.length) {
			if (this.props.header) {
				ret = 
				<th key={this.state.cols.length}></th>
			} else {
				ret = 
				<td key={this.state.cols.length}>
					<Menu children={this.props.acciones} accion={this.accionMenu}/>
				</td>
			}
		}

		return ret;
	},
	orden: function (campo) {
		return (this.props.orden.campo == campo);
	},
	renderCeldas: function () {
		var celdas = [];

		var celdas = [];
		for (var i = 0 ; i < this.state.cols.length ; i++) {

			var col = this.state.cols[i];

			celdas.push(
				<Celda 
					key={i}
					datos={this.props.datos[col.campo]}
					campo={col.campo}
					guardar={this.guardar}
					onClick={this.props.onClickCelda}
					onChangeValor={this.onChangeValor}
					onChangeDesc={this.onChangeDesc}
					header={this.props.header}
					tipo={col.tipo}
					combos_dataset={this.props.combos_dataset}
					ancho={this.props.anchos[i]}
					orden={this.orden(col.campo)}
					onResize={this.onResizeCelda}
				/>
			);
		}

		var acciones = this.renderAcciones();
		if (acciones) {
			celdas.push(acciones);
		}

		return celdas;
	},
	claseFila: function () {
		var ret = this.props.header ? 'header' : '';

		var claseFila = this.props.claseFila(this.props.datos, this);
		if (claseFila) {
			ret += ' ' + claseFila;
		}

		return ret;
	},
	render: function() {
		return (
			<tr className={this.claseFila()} >
				{this.renderCeldas()}
			</tr>
		);
    }
});
