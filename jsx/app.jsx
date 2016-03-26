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
					url: 'http://localhost:3000/db'/*'vistaNecesitaHuerto.php'*/,
					id_campo: 'materialpedidos',
					parseData: 'parseDataHuerto',
					cols: 'colsNecesitaMateriales',
					acciones: 'accionesNecesitaHuerto',
					claseFila: 'claseFilaNecesita'
				},/*{
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
	componentDidMount: function() {
		this.dimensionar();
		window.onresize = function (e) {
			this.dimensionar();
		}.bind(this);

	},
	parseDataPedidos: function (data, tabla, panel) {

		var ret = [];
		var map = {};
		var mapas = {};

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

			var tipos_pedido = this.getMapa('tipos_pedido', 'id', mapas, data.tipos_pedido);
			var tipo_pedido = tipos_pedido[idtipos_pedido];
			obj.nombretipos_pedido = tipo_pedido.nombretipos_pedido;

			var materiales = this.getMapa('materiales', 'id', mapas, data.materiales);
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
	parseDataHuerto: function (data, tabla, panel) {
		var vistaNecesita = this.getVistaNecesita(data);

		var ret = vistaNecesita.filter(function (item) {
			return (!~item.maximofabricas) && item.stockmateriales < item.cantidadpedidos;
		});

		return ret;
	},
	colsNecesitaMateriales: function () {
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
	colsNecesita: function () {
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
	colsPedidos: function () {
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
	colsPedido: function () {
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
	accionesNecesitaHuerto: function () {
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
	accionesNecesitaMateriales: function () {
		return [{
			texto: 'hacer',
			tag: 'accionHacerMaterial'
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
		}, {
			texto: 'procesar',
			tag: 'accionProcesarPedidos'
		}, {
			texto: 'cerrar',
			tag: 'cerrarPedido'
		}];
	},
	accionesPedido: function () {
		return [{
			texto: 'hacer',
			tag: 'accionHacerMaterial'
		}, {
			texto: 'recoger',
			tag: 'recogerMaterial'
		}, {
			texto: 'procesar',
			tag: 'procesarPedido'
		}];
	},
	cargarBD: function (callback) {
		ajax({
			metodo: 'get',
			url: 'http://localhost:3000/db',
			success: callback
		});
	},
	calcularTotales: function (par) {
		var ret = {};

		for (var i in par) {
			ret[i] = this.calcularTotal(par[i]);
			if (par.item) {
				par.item[i] = ret[i];
			}
		}

		return ret;
	},
	calcularTotal: function (par) {
		var ret;


		for (var i = 0 ; i < par.lista.length ; i++) {
			var item = par.lista[i];

			var valor;
			if (typeof(par.valor) === 'string') {
				valor = item[par.valor];
			} else if (typeof(par.valor) === 'function') {
				valor = par.valor(item);
			}

			if (par.tipo == 'SUM') {
				if (!ret) {
					ret = 0
				}

				ret += valor;
			} else if (par.tipo == 'MIN') {
				if (typeof(ret) === 'undefined' || ret > valor) {
					ret = valor;
				}
			} else if (par.tipo == 'MAX') {
				if (typeof(ret) === 'undefined' || ret < valor) {
					ret = valor;
				}
			}
		}

		return ret;
	},
	getVistaMaterialesProcesar: function (data) {
		var ret = [];
		var map = {};

		for (var i = 0 ; i < data.materiales.length ; i++) {
			var material = data.materiales[i];

			var idmaterial = material.id;

			var obj = map[idmaterial];
			if (!obj) {
				obj = {
					materialpedidos: idmaterial,
					nombremateriales: material.nombremateriales,
					stockmateriales: material.stockmateriales,
					haciendomateriales: material.haciendomateriales,
					hacemateriales: material.hacemateriales
				};
				ret.push(obj);
			}

			var pedidos = data.pedidos.filter(function (item) {
				return item.procesadopedidos && idmaterial == item.materialpedidos;
			});

			var totales = this.calcularTotales({
				cantidadpedidos: {
					tipo: 'SUM',
					lista: pedidos,
					valor: 'cantidadpedidos'
				}
			});
			for (var key in totales) {
				obj[key] = totales[key];
			}

			obj.faltamateriales = obj.cantidadpedidos - material.stockmateriales - material.haciendomateriales;

			map[idmaterial] = obj;
		}

		return ret;
	},
	getVistaFabricas: function (data) {
		var ret = [];
		var map = {};
		var mapas = {};

		for (var i = 0 ; i < data.materiales.length ; i++) {
			var material = data.materiales[i];

			var fabricas = this.getMapa('fabricas','id',mapas,data.fabricas);
			var fabrica = fabricas[material.fabricamateriales];

			var id = material.fabricamateriales;

			var obj = map[id];
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
	getVistaMaterialesFalta: function (data) {
		var ret = [];
		var map = {};

		var vistaMaterialesNecesita = this.getVistaMaterialesNecesita(data);

		for (var i = 0 ; i < data.materiales.length ; i++) {
			var material = data.materiales[i];

			var id = material.id;

			var obj = map[id];
			if (!obj) {
				obj = {
					idmateriales: id,
					nombremateriales: material.nombremateriales,
					dif: 1
				};
				ret.push(obj);
			}

			var totales = this.calcularTotales({
				dif: {
					tipo: 'MIN',
					lista: vistaMaterialesNecesita,
					valor: function (item) {
						return (item.cantidadmateriales_necesita - item.stockmaterialesnecesita) <= 0;
					}
				}
			});
			for (var key in totales) {
				if (typeof(totales[key]) !== 'undefined') {
					obj[key] = totales[key];
				}
			}

			map[id] = obj;
		}

		return ret;
	},
	getVistaMaterialesNecesita: function (data) {
		var ret = [];
		var map = {};
		var mapas = {};

		for (var i = 0 ; i < data.materiales_necesita.length ; i++) {
			var material_necesita = data.materiales_necesita[i];

			var materiales = this.getMapa('materiales','id',mapas,data.materiales);
			var material = materiales[material_necesita.materialmateriales_necesita];
			var materialNecesita = materiales[material_necesita.materialnecesitamateriales_necesita];

			var id = material_necesita.id;

			var obj = map[idfabrica];
			if (!obj) {
				obj = {
					idmateriales_necesita: id,
					materialmateriales_necesita: materiales_necesita.materialmateriales_necesita,
					nombremateriales: material.nombremateriales,
					stockmateriales: material.stockmateriales,
					haciendomateriales: material.haciendomateriales,
					materialnecesitamateriales_necesita: materiales_necesita.materialnecesitamateriales_necesita,
					nombrematerialesnecesita: materialNecesita.nombremateriales,
					stockmaterialesnecesita: materialNecesita.stockmateriales,
					haciendomaterialesnecesita: materialNecesita.haciendomateriales,
					cantidadmateriales_necesita: materiales_necesita.cantidadmateriales_necesita
				};
				ret.push(obj);
			}

			map[id] = obj;
		}

		return ret;
	},
	getVistaNecesita: function (data) {
		var ret = [];
		var map = {};
		var mapas = {};

		var vistaFabricas = this.getVistaFabricas(data);
		var vistaMaterialesFalta = this.getVistaMaterialesFalta(data);

		for (var i = 0 ; i < data.pedidos.length ; i++) {
			var pedido = data.pedidos[i];

			var materiales = this.getMapa('materiales','id',mapas,data.materiales);
			var material = materiales[pedido.materialpedidos];

			var mapVistaFabricas = this.getMapa('vistaFabricas','fabricamateriales',mapas,vistaFabricas);
			var fabrica = mapVistaFabricas[material.fabricamateriales];

			var mapVistaMaterialesFalta = this.getMapa('vistaMaterialesFalta','idmateriales',mapas,vistaMaterialesFalta);
			var material_falta = mapVistaMaterialesFalta[material.id];

			if (pedido.cantidadpedidos > 0 && pedido.procesadopedidos) {
				var id = pedido.materialpedidos;

				var obj = map[id];
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

		for (var i = 0 ; i < ret.length ; i++) {
			var item = ret[i];

			item.faltamateriales = item.cantidadpedidos - item.stockmateriales - item.haciendomateriales;
		}

		return ret;
	},
	getMapa: function (mapa, id, mapas, lista) {
		var ret = mapas[mapa];

		if (!ret) {
			ret = lista.crearMapa(id);
		}

		return ret;
	},
	insertar: function(tabla, par, callback, error) {
		var url = 'http://localhost:3000/' + tabla;
		ajax({
			metodo: 'POST',
			url: url,
			params: par,
			success: callback,
			error: error
		});
	},
	editar: function (tabla, par, id_campo, id, callback, error) {
		var url = 'http://localhost:3000/' + tabla + '/' + id;

		ajax({
			metodo: 'PUT',
			url: url,
			params: par,
			success: callback,
			error: error
		});
	},
	guardarPedidos: function (id, cantidad, padrepedidos, hacemateriales, profundidad, bd, callback, error) {
		this.insertar('pedidos', {
				cantidadpedidos: cantidad,
				materialpedidos: id,
				padrepedidos: padrepedidos,
				tipopedidos: 13,
				procesadopedidos: 1,
				profundidadpedidos: profundidad
		}, function (res) {
			var idpedidos = res.id;

			var mapas = {};

			var vistaMaterialesProcesar = this.getVistaMaterialesProcesar(bd);
			var mapVistaMaterialesProcesar = this.getMapa('vistaMaterialesProcesar', 'materialpedidos', mapas, vistaMaterialesProcesar);
			var material = mapVistaMaterialesProcesar[id];

			var cantidad2 = material.faltamateriales;

			if (cantidad2 > 0) {
				if (cantidad2 > cantidad) {
					cantidad2 = cantidad;
				}
				var materiales_necesita = bd.materiales_necesita.filter(function (item) {
					return item.materialmateriales_necesita == id;
				});

				var fnPromesa = function (material_necesita, index, resolve, reject) {
					var cantidad2 = material.faltamateriales;

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
					}
				}.bind(this);

				materiales_necesita.promesas(fnPromesa, callback, error, this);
			}
		}.bind(this), error);
	},
	procesarPedido: function (pedido, bd, callback, error) {

		if (bd) {
			if (pedido.procesadopedidos) {
				error('Ya está procesado');
			} else {
				var mapas = {};

				pedido.procesadopedidos = true;
				this.editar('pedidos',pedido,'id',pedido.id, function editarProcesarPedido() {
					var vistaMaterialesProcesar = this.getVistaMaterialesProcesar(bd);
					var mapVistaMaterialesProcesar = this.getMapa('vistaMaterialesProcesar', 'materialpedidos', mapas, vistaMaterialesProcesar);
					var material = mapVistaMaterialesProcesar[pedido.materialpedidos];

					if (material.cantidadpedidos > material.stockmateriales + material.haciendomateriales) {
						var materiales_necesita = bd.materiales_necesita.filter(function (item) {
							return item.materialmateriales_necesita == pedido.materialpedidos;
						});

						var fnPromesa = function promesaProcesarPedido(material_necesita, index, resolve, reject) {
							var cantidad2 = material.faltamateriales;

							if (cantidad2 > 0) {
								if (cantidad2 > pedido.cantidadpedidos) {
									cantidad2 = pedido.cantidadpedidos;
								}
								this.guardarPedidos(material_necesita.materialnecesitamateriales_necesita,
									Math.ceil(material_necesita.cantidadmateriales_necesita * cantidad2 / material.hacemateriales),
									pedido.idpedidos,
									material.hacemateriales,
									1,
									bd,
									resolve,
									reject);
							}
						}.bind(this);

						materiales_necesita.promesas(fnPromesa, callback, error, this);
					}
				}.bind(this), error);
			}
		} else {
			this.cargarBD(function (data) {
				this.procesarPedido(pedido, data);
			}.bind(this));
		}
	},
	limpiarPedidos: function (id, cantidad, bd) {
		var mapas = {};

		//$material = getArraySQL("SELECT * FROM materiales WHERE idmateriales=$id")[0];
		var tipo_pedido_huerto = bd.tipos_pedido.buscar('');
		var material = materiales[id];
eneas
		$pedido = getArraySQL("SELECT * FROM ".$_SESSION['tabla_pedidos']." WHERE materialpedidos=$id and tipopedidos=13 and profundidadpedidos = (SELECT max(profundidadpedidos) FROM ".$_SESSION['tabla_pedidos']." WHERE materialpedidos=$id and tipopedidos=13)");
		$pedido = getArraySQL("SELECT * FROM ".$_SESSION['tabla_pedidos']." WHERE materialpedidos=$id and tipopedidos=13 and profundidadpedidos = (SELECT max(profundidadpedidos) FROM ".$_SESSION['tabla_pedidos']." WHERE materialpedidos=$id and tipopedidos=13)");
		$pedido = getArraySQL("SELECT * FROM ".$_SESSION['tabla_pedidos']." WHERE materialpedidos=$id and tipopedidos=13 and profundidadpedidos = (SELECT max(profundidadpedidos) FROM ".$_SESSION['tabla_pedidos']." WHERE materialpedidos=$id and tipopedidos=13)");
		bd.pedidos.filter(function (item) {
			return
		});
		if (count($pedido) > 0) {
			$pedido = $pedido[0];
			$dif = $pedido->cantidadpedidos - $cantidad;
			if ($dif > 0) {
				array_push($ret, editar($_SESSION['tabla_pedidos'], array("cantidadpedidos"=>$dif), "idpedidos", $pedido->idpedidos));
			} else {
				array_push($ret, eliminar($_SESSION['tabla_pedidos'], "idpedidos", $pedido->idpedidos));
				if ($dif < 0) {
					$sql = limpiarPedidos($id, $cantidad + $dif);
					for ($j = 0 ; $j < count($sql) ; $j++) {
						array_push($ret, $sql[$j]);
					}
				}
			}
		}
		return $ret;
	},
	hacerMaterial: function (id, cantidad, panel) {
		this.cargarBD(function (data) {
			var mapas = {};

			//$material = getArraySQL("SELECT * FROM materiales WHERE idmateriales=$id")[0];
			var materiales = this.getMapa('materiales', 'id', mapas, data.materiales);
			var material = materiales[id];

			//$fabrica = getArraySQL("SELECT * FROM vistaFabricas WHERE fabricamateriales=$material->fabricamateriales")[0];
			var vistaFabricas = this.getVistaFabricas(data);
			var mapVistaFabricas = this.getMapa('vistaFabricas','fabricamateriales',mapas,vistaFabricas);
			var fabrica = mapVistaFabricas[material.fabricamateriales];

			if (fabrica.maximofabricas >= 0) {
				if (fabrica.haciendomateriales >= fabrica.maximofabricas) {
					console.error('Fabrica completa');
				} else {
//					$materiales_necesita = getArraySQL("SELECT * FROM vistaMaterialesNecesita WHERE materialmateriales_necesita=$id");
					var materiales_necesita = this.getVistaMaterialesNecesita(data).filter(function (item) {
						return item.materialmateriales_necesita == id;
					});

					if (!~materiales_necesita.indice(function (item) {
							return material_necesita.cantidadmateriales_necesita - material_necesita.stockmaterialesnecesita > 0;
						})) {

//						array_push($ret['sql'], editar("materiales", array("haciendomateriales"=>$material->haciendomateriales + $material->hacemateriales), "idmateriales", $id));
						material.haciendomateriales = material.haciendomateriales + material.hacemateriales;
						this.editar('materiales',material,'id',material.id, function () {
							for (var i = 0 ; i < materiales_necesita.length ; i++) {
								var material_necesita = materiales_necesita[i];

								var dif = material_necesita.stockmaterialesnecesita - material_necesita.cantidadmateriales_necesita;
								//array_push($ret['sql'], editar("materiales", array("stockmateriales"=>$dif), "idmateriales", $material_necesita->materialnecesitamateriales_necesita));
								this.editar('materiales',{
									stockmateriales: dif
								},'id',material_necesita.materialnecesitamateriales_necesita, function () {
									$sql = limpiarPedidos($material_necesita->materialnecesitamateriales_necesita, $material_necesita->cantidadmateriales_necesita);
									eneas
								}.bind(this), error);
							}
						}.bind(this), error);
					}
				}
			} else {
				array_push($ret['sql'], editar("materiales", array("stockmateriales"=>$material->stockmateriales + ($material->hacemateriales * $cantidad)), "idmateriales", $id));
				$ret['success'] = true;
			}

			echo json_encode($ret);
		}.bind(this));
/*
		if (parseInt(datos.procesadopedidos)) {
			ajax({
				metodo: 'post',
				url: 'hacerMaterial.php',
				params: {
					id: datos.materialpedidos,
					cantidad: cantidad
				},
				success: function (response) {
					if (response.success) {
						this.refrescarInicio();
					} else {
						alert(response.msg);
					}
				}.bind(this)
			}, panel);
		} else {
			alert('Hay que procesarlo');
		}
		*/
	},
	accionHacerMaterial: function (tag, fila, tabla, panel) {
		this.hacerMaterial(fila.props.datos.materialpedidos, 1, panel);
	},
	accionHacerMaterial3: function (tag, fila, tabla, panel) {
		this.hacerMaterial(fila.props.datos.materialpedidos, 3, panel);
	},
	accionHacerMaterial6: function (tag, fila, tabla, panel) {
		this.hacerMaterial(fila.props.datos.materialpedidos, 6, panel);
	},
	accionProcesarPedidos: function (tag, fila, tabla, panel) {

		this.cargarBD(function (data) {
			var idtipos_pedido = fila.props.datos.idtipos_pedido;

			var pedidos_filtrados = data.pedidos.filter(function (item) {
				return item.tipopedidos == idtipos_pedido;
			});

			var fnPromesa = function promesaProcesarPedidos(item, index, resolve, reject) {
				this.procesarPedido(item, data, resolve, reject);
			}.bind(this);
			var successPromesa = function successPromesa() {
				this.refrescarInicio();
			}.bind(this);
			var errorPromesa = function errorPromesa(err) {
				console.error(err);
			}.bind(this);

			pedidos_filtrados.promesas(fnPromesa, successPromesa, errorPromesa, this);
		}.bind(this));
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
		if (datos.procesadopedidos) {
			if (datos.faltapedidos) {
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
	refrescarInicio: function () {
		for (var key in this.refs) {
			var panel = this.refs[key];
			if (typeof (panel.refrescar) === 'function') {
				panel.refrescar();
			}
		}
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
