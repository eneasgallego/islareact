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
				inicio: [{
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
				},{
					id: 'pedidos',
					titulo: 'Pedidos',
					url: 'vistaPedidos.php',
					id_campo: 'idtipos_pedido',
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

		this.setState({alto:alto});
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
/*
		for (var i = 0 ; i < this.props.config.inicio.length ; i++) {
			var config = this.props.config.inicio[i];
			if (config.necesitaParametros) {

			}
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
					onClickAcciones={this.onClickAcciones}
				/>
			);
		}

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
