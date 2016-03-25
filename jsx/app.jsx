window.App = React.createClass({
	getInitialState: function() {
    	return {
    		contenido: 'inicio',
    		alto: undefined,
    		dialogo: undefined
    	};
  	},
	getDefaultProps: function() {
		return {
			menu: [{
				texto: 'Inicio',
				tag: 'inicio'
			},{
				texto: 'Admin',
				tag: 'admin',
				menu: [{
					texto: 'Fabricas',
					tag: 'fabricas'
				},{
					texto: 'Materiales',
					tag: 'materiales'
				},{
					texto: 'Materiales Necesita',
					tag: 'materiales_necesita'
				},{
					texto: 'Tipos Pedido',
					tag: 'tipos_pedido'
				},{
					texto: 'Pedidos',
					tag: 'pedidos'
				}]
			}],
			config: {
				fabricas: {
					id_campo: 'id',
					url: 'http://localhost:3000/fabricas',
					eliminar: true,
					cols: [{
						texto: 'FABRICA',
						campo: 'nombrefabricas'
					},{
						texto: 'MAXIMO',
						campo: 'maximofabricas',
						tipo: 'int'
					}]
				},
				materiales: {
					id_campo: 'id',
					url: 'http://localhost:3000/materiales',
					eliminar: true,
					cols: [{
						texto: 'MATERIAL',
						campo: 'nombremateriales'
					},{
						texto: 'FABRICA',
						campo: 'fabricamateriales',
						tipo: {
							tipo: 'object',
							url: 'http://localhost:3000/fabricas',
							id: 'id',
							texto: 'nombrefabricas'
						}
					},{
						texto: 'HACE',
						campo: 'hacemateriales',
						tipo: 'int'
					},{
						texto: 'STOCK',
						campo: 'stockmateriales',
						tipo: 'int'
					},{
						texto: 'HACIENDO',
						campo: 'haciendomateriales',
						tipo: 'int'
					}]
				},
				materiales_necesita: {
					id_campo: 'id',
					url: 'http://localhost:3000/materiales_necesita',
					eliminar: true,
					cols: [{
						texto: 'MATERIAL',
						campo: 'materialmateriales_necesita',
						tipo: {
							tipo: 'object',
							url: 'http://localhost:3000/materiales',
							id: 'id',
							texto: 'nombremateriales'
						}
					},{
						texto: 'NECESITA',
						campo: 'materialnecesitamateriales_necesita',
						tipo: {
							tipo: 'object',
							url: 'http://localhost:3000/materiales',
							id: 'id',
							texto: 'nombremateriales'
						}
					},{
						texto: 'CANTIDAD',
						campo: 'cantidadmateriales_necesita',
						tipo: 'int'
					}]
				},
				tipos_pedido: {
					id_campo: 'id',
					url: 'http://localhost:3000/tipos_pedido',
					eliminar: true,
					cols: [{
						texto: 'TIPO',
						campo: 'nombretipos_pedido'
					}]
				},
				pedidos: {
					id_campo: 'id',
					url: 'http://localhost:3000/pedidos',
					eliminar: true,
					cols: [{
						texto: 'TIPO',
						campo: 'tipopedidos',
						tipo: {
							tipo: 'object',
							url: 'http://localhost:3000/tipos_pedido',
							id: 'id',
							texto: 'nombretipos_pedido'
						}
					},{
						texto: 'MATERIAL',
						campo: 'materialpedidos',
						tipo: {
							tipo: 'object',
							url: 'http://localhost:3000/materiales',
							id: 'id',
							texto: 'nombremateriales'
						}
					},{
						texto: 'CANTIDAD',
						campo: 'cantidadpedidos',
						tipo: 'int'
					},{
						texto: 'PROCESADO',
						campo: 'procesadopedidos',
						tipo: 'bool'
					},{
						texto: 'PROFUNDIDAD',
						campo: 'profundidadpedidos',
						tipo: 'int'
					}]
				},
				inicio: [/*{
					id: 'huerto',
					titulo: 'Huerto',
					url: 'vistaNecesitaHuerto.php',
					id_campo: 'materialpedidos',
					cols: 'colsNecesitaMateriales',
					acciones: 'accionesNecesitaHuerto',
					claseFila: 'claseFilaNecesita'
				},{
					id: 'materiales',
					titulo: 'Materiales',
					url: 'vistaNecesitaMateriales.php',
					id_campo: 'materialpedidos',
					cols: 'colsNecesitaMateriales',
					acciones: 'accionesNecesitaMateriales',
					claseFila: 'claseFilaNecesita'
				},{
					id: 'necesita',
					titulo: 'Necesita',
					url: 'vistaNecesita.php',
					id_campo: 'materialpedidos',
					cols: 'colsNecesita',
					acciones: 'accionesNecesita',
					claseFila: 'claseFilaNecesita'
				},*/{
					id: 'pedidos',
					titulo: 'Pedidos',
					url: 'http://localhost:3000/db',
					id_campo: 'idtipos_pedido',
					parseData: 'parseDataPedidos',
					cols: 'colsPedidos',
					acciones: 'accionesPedidos',
					claseFila: 'claseFilaPedidos'
				}],
				inicio_pedido: {
					id: 'pedido',
					url: 'vistaPedido.php',
					id_campo: 'idpedidos',
					cols: 'colsPedido',
					acciones: 'accionesPedido',
					claseFila: 'claseFilaPedido'
				}
			}
		};
	},
	parseDataPedidos: function (data, tabla, panel) {

		var ret = [];
		var map = {};
		var mapas = {};

		var getMapa = function (mapa, id) {
			var ret = mapas[mapa];

			if (!ret) {
				ret = data[mapa].crearMapa(id);
			}

			return ret;
		};

		for (var i = 0 ; i < data.pedidos.length ; i++) {
			var pedido = data.pedidos[i];

			var idtipos_pedido = pedido.tipopedidos;

			var obj = map[idtipos_pedido];
			if (!obj) {
				obj = {
					idtipos_pedido: idtipos_pedido,
					cantidadpedido: 0
				};
				ret.push(obj);
			}

			var tipos_pedido = getMapa('tipos_pedido', 'id');
			var tipo_pedido = tipos_pedido[idtipos_pedido];
			obj.nombretipos_pedido = tipo_pedido.nombretipos_pedido;

			var materiales = getMapa('materiales', 'id');
			var material = materiales[pedido.materialpedidos];
			obj.stockmateriales = material.stockmateriales;
			obj.haciendomateriales = material.haciendomateriales;

			obj.cantidadpedido += pedido.cantidadpedidos;

			if (typeof(obj.procesadopedidos) === 'undefined' || obj.procesadopedidos > pedido.procesadopedidos) {
				obj.procesadopedidos = pedido.procesadopedidos;
			}

			var faltapedidos = (pedido.cantidadpedidos - material.stockmateriales) > 0 ? 1 : 0;
			if (typeof(obj.faltapedidos) === 'undefined' || obj.faltapedidos < pedido.faltapedidos) {
				obj.faltapedidos = faltapedidos;
			}

			map[idtipos_pedido] = obj;
		}

		return ret;
	},
	colsNecesitaMateriales: function colsNecesitaMateriales() {
		return [{
			texto: 'PROF',
			campo: 'profundidadpedidos'
		}, {
			texto: 'MATERIAL',
			campo: 'nombremateriales'
		}, {
			texto: 'FALTA',
			campo: 'faltamateriales'
		}, {
			texto: 'FABRICA',
			campo: 'nombrefabricas'
		}];
	},
	colsNecesita: function colsNecesita() {
		return [{
			texto: 'PROF',
			campo: 'profundidadpedidos'
		}, {
			texto: 'MATERIAL',
			campo: 'nombremateriales'
		}, {
			texto: 'HACIENDO',
			campo: 'haciendomateriales'
		}, {
			texto: 'FABRICA',
			campo: 'nombrefabricas'
		}];
	},
	colsPedidos: function colsPedidos() {
		return [{
			texto: 'PEDIDO',
			campo: 'nombretipos_pedido'
		}, {
			texto: 'NECESITA',
			campo: 'cantidadpedido'
		}, {
			texto: 'TIENE',
			campo: 'stockmateriales'
		}, {
			texto: 'HACIENDO',
			campo: 'haciendomateriales'
		}];
	},
	colsPedido: function colsPedido() {
		return [{
			texto: 'MATERIAL',
			campo: 'nombremateriales'
		}, {
			texto: 'NECESITA',
			campo: 'cantidadpedidos'
		}, {
			texto: 'TIENE',
			campo: 'stockmateriales'
		}, {
			texto: 'HACIENDO',
			campo: 'haciendomateriales'
		}];
	},
	accionesNecesitaHuerto: function accionesNecesitaHuerto() {
		return [{
			texto: 'X1',
			tag: 'hacerMaterial'
		}, {
			texto: 'X3',
			tag: 'hacerMaterial3'
		}, {
			texto: 'X6',
			tag: 'hacerMaterial6'
		}];
	},
	accionesNecesitaMateriales: function accionesNecesitaMateriales() {
		return [{
			texto: 'hacer',
			tag: 'hacerMaterial'
		}];
	},
	accionesNecesita: function accionesNecesita() {
		return [{
			texto: 'recoger',
			tag: 'recogerMaterial'
		}];
	},
	accionesPedidos: function accionesPedidos() {
		return [{
			texto: 'ver',
			tag: 'verPedido'
		}, {
			texto: 'procesar',
			tag: 'procesarPedidos'
		}, {
			texto: 'cerrar',
			tag: 'cerrarPedido'
		}];
	},
	accionesPedido: function accionesPedido() {
		return [{
			texto: 'hacer',
			tag: 'hacerMaterial'
		}, {
			texto: 'recoger',
			tag: 'recogerMaterial'
		}, {
			texto: 'procesar',
			tag: 'procesarPedido'
		}];
	},
	claseFilaNecesita: function claseFilaNecesita(datos) {
		var clase;
		if (parseInt(datos.stockmateriales) >= parseInt(datos.cantidadpedidos)) {
			clase = 'bueno';
		} else if (parseInt(datos.stockmateriales) + parseInt(datos.haciendomateriales) >= parseInt(datos.cantidadpedidos)) {
			clase = 'medio';
		} else if (datos.maximofabricas == -1) {
			clase = 'huerto';
		} else if (datos.haciendofabricas < datos.maximofabricas) {
			clase = 'malo';
		}

		if (clase == 'malo') {
			if (!parseInt(datos.faltanecesita)) {
				clase = 'nulo';
			}
		}

		return clase;
	},
	claseFilaPedidos: function claseFilaPedidos(datos) {
		var clase;
		if (parseInt(datos.procesadopedidos)) {
			if (parseInt(datos.faltapedidos)) {
				clase = 'malo';
			} else {
				clase = 'bueno';
			}
		}

		return clase;
	},
	claseFilaPedido: function claseFilaPedido(datos) {
		var clase;
		if (parseInt(datos.procesadopedidos)) {
			if (parseInt(datos.stockmateriales) >= parseInt(datos.cantidadpedidos)) {
				clase = 'bueno';
			} else if (parseInt(datos.stockmateriales) + parseInt(datos.haciendomateriales) >= parseInt(datos.cantidadpedidos)) {
				clase = 'medio';
			} else if (datos.haciendofabricas < datos.maximofabricas) {
				clase = 'malo';
			}

			if (clase == 'malo') {
				if (!parseInt(datos.faltanecesita)) {
					clase = 'nulo';
				}
			}
		}

		return clase;
	},
	componentDidMount: function() {
		this.dimensionar();
		window.onresize = function (e) {
			this.dimensionar();
		}.bind(this);
	},
	dimensionar: function () {
		var altoPadre = window.innerHeight;
		var menu = ReactDOM.findDOMNode(this.refs.menu);
		var altoMenu = menu.offsetHeight;
		var alto = altoPadre - altoMenu;

		this.setState({alto:alto}, function () {
			for (var i in this.refs) {
				var ref = this.refs[i];

				if (typeof(ref.dimensionar) === 'function') {
					ref.dimensionar();
				}
			}
		}.bind(this));
	},
	accionMenu: function (tag) {
		this.setState({contenido:tag});
	},
	onClickAcciones: function (tag, fila, tabla, panel) {
		if (typeof(this[tag]) === 'function') {
			this[tag].apply(this, arguments);
		}
	},
	setDialogo: function(dialogo) {
		this.setState({dialogo:dialogo});
	},
	renderInicio: function () {
		var ret = [];

		for (var i = 0 ; i < this.props.config.inicio.length ; i++) {
			var config = this.props.config.inicio[i];
			ret.push(
				<PanelTabla	
					ref={config.id}
					key={config.id}
					id={config.id}
					titulo={config.titulo}
					url={config.url}
					id_campo={config.id_campo}
					cols={this[config.cols]()}
					acciones={this[config.acciones]()}
					claseFila={this[config.claseFila]}
					parseData={this[config.parseData]}
					onClickAcciones={this.onClickAcciones}
				/>
			);
		}
/*
		if (this.state.pedido_ver) {
			var params = {
				idtipos_pedido: this.state.pedido_ver.idtipos_pedido
			};
			ret.push(	
				<PanelTabla	
					ref={this.props.config.inicio_pedido.id}
					key={this.props.config.inicio_pedido.id}
					id={this.props.config.inicio_pedido.id}
					titulo={this.state.pedido_ver.nombretipos_pedido}
					url={this.props.config.inicio_pedido.url}
					params={params}
					id_campo={this.props.config.inicio_pedido.id_campo}
					cols={this[this.props.config.inicio_pedido.cols]()}
					acciones={this[this.props.config.inicio_pedido.acciones]()}
					claseFila={this[this.props.config.inicio_pedido.claseFila]}
					onClickAcciones={this.onClickAcciones}
				/>
			);
		}
*/
		return ret;
	},
	renderContenido: function (e) {
		var ret = '';

		if (this.state.contenido == 'inicio') {
			ret = this.renderInicio();
		} else {
			ret = <ListaTabla	id_campo={this.props.config[this.state.contenido].id_campo}
								url_editar={this.props.config[this.state.contenido].url_editar}
								url_crear={this.props.config[this.state.contenido].url_crear}
								url={this.props.config[this.state.contenido].url}
								cols={this.props.config[this.state.contenido].cols}
								eliminar={this.props.config[this.state.contenido].eliminar}
								key={this.state.contenido}
								ref={this.state.contenido}
								setDialogo={this.setDialogo}
					/>;
		}

		return ret;
	},
	renderStyle: function() {
		var ret = {};

		if (this.state.alto) {
			ret.height = this.state.alto + 'px';
		}

		return ret;
	},
	renderDialogo: function () {
		var ret = '';

		if (this.state.dialogo) {
			ret =	<Dialogo
				titulo={this.state.dialogo.titulo}
				puedeCerrar={this.state.dialogo.puedeCerrar}
				contenido={this.state.dialogo.contenido}
				menu={this.state.dialogo.menu}
				accionMenu={this.state.dialogo.accionMenu}
				cerrarDialogo={this.setDialogo}
			/>
		}

		return ret;
	},
	render: function() {
		return (
			<div>
				<header>
					<Menu ref="menu" children={this.props.menu} accion={this.accionMenu}/>
				</header>
				<main style={this.renderStyle()}>
					{this.renderContenido()}
				</main>
				{this.renderDialogo()}
			</div>
		);
    }
});

ReactDOM.render(
	<App/>,
	document.getElementById('react-container')
);
