window.App = React.createClass({
	getInitialState() {
    	return {
    		contenido: 'inicio',
    		alto: undefined,
    		dialogo: undefined
    	};
  	},
	getDefaultProps() {
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
					},{
						texto: 'AUX',
						campo: 'auxtipos_pedido',
						tipo: 'bool'
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
					url: 'http://localhost:3000/db',
					orden: [{
						campo: "profundidadpedidos",
						desc: true
					},{
						campo: "faltamateriales",
						desc: true
					}],
					id_campo: 'materialpedidos',
					parseData: 'parseDataHuerto',
					cols: 'colsNecesitaMateriales',
					acciones: 'accionesNecesitaHuerto',
					claseFila: 'claseFilaNecesita'
				},{
					id: 'materiales',
					titulo: 'Materiales',
					url: 'http://localhost:3000/db',
					orden: [{
						campo(item) {
							return ((item.stockmateriales < item.cantidadpedidos) &&
								(item.stockmateriales + item.haciendomateriales < item.cantidadpedidos) &&
								(item.maximofabricas != -1) &&
								(item.haciendofabricas < item.maximofabricas) &&
								(item.faltanecesita)) ? 1 : 0;
						},
						desc: true
					},{
						campo: "profundidadpedidos",
						desc: true
					},{
						campo: "faltamateriales",
						desc: true
					}],
					parseData: 'parseDataNecesitaMateriales',
					id_campo: 'materialpedidos',
					cols: 'colsNecesitaMateriales',
					acciones: 'accionesNecesitaMateriales',
					claseFila: 'claseFilaNecesita'
				},{
					id: 'pedidos',
					titulo: 'Pedidos',
					url: 'http://localhost:3000/db',
					orden: {
						campo: "nombretipos_pedido",
						desc: false
					},
					id_campo: 'idtipos_pedido',
					parseData: 'parseDataPedidos',
					cols: 'colsPedidos',
					acciones: 'accionesPedidos',
					claseFila: 'claseFilaPedidos'
				},{
					id: 'necesita',
					titulo: 'Necesita',
					url: 'http://localhost:3000/db',
					orden: [{
						campo: "profundidadpedidos",
						desc: true
					},{
						campo: "haciendomateriales",
						desc: true
					}],
					parseData: 'parseDataNecesita',
					id_campo: 'materialpedidos',
					cols: 'colsNecesita',
					acciones: 'accionesNecesita',
					claseFila: 'claseFilaNecesita'
				}],
				inicio_pedido: {
					id: 'pedido',
					url: 'http://localhost:3000/db',
					orden: {
						campo: "nombremateriales",
						desc: false
					},
					id_campo: 'idpedidos',
					parseData: 'parseDataPedido',
					cols: 'colsPedido',
					acciones: 'accionesPedido',
					claseFila: 'claseFilaPedido'
				}
			}
		};
	},
	componentDidMount() {
		this.dimensionar();
		window.onresize = e => {
			this.dimensionar();
		};

	},
	parseDataPedido(data, tabla, panel) {
		return this.getVistaPedido(data).filter(item => {
			return item.tipopedidos == panel.props.params.idtipos_pedido
		});
	},
	parseDataPedidos(data, tabla, panel) {

		let ret = [];
		let map = {};
		let mapas = {};

		for (let i = 0 ; i < data.pedidos.length ; i++) {
			let pedido = data.pedidos[i];

			let id = pedido.tipopedidos;

			let tipos_pedido = this.getMapa('tipos_pedido', 'id', mapas, data.tipos_pedido);
			let tipo_pedido = tipos_pedido[id];

			let materiales = this.getMapa('materiales', 'id', mapas, data.materiales);
			let material = materiales[pedido.materialpedidos];

			let faltapedidos = (pedido.cantidadpedidos - material.stockmateriales) > 0;

			let obj = map[id];
			if (!obj) {
				obj = {
					idtipos_pedido: id,
					cantidadpedido: 0,
					procesadopedidos: pedido.procesadopedidos,
					faltapedidos: faltapedidos,
					nombretipos_pedido: tipo_pedido.nombretipos_pedido,
					stockmateriales: material.stockmateriales,
					haciendomateriales: material.haciendomateriales
				};
				ret.push(obj);
			}

			obj.cantidadpedido += pedido.cantidadpedidos;

			obj.procesadopedidos = (obj.procesadopedidos || pedido.procesadopedidos);

			obj.faltapedidos = (obj.faltapedidos || faltapedidos);

			map[id] = obj;
		}

		return ret;
	},
	parseDataNecesitaMateriales(data, tabla, panel) {
		let vistaNecesita = this.getVistaNecesita(data);

		let ret = vistaNecesita.filter(item => {
			return (!!~item.maximofabricas) && item.stockmateriales < item.cantidadpedidos && item.stockmateriales + item.haciendomateriales < item.cantidadpedidos;
		});

		return ret;
	},
	parseDataNecesita(data, tabla, panel) {
		let vistaNecesita = this.getVistaNecesita(data);

		let ret = vistaNecesita.filter(item => {
			return item.haciendomateriales > 0;
		});

		return ret;
	},
	parseDataHuerto(data, tabla, panel) {
		let vistaNecesita = this.getVistaNecesita(data);

		let ret = vistaNecesita.filter(item => {
			return (!~item.maximofabricas) && item.stockmateriales < item.cantidadpedidos;
		});

		return ret;
	},
	colsNecesitaMateriales() {
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
	colsNecesita() {
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
	colsPedidos() {
		return [{
			texto: 'PEDIDO',
			campo: 'nombretipos_pedido'
/*		}, {
			texto: 'NECESITA',
			campo: 'cantidadpedido'
		}, {
			texto: 'TIENE',
			campo: 'stockmateriales'
		}, {
			texto: 'HACIENDO',
			campo: 'haciendomateriales'	*/
		}];
	},
	colsPedido() {
		return [{
			texto: 'MATERIAL',
			campo: 'nombremateriales'
		}, {
			texto: 'NECESITA',
			campo: 'cantidadpedidos',
			tipo: 'float'
		}, {
			texto: 'TIENE',
			campo: 'stockmateriales',
			tipo: 'float'
		}, {
			texto: 'HACIENDO',
			campo: 'haciendomateriales',
			tipo: 'float'
		}];
	},
	accionesNecesitaHuerto() {
		return [{
			texto: 'X1',
			tag: 'accionHacerMaterial'
		}, {
			texto: 'X3',
			tag: 'accionHacerMaterial3'
		}, {
			texto: 'X6',
			tag: 'accionHacerMaterial6'
		}];
	},
	accionesNecesitaMateriales() {
		return [{
			texto: 'hacer',
			tag: 'accionHacerMaterial'
		}];
	},
	accionesNecesita() {
		return [{
			texto: 'recoger',
			tag: 'accionRecogerMaterial'
		}];
	},
	accionesPedidos() {
		return [{
			texto: 'ver',
			tag: 'accionVerPedido'
		}, {
			texto: 'procesar',
			tag: 'accionProcesarPedidos'
		}, {
			texto: 'cerrar',
			tag: 'accionCerrarPedido'
		}];
	},
	accionesPedido() {
		return [{
			texto: 'hacer',
			tag: 'accionHacerMaterial'
		}, {
			texto: 'recoger',
			tag: 'accionRecogerMaterial'
		}, {
			texto: 'procesar',
			tag: 'accionProcesarPedido'
		}];
	},
	cargarBD(callback, error) {
		ajax({
			metodo: 'get',
			url: 'http://localhost:3000/db',
			success: callback,
			error: error
		});
	},
	calcularTotales(par) {
		let ret = {};

		for (let i in par) {
			ret[i] = this.calcularTotal(par[i]);
			if (par.item) {
				par.item[i] = ret[i];
			}
		}

		return ret;
	},
	calcularTotal(par) {
		let ret;


		for (let i = 0 ; i < par.lista.length ; i++) {
			let item = par.lista[i];

			let valor;
			if (typeof(par.valor) === 'string') {
				valor = item[par.valor];
			} else if (typeof(par.valor) === 'function') {
				valor = par.valor(item);
			}

			if (typeof(par.tipo) === 'function') {
				ret = par.tipo(ret, valor);
			} else if (par.tipo == 'MIN') {
				if (typeof(ret) === 'undefined' || ret > valor) {
					ret = valor;
				}
			} else if (par.tipo == 'MAX') {
				if (typeof(ret) === 'undefined' || ret < valor) {
					ret = valor;
				}
			} else if (par.tipo == 'SUM') {
				if (!ret) {
					ret = 0
				}

				ret += valor;
			}
		}

		return ret;
	},
	getVistaMaterialesProcesar(data) {
		let ret = [];
		let map = {};

		for (let i = 0 ; i < data.materiales.length ; i++) {
			let material = data.materiales[i];

			let idmaterial = material.id;

			let obj = map[idmaterial];
			if (!obj) {
				obj = {
					materialpedidos: idmaterial,
					nombremateriales: material.nombremateriales,
					stockmateriales: material.stockmateriales,
					haciendomateriales: material.haciendomateriales,
					hacemateriales: material.hacemateriales,
					cantidadpedidos: 0
				};
				ret.push(obj);
			}

			let pedidos = data.pedidos.filter(item => {
				return item.procesadopedidos && idmaterial == item.materialpedidos;
			});

			let totales = this.calcularTotales({
				cantidadpedidos: {
					tipo: 'SUM',
					lista: pedidos,
					valor: 'cantidadpedidos'
				}
			});
			for (let key in totales) {
				if (typeof(totales[key]) !== 'undefined') {
					obj[key] = totales[key];
				}
			}

			obj.faltamateriales = obj.cantidadpedidos - material.stockmateriales - material.haciendomateriales;

			map[idmaterial] = obj;
		}

		return ret;
	},
	getVistaPedido(bd) {
		let ret = [];
		let map = {};
		let mapas = {};

		let vistaFabricas = this.getVistaFabricas(bd);
		let vistaMaterialesFalta = this.getVistaMaterialesFalta(bd);

		for (let i = 0 ; i < bd.pedidos.length ; i++) {
			let pedido = bd.pedidos[i];

			let materiales = this.getMapa('materiales','id',mapas,bd.materiales);
			let material = materiales[pedido.materialpedidos];

			let mapVistaFabricas = this.getMapa('vistaFabricas','fabricamateriales',mapas,vistaFabricas);
			let fabrica = mapVistaFabricas[material.fabricamateriales];

			let mapVistaMaterialesFalta = this.getMapa('vistaMaterialesFalta','idmateriales',mapas,vistaMaterialesFalta);
			let material_falta = mapVistaMaterialesFalta[material.id];

			let id = pedido.id;

			let obj = map[id];
			if (!obj) {
				obj = {
					idpedidos: id,
					tipopedidos: pedido.tipopedidos,
					procesadopedidos: pedido.procesadopedidos,
					materialpedidos: material.id,
					nombremateriales: material.nombremateriales,
					cantidadpedidos: pedido.cantidadpedidos,
					stockmateriales: material.stockmateriales,
					haciendomateriales: material.haciendomateriales,
					maximofabricas: fabrica.maximofabricas,
					haciendofabricas: fabrica.haciendomateriales,
					faltanecesita: material_falta.dif
				};
				ret.push(obj);
			}

			map[id] = obj;
		}

		return ret;
	},
	getVistaFabricas(data) {
		let ret = [];
		let map = {};
		let mapas = {};

		for (let i = 0 ; i < data.materiales.length ; i++) {
			let material = data.materiales[i];

			let fabricas = this.getMapa('fabricas','id',mapas,data.fabricas);
			let fabrica = fabricas[material.fabricamateriales];

			let id = material.fabricamateriales;

			let obj = map[id];
			if (!obj) {
				obj = {
					fabricamateriales: id,
					nombrefabricas: fabrica.nombrefabricas,
					maximofabricas: fabrica.maximofabricas,
					haciendomateriales: 0
				};
				ret.push(obj);
			}

			obj.haciendomateriales += material.haciendomateriales;

			map[id] = obj;
		}

		return ret;
	},
	getVistaMaterialesFalta(data) {
		let ret = [];
		let map = {};

		let vistaMaterialesNecesita = this.getVistaMaterialesNecesita(data);

		for (let i = 0 ; i < data.materiales.length ; i++) {
			let material = data.materiales[i];

			let id = material.id;

			let materiales_necesita = vistaMaterialesNecesita.filter(item => {
				return item.materialmateriales_necesita == id;
			});

			let obj = map[id];
			if (!obj) {
				obj = {
					idmateriales: id,
					nombremateriales: material.nombremateriales,
					dif: false
				};
				ret.push(obj);
			}

			let totales = this.calcularTotales({
				dif: {
					tipo(a, b) {
						let ret = false;

						if (typeof(a) === 'undefined') {
							ret = b;
						} else if (a && b) {
							ret = true;
						}

						return ret;
					},
					lista: materiales_necesita,
					valor(item) {
						return (item.cantidadmateriales_necesita - item.stockmaterialesnecesita) <= 0;
					}
				}
			});
			for (let key in totales) {
				if (typeof(totales[key]) !== 'undefined') {
					obj[key] = totales[key];
				}
			}

			map[id] = obj;
		}

		return ret;
	},
	getVistaMaterialesNecesita(data) {
		let ret = [];
		let map = {};
		let mapas = {};

		for (let i = 0 ; i < data.materiales_necesita.length ; i++) {
			let material_necesita = data.materiales_necesita[i];

			let materiales = this.getMapa('materiales','id',mapas,data.materiales);
			let material = materiales[material_necesita.materialmateriales_necesita];
			let materialNecesita = materiales[material_necesita.materialnecesitamateriales_necesita];

			let id = material_necesita.id;

			let obj = map[id];
			if (!obj) {
				obj = {
					idmateriales_necesita: id,
					materialmateriales_necesita: material_necesita.materialmateriales_necesita,
					nombremateriales: material.nombremateriales,
					stockmateriales: material.stockmateriales,
					haciendomateriales: material.haciendomateriales,
					materialnecesitamateriales_necesita: material_necesita.materialnecesitamateriales_necesita,
					nombrematerialesnecesita: materialNecesita.nombremateriales,
					stockmaterialesnecesita: materialNecesita.stockmateriales,
					haciendomaterialesnecesita: materialNecesita.haciendomateriales,
					cantidadmateriales_necesita: material_necesita.cantidadmateriales_necesita
				};
				ret.push(obj);
			}

			map[id] = obj;
		}

		return ret;
	},
	getVistaNecesita(data) {
		let ret = [];
		let map = {};
		let mapas = {};

		let vistaFabricas = this.getVistaFabricas(data);
		let vistaMaterialesFalta = this.getVistaMaterialesFalta(data);

		for (let i = 0 ; i < data.pedidos.length ; i++) {
			let pedido = data.pedidos[i];

			let materiales = this.getMapa('materiales','id',mapas,data.materiales);
			let material = materiales[pedido.materialpedidos];

			let mapVistaFabricas = this.getMapa('vistaFabricas','fabricamateriales',mapas,vistaFabricas);
			let fabrica = mapVistaFabricas[material.fabricamateriales];

			let mapVistaMaterialesFalta = this.getMapa('vistaMaterialesFalta','idmateriales',mapas,vistaMaterialesFalta);
			let material_falta = mapVistaMaterialesFalta[material.id];

			if (pedido.cantidadpedidos > 0 && pedido.procesadopedidos) {
				let id = pedido.materialpedidos;

				let obj = map[id];
				if (!obj) {
					obj = {
						materialpedidos: id,
						nombremateriales: material.nombremateriales,
						fabricamateriales: material.fabricamateriales,
						nombrefabricas: fabrica.nombrefabricas,
						maximofabricas: fabrica.maximofabricas,
						haciendofabricas: fabrica.haciendomateriales,
						stockmateriales: material.stockmateriales,
						haciendomateriales: material.haciendomateriales,
						procesadopedidos: 1,
						faltanecesita: material_falta.dif,
						cantidadpedidos: 0,
						faltamateriales: 0,
						profundidadpedidos: undefined
					};
					ret.push(obj);
				}

				obj.cantidadpedidos += pedido.cantidadpedidos;

				if (typeof(obj.profundidadpedidos) === 'undefined' || obj.profundidadpedidos < pedido.profundidadpedidos) {
					obj.profundidadpedidos = pedido.profundidadpedidos;
				}

				map[id] = obj;
			}
		}

		for (let i = 0 ; i < ret.length ; i++) {
			let item = ret[i];

			item.faltamateriales = item.cantidadpedidos - item.stockmateriales - item.haciendomateriales;
		}

		return ret;
	},
	getMapa(mapa, id, mapas, lista) {
		let ret = mapas[mapa];

		if (!ret) {
			ret = lista.crearMapa(id);
		}

		return ret;
	},
	insertar(tabla, par, callback, error) {
		let url = 'http://localhost:3000/' + tabla;
		ajax({
			metodo: 'POST',
			url: url,
			params: par,
			success: callback,
			error: error
		});
	},
	eliminar(tabla, id_campo, id, callback, error) {
		let url = 'http://localhost:3000/' + tabla + '/' + id;

		ajax({
			metodo: 'DELETE',
			url: url,
			success: callback,
			error: error
		});
	},
	editar(tabla, par, id_campo, id, callback, error) {
		let url = 'http://localhost:3000/' + tabla + '/' + id;

		ajax({
			metodo: 'PUT',
			url: url,
			params: par,
			success: callback,
			error: error
		});
	},
	limpiarPedidos(id, cantidad, bd, callback, error) {
		let mapas = {};

		let tipo_pedido_otros = bd.tipos_pedido.buscar('auxtipos_pedido', true);
		let pedidos = bd.pedidos.filter(item => {
			return item.materialpedidos == id && item.tipopedidos == tipo_pedido_otros.id;
		});
		if (pedidos.length) {
			let pedido = pedidos.sort((a, b) => {
				return a.profundidadpedidos < b.profundidadpedidos;
			})[0];

			let dif = pedido.cantidadpedidos - cantidad;
			if (dif > 0) {
				pedido.cantidadpedidos = dif;
				this.editar('pedidos',pedido,'id',pedido.id, callback, error);
			} else {
				this.eliminar('pedidos','id',pedido.id, () => {
					bd.pedidos.splice(bd.pedidos.indexOf(pedido), 1);
					if (dif < 0) {
						this.limpiarPedidos(id, cantidad + dif, bd, callback, error);
					} else {
						callback();
					}
				} );
			}
		} else {
			throw new Error('No hay pedidos de ' + bd.materiales.buscar('id', id).nombremateriales);
		}
	},
	recogerMaterial(id, bd, callback, error) {
		let mapas = {};

		let materiales = this.getMapa('materiales','id',mapas,bd.materiales);
		let material = materiales[id];

		if (material.haciendomateriales > 0) {

			material.haciendomateriales -= material.hacemateriales;
			material.stockmateriales += material.hacemateriales;

			this.editar('materiales',material,'id',id,callback, error);
		} else {
			throw new Error('No hay nada que recoger');
		}
	},
	hacerMaterial(id, cantidad, bd, callback, error) {
		let mapas = {};

		let materiales = this.getMapa('materiales', 'id', mapas, bd.materiales);
		let material = materiales[id];

		let vistaFabricas = this.getVistaFabricas(bd);
		let mapVistaFabricas = this.getMapa('vistaFabricas','fabricamateriales',mapas,vistaFabricas);
		let fabrica = mapVistaFabricas[material.fabricamateriales];

		if (fabrica.maximofabricas >= 0) {
			if (fabrica.haciendomateriales < fabrica.maximofabricas) {
				let materiales_necesita = this.getVistaMaterialesNecesita(bd).filter(item => {
					return item.materialmateriales_necesita == id;
				});

				let material_necesita_falta = materiales_necesita.buscar(item => {
					return item.cantidadmateriales_necesita - item.stockmaterialesnecesita > 0;
				});
				if (!material_necesita_falta) {

					material.haciendomateriales += material.hacemateriales;
					this.editar('materiales',material,'id',material.id, () => {

						let fnPromesa = (material_necesita, index, resolve, reject) => {
							let dif = material_necesita.stockmaterialesnecesita - material_necesita.cantidadmateriales_necesita;
							let auxMaterial = materiales[material_necesita.materialnecesitamateriales_necesita];
							auxMaterial.stockmateriales = dif;
							this.editar('materiales',auxMaterial,'id',auxMaterial.id, () => {
								this.limpiarPedidos(material_necesita.materialnecesitamateriales_necesita, material_necesita.cantidadmateriales_necesita, bd, resolve, reject);
							} , reject);
						} ;

						materiales_necesita.promesas(fnPromesa, callback, error, this);
					} , error);
				} else {
					throw new Error('Falta ' + material_necesita_falta.nombrematerialesnecesita + '.');
				}
			} else {
				throw new Error('Fábrica completa.');
			}
		} else {
			material.stockmateriales += (material.hacemateriales * cantidad);
			this.editar('materiales',material,'id',material.id, callback, error);
		}
	},
	cerrarPedido(id, bd, callback, error) {
		let mapas = {};

		let vistaPedido = this.getVistaPedido(bd);
		let pedidos = vistaPedido.filter(item => {
			return item.tipopedidos == id;
		});

		let fnPromesa = (pedido, index, resolve, reject) => {
			let materiales = this.getMapa('materiales','id',mapas,bd.materiales);
			let material = materiales[pedido.materialpedidos];
			material.stockmateriales -= pedido.cantidadpedidos
			if (material.stockmateriales < 0) {
				material.stockmateriales = 0;
			}
			this.editar('materiales',material,'id',material.id, resolve, reject);
		} ;
		let successPromesa = () => {
			let pedidos_eliminar = bd.pedidos.filter(item => {
				return item.tipopedidos == id;
			});
			let fnPromesaEliminar = (item, index, resolve, reject) => {
				this.eliminar('pedidos','id',item.id, resolve, reject);
			} ;
			pedidos_eliminar.promesas(fnPromesaEliminar, callback, error, this);
		} ;

		pedidos.promesas(fnPromesa, successPromesa, error, this);
	},
	guardarPedidos(id, cantidad, padrepedidos, hacemateriales, profundidad, bd, callback, error) {
		this.insertar('pedidos', {
			cantidadpedidos: cantidad,
			materialpedidos: id,
			padrepedidos: padrepedidos,
			tipopedidos: bd.tipos_pedido.buscar('auxtipos_pedido', true).id,
			procesadopedidos: true,
			profundidadpedidos: profundidad
		}, pedido => {
			let idpedidos = pedido.id;

			bd.pedidos.push(pedido);

			let mapas = {};

			let vistaMaterialesProcesar = this.getVistaMaterialesProcesar(bd);
			let mapVistaMaterialesProcesar = this.getMapa('vistaMaterialesProcesar', 'materialpedidos', mapas, vistaMaterialesProcesar);
			let material = mapVistaMaterialesProcesar[id];

			let cantidad2 = material.faltamateriales;

			if (cantidad2 > 0) {
				if (cantidad2 > cantidad) {
					cantidad2 = cantidad;
				}
				let materiales_necesita = bd.materiales_necesita.filter(item => {
					return item.materialmateriales_necesita == id;
				});

				let fnPromesa = (material_necesita, index, resolve, reject) => {
					let cantidad2 = material.faltamateriales;

					if (cantidad2 > 0) {
						if (cantidad2 > pedido.cantidadpedidos) {
							cantidad2 = pedido.cantidadpedidos;
						}
						this.guardarPedidos(material_necesita.materialnecesitamateriales_necesita,
							Math.ceil(material_necesita.cantidadmateriales_necesita * cantidad2 / material.hacemateriales),
							idpedidos,
							material.hacemateriales,
							profundidad+1,
							bd,
							resolve,
							reject);
					} else {
						resolve();
					}
				} ;

				materiales_necesita.promesas(fnPromesa, callback, error, this);
			} else {
				callback();
			}
		} , error);
	},
	procesarPedido(id, bd, callback, error) {

		let pedido = bd.pedidos.buscar('id', id);

		if (pedido.procesadopedidos) {
			callback();
		} else {
			let mapas = {};

			pedido.procesadopedidos = true;
			this.editar('pedidos',pedido,'id',pedido.id, () => {
				let vistaMaterialesProcesar = this.getVistaMaterialesProcesar(bd);
				let mapVistaMaterialesProcesar = this.getMapa('vistaMaterialesProcesar', 'materialpedidos', mapas, vistaMaterialesProcesar);
				let material = mapVistaMaterialesProcesar[pedido.materialpedidos];

				if (material.cantidadpedidos > material.stockmateriales + material.haciendomateriales) {
					let materiales_necesita = bd.materiales_necesita.filter(item => {
						return item.materialmateriales_necesita == pedido.materialpedidos;
					});

					let fnPromesa = (material_necesita, index, resolve, reject) => {
						let cantidad2 = material.faltamateriales;

						if (cantidad2 > 0) {
							if (cantidad2 > pedido.cantidadpedidos) {
								cantidad2 = pedido.cantidadpedidos;
							}
							this.guardarPedidos(material_necesita.materialnecesitamateriales_necesita,
								Math.ceil(material_necesita.cantidadmateriales_necesita * cantidad2 / material.hacemateriales),
								pedido.id,
								material.hacemateriales,
								1,
								bd,
								resolve,
								reject);
						} else {
							resolve();
						}
					} ;

					materiales_necesita.promesas(fnPromesa, callback, error, this);
				} else {
					callback();
				}
			} , error);
		}
	},
	procesarPedidos(id, bd, callback, error) {
		let pedidos_filtrados = bd.pedidos.filter(item => {
			return item.tipopedidos == id;
		});

		let fnPromesa = (item, index, resolve, reject) => {
			this.procesarPedido(item.id, bd, resolve, reject);
		} ;

		pedidos_filtrados.promesas(fnPromesa, callback, error, this);
	},
	gestionarError(err) {
		throw err;
	},
	accion(accion, par_accion, tabla) {
		this.cargarBD(data => {
			let fn = typeof(accion) === 'string' ? this[accion] : accion;

			if (typeof(fn) === 'function') {
				if (! (par_accion instanceof Array)) {
					par_accion = [];
				}
				par_accion.push(data);
				par_accion.push(() => {
					tabla.setState({velo: false}, () => {
						this.refrescarInicio();
					} );
				} );
				par_accion.push(this.gestionarError);
				try {
					tabla.setState({velo: true}, () => {
						fn.apply(this, par_accion);
					} );
				} catch (err) {
					//console.error(err);
					tabla.setState({velo: false}, () => {
						this.setDialogo({
							titulo: 'Error',
							puedeCerrar: true,
							contenido: err.message
						});
					} );
				}
			} else {
				this.gestionarError('Acción ' + accion + ' inválida');
			}
		} , this.gestionarError);
	},
	accionRecogerMaterial(tag, fila, tabla, panel) {
		this.accion(this.recogerMaterial, [fila.props.datos.materialpedidos], tabla);
	},
	accionHacerMaterial(tag, fila, tabla, panel) {
		this.accion(this.hacerMaterial, [fila.props.datos.materialpedidos, 1], tabla);
	},
	accionHacerMaterial3(tag, fila, tabla, panel) {
		this.accion(this.hacerMaterial, [fila.props.datos.materialpedidos, 3], tabla);
	},
	accionHacerMaterial6(tag, fila, tabla, panel) {
		this.accion(this.hacerMaterial, [fila.props.datos.materialpedidos, 6], tabla);
	},
	accionCerrarPedido(tag, fila, tabla, panel) {
		this.accion(this.cerrarPedido, [fila.props.datos.idtipos_pedido], tabla);
	},
	accionProcesarPedidos(tag, fila, tabla, panel) {
		this.accion(this.procesarPedidos, [fila.props.datos.idtipos_pedido], tabla);
	},
	accionProcesarPedido(tag, fila, tabla, panel) {
		this.accion(this.procesarPedido, [fila.props.datos.idpedidos], tabla);
	},
	accionVerPedido(tag, fila, tabla, panel) {
		this.setState({ pedido_ver: fila.props.datos }, () => {
			this.refs.pedido.refs.tabla.refrescar();
			this.refs.pedido.dimensionar();
		} );
	},
	claseFilaNecesita(datos) {
		let clase;
		if (datos.stockmateriales >= datos.cantidadpedidos) {
			clase = 'bueno';
		} else if (datos.stockmateriales + datos.haciendomateriales >= datos.cantidadpedidos) {
			clase = 'medio';
		} else if (datos.maximofabricas == -1) {
			clase = 'huerto';
		} else if (datos.haciendofabricas < datos.maximofabricas) {
			clase = 'malo';
		}

		if (clase == 'malo') {
			if (!datos.faltanecesita) {
				clase = 'nulo';
			}
		}

		return clase;
	},
	claseFilaPedidos(datos) {
		let clase;
		if (datos.procesadopedidos) {
			if (datos.faltapedidos) {
				clase = 'malo';
			} else {
				clase = 'bueno';
			}
		}

		return clase;
	},
	claseFilaPedido(datos) {
		let clase;
		if (datos.procesadopedidos) {
			if (datos.stockmateriales >= datos.cantidadpedidos) {
				clase = 'bueno';
			} else if (datos.stockmateriales + datos.haciendomateriales >= datos.cantidadpedidos) {
				clase = 'medio';
			} else if (datos.maximofabricas == -1) {
				clase = 'huerto';
			} else if (datos.haciendofabricas < datos.maximofabricas) {
				clase = 'malo';
			}

			if (clase == 'malo') {
				if (!datos.faltanecesita) {
					clase = 'nulo';
				}
			}
		}

		return clase;
	},
	refrescarInicio() {
		for (let key in this.refs) {
			let panel = this.refs[key];
			if (typeof (panel.refrescar) === 'function') {
				panel.refrescar();
			}
		}
	},
	dimensionar() {
		let altoPadre = window.innerHeight;
		let menu = ReactDOM.findDOMNode(this.refs.menu);
		let altoMenu = menu.offsetHeight;
		let alto = altoPadre - altoMenu;

		this.setState({alto:alto}, () => {
			for (let i in this.refs) {
				let ref = this.refs[i];

				if (typeof(ref.dimensionar) === 'function') {
					ref.dimensionar();
				}
			}
		} );
	},
	accionMenu(tag) {
		this.setState({contenido:tag}, () => {
			this.dimensionar();
		} );
	},
	onClickAcciones(tag, fila, tabla, panel) {
		if (typeof(this[tag]) === 'function') {
			this[tag].apply(this, arguments);
		}
	},
	setDialogo(dialogo) {
		this.setState({dialogo:dialogo});
	},
	renderInicio() {
		let ret = [];

		for (let i = 0 ; i < this.props.config.inicio.length ; i++) {
			let config = this.props.config.inicio[i];
			ret.push(
				<PanelTabla	
					ref={config.id}
					key={config.id}
					id={config.id}
					titulo={config.titulo}
					url={config.url}
					orden={config.orden}
					id_campo={config.id_campo}
					cols={this[config.cols]()}
					acciones={this[config.acciones]()}
					claseFila={this[config.claseFila]}
					parseData={this[config.parseData]}
					onClickAcciones={this.onClickAcciones}
				/>
			);
		}

		if (this.state.pedido_ver) {
			let params = {
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
					orden={this.props.config.inicio_pedido.orden}
					id_campo={this.props.config.inicio_pedido.id_campo}
					cols={this[this.props.config.inicio_pedido.cols]()}
					acciones={this[this.props.config.inicio_pedido.acciones]()}
					parseData={this[this.props.config.inicio_pedido.parseData]}
					claseFila={this[this.props.config.inicio_pedido.claseFila]}
					onClickAcciones={this.onClickAcciones}
				/>
			);
		}

		return ret;
	},
	renderContenido(e) {
		let ret = '';

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
	renderStyle() {
		let ret = {};

		if (this.state.alto) {
			ret.height = this.state.alto + 'px';
		}

		return ret;
	},
	renderDialogo() {
		let ret = '';

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
	render() {
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
