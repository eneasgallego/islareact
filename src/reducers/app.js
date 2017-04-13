
import {
     CAMBIAR_CONTENIDO,
    DIMENSIONAR
//    CARGAR_DATASET_TIPOPEDIDOS_START,
//    CARGAR_DATASET_TIPOPEDIDOS_SUCCESS,
//    CARGAR_DATASET_TIPOPEDIDOS_ERROR,
//    LIMPIAR_DATASET_TIPOPEDIDOS_ERROR,
//    CAMBIAR_PEDIDO_VER,
} from '../actions/app';


const options = {
    menu: [{
        texto: 'Inicio',
        tag:   'inicio'
    },{
        texto: 'Excedente',
        tag:   'excedente'
    },{
        texto: 'Nuevo Pedido',
        tag:   'nuevo_pedido'
    },{
        texto: 'Admin',
        tag:   'admin',
        menu:  [{
            texto: 'Fabricas',
            tag:   'fabricas'
        },{
            texto: 'Materiales',
            tag:   'materiales'
        },{
            texto: 'Materiales Necesita',
            tag:   'materiales_necesita'
        },{
            texto: 'Tipos Pedido',
            tag:   'tipos_pedido'
        },{
            texto: 'Pedidos',
            tag:   'pedidos'
        }]
    }],
    config: {
        fabricas: {
            id_campo: 'id',
            url:      'http://localhost:3000/fabricas',
            eliminar: true,
            cols:     [{
                texto: 'FABRICA',
                campo: 'nombrefabricas'
            },{
                texto: 'MAXIMO',
                campo: 'maximofabricas',
                tipo:  'int'
            }]
        },
        materiales: {
            id_campo: 'id',
            url:      'http://localhost:3000/materiales',
            eliminar: true,
            cols:     [{
                texto: 'MATERIAL',
                campo: 'nombremateriales'
            },{
                texto: 'FABRICA',
                campo: 'fabricamateriales',
                tipo:  {
                    tipo:  'object',
                    url:   'http://localhost:3000/fabricas',
                    id:    'id',
                    texto: 'nombrefabricas'
                }
            },{
                texto: 'HACE',
                campo: 'hacemateriales',
                tipo:  'int'
            },{
                texto: 'STOCK',
                campo: 'stockmateriales',
                tipo:  'int'
            },{
                texto: 'HACIENDO',
                campo: 'haciendomateriales',
                tipo:  'int'
            }]
        },
        materiales_necesita: {
            id_campo: 'id',
            url:      'http://localhost:3000/materiales_necesita',
            eliminar: true,
            cols:     [{
                texto: 'MATERIAL',
                campo: 'materialmateriales_necesita',
                tipo:  {
                    tipo:  'object',
                    url:   'http://localhost:3000/materiales',
                    id:    'id',
                    texto: 'nombremateriales'
                }
            },{
                texto: 'NECESITA',
                campo: 'materialnecesitamateriales_necesita',
                tipo:  {
                    tipo:  'object',
                    url:   'http://localhost:3000/materiales',
                    id:    'id',
                    texto: 'nombremateriales'
                }
            },{
                texto: 'CANTIDAD',
                campo: 'cantidadmateriales_necesita',
                tipo:  'int'
            }]
        },
        tipos_pedido: {
            id_campo: 'id',
            url:      'http://localhost:3000/tipos_pedido',
            eliminar: true,
            cols:     [{
                texto: 'TIPO',
                campo: 'nombretipos_pedido'
            },{
                texto: 'PROFUNDIDAD',
                campo: 'profundidadtipos_pedido',
                tipo:  'int'
            },{
                texto: 'NO VACIA',
                campo: 'novacia_pedido',
                tipo:  'bool'
            }]
        },
        pedidos: {
            id_campo: 'id',
            url:      'http://localhost:3000/pedidos',
            eliminar: true,
            cols:     [{
                texto: 'TIPO',
                campo: 'tipopedidos',
                tipo:  {
                    tipo:  'object',
                    url:   'http://localhost:3000/tipos_pedido',
                    id:    'id',
                    texto: 'nombretipos_pedido'
                }
            },{
                texto: 'MATERIAL',
                campo: 'materialpedidos',
                tipo:  {
                    tipo:  'object',
                    url:   'http://localhost:3000/materiales',
                    id:    'id',
                    texto: 'nombremateriales'
                }
            },{
                texto: 'CANTIDAD',
                campo: 'cantidadpedidos',
                tipo:  'int'
            },{
                texto: 'PROCESADO',
                campo: 'procesadopedidos',
                tipo:  'bool'
            },{
                texto: 'PROFUNDIDAD',
                campo: 'profundidadpedidos',
                tipo:  'int'
            },{
                texto: 'NO VACIA',
                campo: 'novacia_pedido',
                tipo:  'bool'
            }]
        },
        excedente: {
            id:     'excedente',
            titulo: 'Excedente',
            url:    'http://localhost:3000/db',
            orden:  [/* {
             campo: "eshuerto",
             desc: false
                }, */{
                    campo: 'excedentemateriales',
                    desc:  true
                },{
                    campo: 'excedentematerialesprocesados',
                    desc:  true
                },{
                    campo: 'stockmateriales',
                    desc:  true
                },{
                    campo: 'cantidadpedidos',
                    desc:  true
                },{
                    campo: 'cantidadpedidosprocesados',
                    desc:  true
                },{
                    campo: 'nombremateriales',
                    desc:  false
                }],
            parseData: 'parseDataExcedente',
            id_campo:  'idmateriales',
            cols:      'colsExcedente',
            acciones:  'accionesExcedente',
            claseFila: 'claseFilaExcedente'
        },
        nuevo_pedido: {
            guardar:    'guardarPedido',
            tipopedido: {
                titulo: 'Tipo',
                url:    'http://localhost:3000/tipos_pedido',
                id:     'id',
                texto:  'nombretipos_pedido'
            },
            profundidad: {
                titulo: 'Profundidad'
            },
            tabla: {
                id_campo: 'id',
                cols:     [{
                    texto: 'MATERIAL',
                    campo: 'materialpedidos',
                    tipo:  {
                        tipo:  'object',
                        url:   'http://localhost:3000/materiales',
                        id:    'id',
                        texto: 'nombremateriales'
                    }
                },{
                    texto: 'CANTIDAD',
                    campo: 'cantidadpedidos',
                    tipo:  'int'
                }],
                eliminar: true,
                guardar:  'guardarNuevoPedido'
            }
        },
        inicio: [{
            id:     'pedidos',
            titulo: 'Pedidos',
            url:    'http://localhost:3000/db',
            orden:  {
                campo: 'nombretipos_pedido',
                desc:  false
            },
            id_campo:  'idtipos_pedido',
            parseData: 'parseDataPedidos',
            cols:      'colsPedidos',
            acciones:  'accionesPedidos',
            claseFila: 'claseFilaPedidos'
        },{
            id:     'necesita',
            titulo: 'Necesita',
            url:    'http://localhost:3000/db',
            orden:  [{
                campo: 'profundidadpedidos',
                desc:  true
            },{
                campo: 'haciendomateriales',
                desc:  true
            }],
            parseData: 'parseDataNecesita',
            id_campo:  'materialpedidos',
            cols:      'colsNecesita',
            acciones:  'accionesNecesita',
            claseFila: 'claseFilaNecesita'
        }],
        inicio_pedido: {
            id:    'pedido',
            url:   'http://localhost:3000/db',
            orden: {
                campo: 'nombremateriales',
                desc:  false
            },
            id_campo:  'idpedidos',
            parseData: 'parseDataPedido',
            cols:      'colsPedido',
            acciones:  'accionesPedido',
            claseFila: 'claseFilaPedido'
        }
    }
};

const _dimensionar = menu => window.innerHeight - menu.offsetHeight;

export default (state = {
    menu:      options.menu,
    contenido: 'inicio'
}, action = {}) => {
    switch (action.type) {
    case CAMBIAR_CONTENIDO:
        return {
            ...state,
            contenido: action.contenido
        };
    case DIMENSIONAR:
        return {
            ...state,
            alto: _dimensionar(action.menu)
        };
        /*
    case CARGAR_DATASET_TIPOPEDIDOS_START:
        return {
            ...state,
            cargando_dataset_tipopedidos: true
        };
    case CARGAR_DATASET_TIPOPEDIDOS_SUCCESS:
        return {
            ...state,
            cargando_dataset_tipopedidos: false,
            dataset_tipopedidos:          action.data
        };
    case CARGAR_DATASET_TIPOPEDIDOS_ERROR:
        return {
            ...state
        };
    case LIMPIAR_DATASET_TIPOPEDIDOS_ERROR:
        return {
            ...state,
            dataset_tipopedidos:          [],
            cargando_dataset_tipopedidos: false
        };
    case CAMBIAR_PEDIDO_VER:
        return {
            ...state,
            pedidoVer: action.pedidoVer
        };
     */
    default:
        return state;
    }
};
