window.Isla = React.createClass({
	getInitialState: function() {
    	return {
    		contenido: 'inicio',
    		pedido_ver: null
    	};
  	}, 
	getDefaultProps: function() {
		return {
			menu: [{
				texto: 'Inicio',
				tag: 'inicio'
			},{
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
			}],
			config: {
				fabricas: {
					id_campo: 'idfabricas',
					url_editar: 'editarFabrica.php',
					url_crear: 'crearFabrica.php',
					url: 'leerFabricas.php',
					cols: [{
						texto: 'FABRICA',
						campo: 'nombrefabricas'
					},{
						texto: 'MAXIMO',
						campo: 'maximofabricas'
					}]
				},
				materiales: {
					id_campo: 'idmateriales',
					url_editar: 'editarMaterial.php',
					url_crear: 'crearMaterial.php',
					url: 'leerMateriales.php',
					cols: [{
						texto: 'MATERIAL',
						campo: 'nombremateriales'
					},{
						texto: 'FABRICA',
						campo: 'fabricamateriales',
						combo: {
							url: 'leerFabricas.php',
							id: 'idfabricas',
							texto: 'nombrefabricas',
						}
					},{
						texto: 'HACE',
						campo: 'hacemateriales'
					},{
						texto: 'STOCK',
						campo: 'stockmateriales'
					},{
						texto: 'HACIENDO',
						campo: 'haciendomateriales'
					}]
				},
				materiales_necesita: {
					id_campo: 'idmateriales_necesita',
					url_editar: 'editarMaterialNecesita.php',
					url_crear: 'crearMaterialNecesita.php',
					url: 'leerMaterialesNecesita.php',
					cols: [{
						texto: 'MATERIAL',
						campo: 'materialmateriales_necesita',
						combo: {
							url: 'leerMateriales.php',
							id: 'idmateriales',
							texto: 'nombremateriales',
						}
					},{
						texto: 'NECESITA',
						campo: 'materialnecesitamateriales_necesita',
						combo: {
							url: 'leerMateriales.php',
							id: 'idmateriales',
							texto: 'nombremateriales',
						}
					},{
						texto: 'CANTIDAD',
						campo: 'cantidadmateriales_necesita'
					}]
				},
				tipos_pedido: {
					id_campo: 'idtipos_pedido',
					url_editar: 'editarTiposPedido.php',
					url_crear: 'crearTiposPedido.php',
					url: 'leerTiposPedido.php',
					cols: [{
						texto: 'TIPO',
						campo: 'nombretipos_pedido'
					}]
				},
				pedidos: {
					id_campo: 'idpedidos',
					url_editar: 'editarPedidos.php',
					url_crear: 'crearPedidos.php',
					url: 'leerPedidos.php',
					cols: [{
						texto: 'TIPO',
						campo: 'tipopedidos',
						combo: {
							url: 'leerTiposPedido.php',
							id: 'idtipos_pedido',
							texto: 'nombretipos_pedido',
						}
					},{
						texto: 'MATERIAL',
						campo: 'materialpedidos',
						combo: {
							url: 'leerMateriales.php',
							id: 'idmateriales',
							texto: 'nombremateriales',
						}
					},{
						texto: 'CANTIDAD',
						campo: 'cantidadpedidos'
					},{
						texto: 'PROCESADO',
						campo: 'procesadopedidos',
						check: true
					},{
						texto: 'PROFUNDIDAD',
						campo: 'profundidadpedidos'
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
	colsNecesitaMateriales: function () {
		return [{
			texto: 'PROF',
			campo: 'profundidadpedidos'
		},{
			texto: 'MATERIAL',
			campo: 'nombremateriales'
		},{
			texto: 'FALTA',
			campo: 'faltamateriales'
		},{
			texto: 'FABRICA',
			campo: 'nombrefabricas'
		}];
	},
	colsNecesita: function () {
		return [{
			texto: 'PROF',
			campo: 'profundidadpedidos'
		},{
			texto: 'MATERIAL',
			campo: 'nombremateriales'
		},{
			texto: 'HACIENDO',
			campo: 'haciendomateriales'
		},{
			texto: 'FABRICA',
			campo: 'nombrefabricas'
		}];
	},
	colsPedidos: function () {
		return [{
			texto: 'PEDIDO',
			campo: 'nombretipos_pedido'
		},{
			texto: 'NECESITA',
			campo: 'cantidadpedido'
		},{
			texto: 'TIENE',
			campo: 'stockmateriales'
		},{
			texto: 'HACIENDO',
			campo: 'haciendomateriales'
		}];
	},
	colsPedido: function () {
		return [{
			texto: 'MATERIAL',
			campo: 'nombremateriales'
		},{
			texto: 'NECESITA',
			campo: 'cantidadpedidos'
		},{
			texto: 'TIENE',
			campo: 'stockmateriales'
		},{
			texto: 'HACIENDO',
			campo: 'haciendomateriales'
		}];
	},
	refrescarInicio: function () {
		for (var key in this.refs) {
			var panel = this.refs[key];
			panel.refrescar();
		}
	},
	hacerMaterial: function(tag, fila, tabla, panel) {
		if (parseInt(fila.props.datos.procesadopedidos)) {
			ajax({
				metodo: 'post',
				url: 'hacerMaterial.php',
				params: {
					id: fila.props.datos.materialpedidos
				},
				success: function (response) {
					if (response.success) {
						this.refrescarInicio();
					} else {
						alert(response.msg);
					}
				}.bind(this)
			}, tabla);
		} else {
			alert('Hay que procesarlo');
		}
	},
	hacerMaterial3: function(tag, fila, tabla, panel) {
		if (parseInt(fila.props.datos.procesadopedidos)) {
			ajax({
				metodo: 'post',
				url: 'hacerMaterial.php',
				params: {
					id: fila.props.datos.materialpedidos,
					cantidad: 3
				},
				success: function (response) {
					if (response.success) {
						this.refrescarInicio();
					} else {
						alert(response.msg);
					}
				}.bind(this)
			}, tabla);
		} else {
			alert('Hay que procesarlo');
		}
	},
	hacerMaterial6: function(tag, fila, tabla, panel) {
		if (parseInt(fila.props.datos.procesadopedidos)) {
			ajax({
				metodo: 'post',
				url: 'hacerMaterial.php',
				params: {
					id: fila.props.datos.materialpedidos,
					cantidad: 6
				},
				success: function (response) {
					if (response.success) {
						this.refrescarInicio();
					} else {
						alert(response.msg);
					}
				}.bind(this)
			}, tabla);
		} else {
			alert('Hay que procesarlo');
		}
	},
	recogerMaterial: function(tag, fila, tabla, panel) {
		if (parseInt(fila.props.datos.procesadopedidos)) {
			if (fila.props.datos.haciendomateriales > 0) {
				ajax({
					metodo: 'post',
					url: 'recogerMaterial.php',
					params: {
						id: fila.props.datos.materialpedidos
					},
					success: function (response) {
						if (response.success) {
							this.refrescarInicio();
						}
					}.bind(this)
				}, tabla);
			} else {
				alert('No se puede');
			}
		} else {
			alert('Hay que procesarlo');
		}
	},
	procesarPedido: function(tag, fila, tabla, panel) {
		ajax({
			metodo: 'post',
			url: 'procesarPedido.php',
			params: {
				id: fila.props.datos.idpedidos
			},
			success: function (response) {
				if (response.success) {
					this.refrescarInicio();
				} else {
					alert(response.msg);
				}
			}.bind(this)
		}, tabla);
	},
	procesarPedidos: function(tag, fila, tabla, panel) {
		ajax({
			metodo: 'post',
			url: 'procesarPedidos.php',
			params: {
				id: fila.props.datos.idtipos_pedido
			},
			success: function (response) {
				if (response.success) {
					this.refrescarInicio();
				} else {
					alert(response.msg);
				}
			}.bind(this)
		}, tabla);
	},
	cerrarPedido: function(tag, fila, tabla, panel) {
		ajax({
			metodo: 'post',
			url: 'cerrarPedido.php',
			params: {
				id: fila.props.datos.idtipos_pedido
			},
			success: function (response) {
				if (response.success) {
					this.refrescarInicio();
				}
			}.bind(this)
		}, tabla);
	},
	verPedido: function(tag, fila, tabla, panel) {
		this.setState({pedido_ver: fila.props.datos}, function () {
			this.refs.pedido.refs.tabla.refrescar();
		}.bind(this));
	},
	accionesNecesitaHuerto: function () {
		return [{
			texto: 'X1',
			tag: 'hacerMaterial'
		},{
			texto: 'X3',
			tag: 'hacerMaterial3'
		},{
			texto: 'X6',
			tag: 'hacerMaterial6'
		}];
	},
	accionesNecesitaMateriales: function () {
		return [{
			texto: 'hacer',
			tag: 'hacerMaterial'
		}];
	},
	accionesNecesita: function () {
		return [{
			texto: 'recoger',
			tag: 'recogerMaterial'
		}];
	},
	accionesPedidos: function () {
		return [{
			texto: 'ver',
			tag: 'verPedido'
		},{
			texto: 'procesar',
			tag: 'procesarPedidos'
		},{
			texto: 'cerrar',
			tag: 'cerrarPedido'
		}];
	},
	accionesPedido: function () {
		return [{
			texto: 'hacer',
			tag: 'hacerMaterial'
		},{
			texto: 'recoger',
			tag: 'recogerMaterial'
		},{
			texto: 'procesar',
			tag: 'procesarPedido'
		}];
	},
	claseFilaNecesita: function (datos) {
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
	claseFilaPedidos: function (datos) {
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
	claseFilaPedido: function (datos) {
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
	accionMenu: function (tag) {
		this.setState({contenido:tag});
	},
	onClickAcciones: function (tag, fila, tabla, panel) {
		if (typeof(this[tag]) === 'function') {
			this[tag].apply(this, arguments);
		}
	},
	renderInicio: function () {
		var ret = [];

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
								key={this.state.contenido}
					/>;
		}

		return ret;
	},
	render: function() {
		return (
			<div>
				<header>
					<Menu children={this.props.menu} accion={this.accionMenu}/>
				</header>
				<main>
					{this.renderContenido()}
				</main>
			</div>
		);
    }
});
