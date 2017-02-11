import React from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux'
import { fetchBD } from './actions'

import Menu from '../web/js/lib/nreactjs/jsx/menu.jsx'
import PanelTabla from '../web/js/lib/nreactjs/jsx/panel_tabla.jsx'
import Panel from '../web/js/lib/nreactjs/jsx/panel.jsx'
import ListaTabla from '../web/js/lib/nreactjs/jsx/lista_tabla.jsx'
import Dialogo from '../web/js/lib/nreactjs/jsx/dialogo.jsx'
import Combo from '../web/js/lib/nreactjs/jsx/combo.jsx'
import TextField from '../web/js/lib/nreactjs/jsx/textfield.jsx'
import Boton from '../web/js/lib/nreactjs/jsx/boton.jsx'

class App extends React.Component {
	static propTypes = {
		bd: React.PropTypes.object.isRequired,
		dispatch: React.PropTypes.func.isRequired
	}
	constructor(props) {
		super(props);

		this.parseDataHuerto = this.parseDataHuerto.bind(this);
		this.parseDataNecesitaMateriales = this.parseDataNecesitaMateriales.bind(this);
		this.parseDataPedidos = this.parseDataPedidos.bind(this);
		this.parseDataPedido = this.parseDataPedido.bind(this);
		this.parseDataNecesita = this.parseDataNecesita.bind(this);
		this.parseDataExcedente = this.parseDataExcedente.bind(this);
		this.accionMenu = this.accionMenu.bind(this);
		this.onClickAcciones = this.onClickAcciones.bind(this);
		this.setDialogo = this.setDialogo.bind(this);
		this.renderContenidoNuevoPedido = this.renderContenidoNuevoPedido.bind(this);
		this.onResizeFilaNuevoPedido = this.onResizeFilaNuevoPedido.bind(this);
		this.dimensionar = this.dimensionar.bind(this);
		this.dimensionarNuevoPedido = this.dimensionarNuevoPedido.bind(this);
		this.crearNuevoPedido = this.crearNuevoPedido.bind(this);
		this.state = {
			contenido: 'inicio',
			dataset_tipopedidos: [],
			cargando_dataset_tipopedidos: false,
			alto: undefined,
			dialogo: undefined
		};
	}
	componentDidMount() {
		this.dimensionar();
		window.onresize = e => {
			this.dimensionar();
		};
		const { dispatch, config } = this.props
		dispatch(fetchBD(config.url))
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.config && this.props.config && nextProps.config.url !== this.props.config.url) {
			const { dispatch, config } = nextProps
			dispatch(fetchBD(config.url))
		}
	}
	componentDidUpdate() {

		if (this.state.contenido == 'nuevo_pedido') {
			if (!this.state.cargando_dataset_tipopedidos && !this.state.dataset_tipopedidos.length) {
				this.setState({cargando_dataset_tipopedidos:true},()=>{
					ajax({
						metodo: 'get',
						url: this.props.config.nuevo_pedido.tipopedido.url,
						params: {
							_sort: this.props.config.nuevo_pedido.tipopedido.texto,
							_order: 'ASC'
						},
						success: response => {
							if (this.state.contenido == 'nuevo_pedido') {
								this.setState({dataset_tipopedidos: response, cargando_dataset_tipopedidos:false});
							}
						}
					});
				});
			}
		} else {
			if (this.state.dataset_tipopedidos.length) {
				this.setState({dataset_tipopedidos: [], cargando_dataset_tipopedidos:false});
			}
		}
	}
	onResizeFilaNuevoPedido(offset, fila, tabla, lista) {
		console.log(arguments);
	}
	parseDataPedido(data, tabla, panel) {
		return this.getVistaPedido(data).filter(item => {
			return item.tipopedidos == panel.props.params.idtipos_pedido
		});
	}
	parseDataPedidos(data, tabla, panel) {

		let ret = [];
		let map = {};
		let mapas = {};


		let pedidos_dinamicos = this.getPedidosDinamicos(data);
		for (let i = 0 ; i < pedidos_dinamicos.length ; i++) {
			let pedido = pedidos_dinamicos[i];

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
					procesadopedidos: 0, // 1: Todos, 0: Ninguno, -1: Alguno
					faltapedidos: faltapedidos,
					nombretipos_pedido: tipo_pedido.nombretipos_pedido,
					stockmateriales: material.stockmateriales,
					haciendomateriales: material.haciendomateriales
				};
				ret.push(obj);
			}

			obj.cantidadpedido += pedido.cantidadpedidos;

			if (pedido.procesadopedidos && obj.procesadopedidos === 0) {
				obj.procesadopedidos = 1;
			} else if (!pedido.procesadopedidos && obj.procesadopedidos === 1) {
				obj.procesadopedidos = -1;
			}

			obj.faltapedidos = (obj.faltapedidos || faltapedidos);

			map[id] = obj;
		}

		return ret;
	}
	parseDataNecesitaMateriales(data, tabla, panel) {
		let vistaNecesita = this.getVistaNecesita(data,item=>item.stockmateriales + item.haciendomateriales < item.cantidadpedidos);

		let ret = vistaNecesita.filter(item => {
			return (item.procesadopedidos && !!~item.maximofabricas) && item.stockmateriales + item.haciendomateriales < item.cantidadpedidos;
		});

		return ret;
	}
	parseDataNecesita(data, tabla, panel) {
		let vistaNecesita = this.getVistaNecesita(data,item=>item.stockmateriales < item.cantidadpedidos, true);

		let ret = vistaNecesita.filter(item => {
			return item.haciendomateriales > 0;
		});

		return ret;

/*
		let ret = [];
		let map = {};
		let mapas = {};

		let vistaFabricas = this.getVistaFabricas(data);
		let vistaMaterialesFalta = this.getVistaMaterialesFalta(data);

		let materiales = this.getMapa('materiales','id',mapas,data.materiales);

		let pedidos_dinamicos = this.getPedidosDinamicos(data);

		let parsePedidos = (material,pedidos_dinamicos)=>{
			let mapVistaFabricas = this.getMapa('vistaFabricas','fabricamateriales',mapas,vistaFabricas);
			let fabrica = mapVistaFabricas[material.fabricamateriales];

			let mapVistaMaterialesFalta = this.getMapa('vistaMaterialesFalta','idmateriales',mapas,vistaMaterialesFalta);
			let material_falta = mapVistaMaterialesFalta[material.id];

			let obj = map[material.id];
			if (!obj) {
				obj = {
					materialpedidos: material.id,
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
				map[material.id] = obj;
				*/
	}
	parseDataExcedente(data, tabla, panel) {
		return this.getVistaExcedente(data);
	}
	parseDataHuerto(data, tabla, panel) {
		let vistaNecesita = this.getVistaNecesita(data,item=>item.stockmateriales + item.haciendomateriales < item.cantidadpedidos);

		let ret = vistaNecesita.filter(item => {
			return (item.procesadopedidos && !~item.maximofabricas) && item.stockmateriales < item.cantidadpedidos;
		});

		return ret;
	}
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
	}
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
	}
	colsExcedente() {
		return [{
			texto: 'MATERIAL',
			campo: 'nombremateriales'
		}, {
			texto: 'STOCK',
			campo: 'stockmateriales',
			tipo: 'int'
		}, {
			texto: 'HACIENDO',
			campo: 'haciendomateriales',
			tipo: 'int'
		}, {
			texto: 'PEDIDOS PRO',
			campo: 'cantidadpedidosprocesados',
			tipo: 'int'
		}, {
			texto: 'PEDIDOS',
			campo: 'cantidadpedidos',
			tipo: 'int'
		}, {
			texto: 'EXCEDENTE PRO',
			campo: 'excedentematerialesprocesados',
			tipo: 'int'
		}, {
			texto: 'EXCEDENTE',
			campo: 'excedentemateriales',
			tipo: 'int'
		}, {
			texto: 'FABRICA',
			campo: 'nombrefabricas'/*,
			filtro: {
				tipo: 'object',
				dataset: 'http://localhost:3000/fabricas',
				campo_texto: 'nombrefabricas',
				campo_valor: 'nombrefabricas'
			}*/
		}];
	}
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
	}
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
	}
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
	}
	accionesNecesitaMateriales() {
		return [{
			texto: 'hacer',
			tag: 'accionHacerMaterial'
		}];
	}
	accionesNecesita() {
		return [{
			texto: 'recoger',
			tag: 'accionRecogerMaterial'
		},{
			texto: 'todo',
			tag: 'accionRecogerTodoMaterial'
		}];
	}
	accionesExcedente() {
		return [{
			texto: 'ganar',
			tag: 'accionGanarMaterial'
		},{
			texto: 'vender',
			tag: 'accionVenderMaterial'
		}];
	}
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
	}
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
	}
	calcularTotales(par) {
		let ret = {};

		for (let i in par) {
			ret[i] = this.calcularTotal(par[i]);
			if (par.item) {
				par.item[i] = ret[i];
			}
		}

		return ret;
	}
	calcularTotal(par) {
		let ret = par.defecto;

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
	}
	getPedidosDinamicos(data) {
		let ret = [];
		let mapas = {};

		let cantidadMaterialPedidos = id_material=>{
			let num = 0;

			for (let i = 0 ; i < ret.length ; i++) {
				let pedido = ret[i];

				if (pedido.procesadopedidos && pedido.materialpedidos == id_material) {
					num += pedido.cantidadpedidos;
				}
			}

			return num;
		};

		let generarId= ()=>{
			let num = 1;
			while (	ret.buscar('id',num) ||
					data.pedidos.buscar('id',num)) {
				num++;
			};

			return num;
		};

		let materiales = this.getMapa('materiales','id',mapas,data.materiales);
		let hacerMaterialNecesita = (material_padre, profundidad, cantidad)=>{
			let materiales_necesita = data.materiales_necesita.filter(material_necesita=>material_necesita.materialmateriales_necesita==material_padre.id);
			if (materiales_necesita.length) {
				let stock = material_padre.stockmateriales;
				let haciendo = material_padre.haciendomateriales;
				let cantidad_pedido = cantidadMaterialPedidos(material_padre.id);
				let necesita = cantidad + cantidad_pedido - stock - haciendo;

				if (necesita > 0) {
					let pedido_necesita = necesita;
					if (pedido_necesita > cantidad) {
						pedido_necesita = cantidad;
					}
					for (let i = 0 ; i < materiales_necesita.length ; i++) {
						let material_necesita = materiales_necesita[i];

						let material = materiales[material_necesita.materialnecesitamateriales_necesita];
						let pedido = ret.buscar(pedido=>pedido.tipopedidos==6 && pedido.materialpedidos==material.id);
						let insertar = false;
						if (!pedido) {
							pedido = {
								tipopedidos: 6,
								materialpedidos: material.id,
								procesadopedidos: true,
								cantidadpedidos: 0,
								profundidadpedidos: profundidad,
								id: generarId()
							};
							insertar = true;
						}
						if (pedido.profundidadpedidos < profundidad) {
							pedido.profundidadpedidos = profundidad;
						}

						let cantidad_hace = Math.ceil(pedido_necesita / material_padre.hacemateriales);
						let cantidad_necesita = cantidad_hace * material_necesita.cantidadmateriales_necesita;
						//let pedido_cantidadpedidos = cantidad_necesita - pedido.cantidadpedidos;
						hacerMaterialNecesita(material, profundidad + 1, cantidad_necesita);
						pedido.cantidadpedidos += cantidad_necesita;
						insertar && ret.push(pedido);
					}
				}
			}
		};

		for (let i = 0 ; i < data.pedidos.length ; i++) {
			let pedido = data.pedidos[i];

			if (pedido.procesadopedidos) {
				let material = materiales[pedido.materialpedidos];

				hacerMaterialNecesita(material, pedido.profundidadpedidos + 1, pedido.cantidadpedidos);
			}
			ret.push(pedido);
		}

		return ret;
	}
	getVistaMaterialesProcesar(data) {
		let ret = [];
		let map = {};

		let pedidos_dinamicos = this.getPedidosDinamicos(data);
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

			let pedidos = pedidos_dinamicos.filter(item => {
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
	}
	getVistaPedido(bd) {
		let ret = [];
		let map = {};
		let mapas = {};

		let vistaFabricas = this.getVistaFabricas(bd);
		let vistaMaterialesFalta = this.getVistaMaterialesFalta(bd);
		let pedidos_dinamicos = this.getPedidosDinamicos(bd);

		for (let i = 0 ; i < pedidos_dinamicos.length ; i++) {
			let pedido = pedidos_dinamicos[i];

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
	}
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
	}
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
					},
					defecto: true
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
	}
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
	}
	getVistaNecesita(data,calcularProfundidad,sinpedidos) {
		let ret = [];
		let map = {};
		let mapas = {};

		let vistaFabricas = this.getVistaFabricas(data);
		let vistaMaterialesFalta = this.getVistaMaterialesFalta(data);

		let pedidos_dinamicos = this.getPedidosDinamicos(data);

		let mapVistaFabricas = this.getMapa('vistaFabricas','fabricamateriales',mapas,vistaFabricas);
		let mapVistaMaterialesFalta = this.getMapa('vistaMaterialesFalta','idmateriales',mapas,vistaMaterialesFalta);

		let calcularPedidos = (material, pedidos)=>{
			if (sinpedidos || pedidos.length) {
				let fabrica = mapVistaFabricas[material.fabricamateriales];
				let material_falta = mapVistaMaterialesFalta[material.id];

				let obj = map[material.id];
				if (!obj) {
					obj = {
						materialpedidos: material.id,
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
					map[material.id] = obj;
				}

				for (let i = 0 ; i < pedidos.length ; i++) {
					let pedido = pedidos[i];

					if (pedido.procesadopedidos) {
						obj.cantidadpedidos += pedido.cantidadpedidos;

						if (typeof(obj.profundidadpedidos) === 'undefined' && calcularProfundidad(obj)) {
							obj.profundidadpedidos = pedido.profundidadpedidos;
						}
					}
				}
			}
		};

		for (let i = 0 ; i < data.materiales.length ; i++) {
			let material = data.materiales[i];
			let pedidos = pedidos_dinamicos.filter(item=>item.materialpedidos==material.id).sort((a,b)=>a.profundidadpedidos==b.profundidadpedidos ? 0 : a.profundidadpedidos>b.profundidadpedidos ? -1 : 1);

			calcularPedidos(material, pedidos);
		}

		for (let i = 0 ; i < ret.length ; i++) {
			let item = ret[i];

			item.faltamateriales = item.cantidadpedidos - item.stockmateriales - item.haciendomateriales;
		}

		return ret;
	}
	getVistaExcedente(data) {
		let ret = [];
		let map = {};
		let mapas = {};

		let vistaFabricas = this.getVistaFabricas(data);
		let pedidos_dinamicos = this.getPedidosDinamicos(data);

		for (let i = 0 ; i < data.materiales.length ; i++) {
			let material = data.materiales[i];

			let id = material.id;

			let mapVistaFabricas = this.getMapa('vistaFabricas','fabricamateriales',mapas,vistaFabricas);
			let fabrica = mapVistaFabricas[material.fabricamateriales];

			let materialpedidos = pedidos_dinamicos.filter(item => {
				return item.materialpedidos == id;
			});
			let materialpedidosprocesados = materialpedidos.filter(item => {
				return item.procesadopedidos;
			});
			let cantidadmaterialpedidos = materialpedidos.calcular('cantidadpedidos');
			let cantidadmaterialpedidosprocesados = materialpedidosprocesados.calcular('cantidadpedidos');

			let obj = map[id];
			if (!obj) {
				obj = {
					materialpedidos: id,
					nombremateriales: material.nombremateriales,
					stockmateriales: material.stockmateriales,
					haciendomateriales: material.haciendomateriales,
					cantidadpedidos: cantidadmaterialpedidos,
					cantidadpedidosprocesados: cantidadmaterialpedidosprocesados,
					excedentemateriales: material.stockmateriales - cantidadmaterialpedidos,
					excedentematerialesprocesados: material.stockmateriales - cantidadmaterialpedidosprocesados,
					nombrefabricas: fabrica.nombrefabricas,
					eshuerto: fabrica.maximofabricas == -1
				};
				ret.push(obj);
			}

			map[id] = obj;
		}

		return ret;
	}
	getMapa(mapa, id, mapas, lista) {
		let ret = mapas[mapa];

		if (!ret) {
			ret = lista.crearMapa(id);
		}

		return ret;
	}
	insertar(tabla, par, callback, error) {
		let url = 'http://localhost:3000/' + tabla;
		ajax({
			metodo: 'POST',
			url: url,
			params: par,
			success: callback,
			error: error
		});
	}
	eliminar(tabla, id_campo, id, callback, error) {
		let url = 'http://localhost:3000/' + tabla + '/' + id;

		ajax({
			metodo: 'DELETE',
			url: url,
			success: callback,
			error: error
		});
	}
	editar(tabla, par, id_campo, id, callback, error) {
		let url = 'http://localhost:3000/' + tabla + '/' + id;

		ajax({
			metodo: 'PUT',
			url: url,
			params: par,
			success: callback,
			error: error
		});
	}
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
	}
	recogerTodoMaterial(id, bd, callback, error) {
		let mapas = {};

		let materiales = this.getMapa('materiales','id',mapas,bd.materiales);
		let material = materiales[id];

		if (material.haciendomateriales > 0) {

			material.stockmateriales += material.haciendomateriales;
			material.haciendomateriales = 0;

			this.editar('materiales',material,'id',id,callback, error);
		} else {
			throw new Error('No hay nada que recoger');
		}
	}
	venderMaterial(id, bd, callback, error) {
		let mapas = {};

		let materiales = this.getMapa('materiales','id',mapas,bd.materiales);
		let material = materiales[id];

		if (material.stockmateriales > 0) {

			material.stockmateriales--;

			this.editar('materiales',material,'id',id,callback, error);
		} else {
			throw new Error('No hay nada que vender');
		}
	}
	ganarMaterial(id, bd, callback, error) {
		let mapas = {};

		let materiales = this.getMapa('materiales','id',mapas,bd.materiales);
		let material = materiales[id];

		material.stockmateriales++;

		this.editar('materiales',material,'id',id,callback, error);
	}
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

					material.haciendomateriales += (material.hacemateriales * cantidad);
					this.editar('materiales',material,'id',material.id, () => {

						let fnPromesa = (material_necesita, index, resolve, reject) => {
							let dif = material_necesita.stockmaterialesnecesita - material_necesita.cantidadmateriales_necesita;
							dif *= cantidad;
							let auxMaterial = materiales[material_necesita.materialnecesitamateriales_necesita];
							auxMaterial.stockmateriales = dif;
							this.editar('materiales',auxMaterial,'id',auxMaterial.id, resolve, reject);
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
	}
	cerrarPedido(id, bd, callback, error) {
		let mapas = {};

		let vistaPedido = this.getVistaPedido(bd);
		let pedidos = vistaPedido.filter(item => {
			return item.tipopedidos == id;
		});

		let fnPromesa = (pedido, index, resolve, reject) => {
			if (pedido.novacia_pedido) {
				resolve();
			} else {
				let materiales = this.getMapa('materiales','id',mapas,bd.materiales);
				let material = materiales[pedido.materialpedidos];
				material.stockmateriales -= pedido.cantidadpedidos
				if (material.stockmateriales < 0) {
					material.stockmateriales = 0;
				}
				this.editar('materiales',material,'id',material.id, resolve, reject);
			}
		};
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
	}
	procesarPedido(id, bd, callback, error) {

		let pedido = bd.pedidos.buscar('id', id);

		if (pedido.procesadopedidos) {
			callback();
		} else {
			pedido.procesadopedidos = true;
			this.editar('pedidos',pedido,'id',pedido.id, callback, error);
		}
	}
	procesarPedidos(id, bd, callback, error) {
		let pedidos_filtrados = bd.pedidos.filter(item => {
			return item.tipopedidos == id;
		});

		let fnPromesa = (item, index, resolve, reject) => {
			this.procesarPedido(item.id, bd, resolve, reject);
		} ;

		pedidos_filtrados.promesas(fnPromesa, callback, error, this);
	}
	gestionarError(err) {
		throw err;
	}
	cargarBD() {
		return new Promise((resolve, reject)=>{
			ajax({
				metodo: 'get',
				url: 'http://localhost:3000/db',
				success: resolve,
				error: reject
			});
		});
	}
	accion(accion, par_accion, tabla) {
		this.cargarBD()
		.then(data => {
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
			}).catch(this.gestionarError);
	}
	accionRecogerMaterial(tag, fila, tabla, panel) {
		this.accion(this.recogerMaterial, [fila.props.datos.materialpedidos], tabla);
	}
	accionRecogerTodoMaterial(tag, fila, tabla, panel) {
		this.accion(this.recogerTodoMaterial, [fila.props.datos.materialpedidos], tabla);
	}
	accionVenderMaterial(tag, fila, tabla, panel) {
		this.accion(this.venderMaterial, [fila.props.datos.materialpedidos], tabla);
	}
	accionGanarMaterial(tag, fila, tabla, panel) {
		this.accion(this.ganarMaterial, [fila.props.datos.materialpedidos], tabla);
	}
	accionHacerMaterial(tag, fila, tabla, panel) {
		this.accion(this.hacerMaterial, [fila.props.datos.materialpedidos, 1], tabla);
	}
	accionHacerMaterial3(tag, fila, tabla, panel) {
		this.accion(this.hacerMaterial, [fila.props.datos.materialpedidos, 3], tabla);
	}
	accionHacerMaterial6(tag, fila, tabla, panel) {
		this.accion(this.hacerMaterial, [fila.props.datos.materialpedidos, 6], tabla);
	}
	accionCerrarPedido(tag, fila, tabla, panel) {
		this.accion(this.cerrarPedido, [fila.props.datos.idtipos_pedido], tabla);
	}
	accionProcesarPedidos(tag, fila, tabla, panel) {
		this.accion(this.procesarPedidos, [fila.props.datos.idtipos_pedido], tabla);
	}
	accionProcesarPedido(tag, fila, tabla, panel) {
		this.accion(this.procesarPedido, [fila.props.datos.idpedidos], tabla);
	}
	accionVerPedido(tag, fila, tabla, panel) {
		this.setState({ pedido_ver: fila.props.datos }, () => {
			this.refs.pedido.refs.tabla.refrescar();
			this.refs.pedido.dimensionar();
		} );
	}
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
	}
	claseFilaExcedente(datos) {
		let clase;
		if (datos.eshuerto) {
			clase = 'huerto';
		} else if (datos.excedentemateriales > 0 || datos.excedentematerialesprocesados > 0) {
				clase = 'bueno';
		} else if (datos.stockmateriales + datos.haciendomateriales >= datos.cantidadpedidos) {
			clase = 'medio';
		} else {
			clase = 'malo';
		}

		return clase;
	}
	claseFilaPedidos(datos) {
		let clase;
		if (datos.faltapedidos) {
			if (datos.procesadopedidos === 1) {
				clase = 'malo';
			} else if (datos.procesadopedidos === -1) {
				clase = 'huerto';
			}
		} else {
			if (datos.procesadopedidos === 1) {
				clase = 'bueno';
			} else if (datos.procesadopedidos === -1) {
				clase = 'medio';
			}
		}

		return clase;
	}
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
		} else {
			clase = 'huerto';
		}

		return clase;
	}
	refrescarInicio() {
		for (let key in this.refs) {
			let panel = this.refs[key];
			if (typeof (panel.refrescar) === 'function') {
				panel.refrescar();
			}
		}
	}
	dimensionar() {
		let altoPadre = window.innerHeight;
		let menu = ReactDOM.findDOMNode(this.refs.menu);
		let altoMenu = menu.offsetHeight;
		let alto = altoPadre - altoMenu;

		this.setState({alto:alto}, () => {
			for (let i in this.refs) {
				let ref = this.refs[i];

				if (typeof(ref.dimensionar) === 'function') {
					ref.dimensionar(alto);
				}
			}
		} );
	}
	accionMenu(tag) {
		this.setState({contenido:tag}, () => {
			this.dimensionar();
		} );
	}
	onClickAcciones(tag, fila, tabla, panel) {
		if (typeof(this[tag]) === 'function') {
			this[tag].apply(this, arguments);
		}
	}
	setDialogo(dialogo) {
		this.setState({dialogo:dialogo});
	}
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
					url2={config.url}
					orden={config.orden}
					id_campo={config.id_campo}
					cols={this[config.cols]()}
					acciones={this[config.acciones]()}
					claseFila={this[config.claseFila]}
					parseData2={this[config.parseData]}
					onClickAcciones={this.onClickAcciones}
					filtros={false}
					bd={this.props.bd}
					filas={this.props.bd[config.source]}
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
					filtros={false}
				/>
			);
		}

		return ret;
	}
	renderExcedente() {
		let ret = [];

		let config = this.props.config.excedente;
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

		return ret;
	}
	crearNuevoPedido() {
		let dialogo = texto=>{
			return dialogo = {
				titulo: 'Error',
				puedeCerrar: true,
				contenido: texto
			};
		};
		try {
			let panel = this.refs.panel_nuevo_pedido;
			let tipopedido = panel.refs.tipopedido.getValor();
			if (tipopedido) {
				let profundidad = panel.refs.tipopedido.getValorItem().profundidadtipos_pedido;
				let tabla_nuevo_pedido = panel.refs.tabla_nuevo_pedido.getValor();
				if (tabla_nuevo_pedido.length) {
					for (let i = 0 ; i < tabla_nuevo_pedido.length ; i++) {
						let item = tabla_nuevo_pedido[i];

						item.tipopedidos = parseInt(tipopedido);
						item.profundidadpedidos = parseInt(profundidad);
						item.procesadopedidos = false;

						delete item.id;
					}

					let fnPromesa = (item, index, resolve, reject) => {
						this.insertar('pedidos',item,resolve, reject);
					} ;

					tabla_nuevo_pedido.promesas(fnPromesa, ()=>{
						this.accionMenu('inicio');
					}, this.gestionarError, this);
				} else {
					this.setDialogo(dialogo('Debe haber seleccionado algún material.'));
				}
			} else {
				this.setDialogo(dialogo('Hay que seleccionar el Tipo de Pedido.'));
			}
		} catch (e){
			this.setDialogo(dialogo(e.message));
		}
	}
	renderContenidoNuevoPedido() {
		let ret = [];

		if (this.state.dataset_tipopedidos.length) {
			ret.push(
				<Combo
					key="tipopedido"
					ref="tipopedido"
					titulo={this.props.config.nuevo_pedido.tipopedido.titulo}
					combo={this.props.config.nuevo_pedido.tipopedido}
					dataset={this.state.dataset_tipopedidos}
					onLoad={this.dimensionar}
				/>);
			ret.push(
				<Boton
					key="aceptar"
					texto="ACEPTAR"
					accion={this.crearNuevoPedido}
				/>);

			ret.push(
				<ListaTabla
					id_campo={this.props.config.nuevo_pedido.tabla.id_campo}
					url={this.props.config.nuevo_pedido.tabla.url}
					cols={this.props.config.nuevo_pedido.tabla.cols}
					eliminar={this.props.config.nuevo_pedido.tabla.eliminar}
					key="tabla_nuevo_pedido"
					ref="tabla_nuevo_pedido"
					setDialogo={this.setDialogo}
					onResizeFila={this.onResizeFilaNuevoPedido}
					onLoad={this.dimensionar}
					persistir={false}
				/>
			);
		}

		return ret;
	}
	dimensionarNuevoPedido(alto, panel) {
		let tipopedido = ReactDOM.findDOMNode(panel.refs.tipopedido);
		if (tipopedido) {
			let alto_form = tipopedido.offsetHeight;
			let alto_tabla = alto - alto_form;
			panel.refs.tabla_nuevo_pedido.dimensionar(alto_tabla);
		}
	}
	renderNuevoPedido() {
		return <Panel
			className="panel_nuevo_pedido"
			contenido={this.renderContenidoNuevoPedido}
			ref="panel_nuevo_pedido"
			dimensionar={this.dimensionarNuevoPedido}
		/>
	}
	renderContenido(e) {
		let ret = '';

		if (this.state.contenido == 'inicio') {
			ret = this.renderInicio();
		} else if (this.state.contenido == 'excedente') {
			ret = this.renderExcedente();
		} else if (this.state.contenido == 'nuevo_pedido') {
			ret = this.renderNuevoPedido();
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
	}
	renderStyle() {
		let ret = {};

		if (this.state.alto) {
			ret.height = this.state.alto + 'px';
		}

		return ret;
	}
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
	}
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
}

const mapStateToProps = state => {
	const bd = state.isla && state.isla.bd ? state.isla.bd : {};

	return {
		bd
	}
}

export default connect(mapStateToProps)(App)

/*
ReactDOM.render(
	<App/>,
	document.getElementById('react-container')
);
*/
