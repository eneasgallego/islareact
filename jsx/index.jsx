import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import reducer from './reducers'

import App from './app.jsx'

let options = {
    menu: [{
        texto: 'Dashboard',
        tag: 'inicio'
    },{
        texto: 'Excedente',
        tag: 'excedente'
    },{
        texto: 'Nuevo Pedido',
        tag: 'nuevo_pedido'
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
        url: 'http://localhost:3000/db',
        fabricas: {
            id_campo: 'id',
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
            eliminar: true,
            cols: [{
                texto: 'MATERIAL',
                campo: 'nombremateriales'
            },{
                texto: 'FABRICA',
                campo: 'fabricamateriales',
                tipo: {
                    tipo: 'object',
                    dataset: 'fabricas',
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
            eliminar: true,
            cols: [{
                texto: 'MATERIAL',
                campo: 'materialmateriales_necesita',
                tipo: {
                    tipo: 'object',
                    dataset: 'materiales',
                    id: 'id',
                    texto: 'nombremateriales'
                }
            },{
                texto: 'NECESITA',
                campo: 'materialnecesitamateriales_necesita',
                tipo: {
                    tipo: 'object',
                    dataset: 'materiales',
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
            eliminar: true,
            cols: [{
                texto: 'TIPO',
                campo: 'nombretipos_pedido'
            },{
                texto: 'PROFUNDIDAD',
                campo: 'profundidadtipos_pedido',
                tipo: 'int'
            },{
                texto: 'NO VACIA',
                campo: 'novacia_pedido',
                tipo: 'bool'
            }]
        },
        pedidos: {
            id_campo: 'id',
            eliminar: true,
            cols: [{
                texto: 'TIPO',
                campo: 'tipopedidos',
                tipo: {
                    tipo: 'object',
                    dataset: 'tipos_pedido',
                    id: 'id',
                    texto: 'nombretipos_pedido'
                }
            },{
                texto: 'MATERIAL',
                campo: 'materialpedidos',
                tipo: {
                    tipo: 'object',
                    dataset: 'materiales',
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
            },{
                texto: 'NO VACIA',
                campo: 'novacia_pedido',
                tipo: 'bool'
            }]
        },
        excedente: {
            id: 'excedente',
            titulo: 'Excedente',
            orden:  [{
                campo: "excedentemateriales",
                desc: true
            },{
                campo: "excedentematerialesprocesados",
                desc: true
            },{
                campo: "stockmateriales",
                desc: true
            },{
                campo: "cantidadpedidos",
                desc: true
            },{
                campo: "cantidadpedidosprocesados",
                desc: true
            },{
                campo: "nombremateriales",
                desc: false
            }],
            source: 'vistaExcedente',
            id_campo: 'idmateriales',
            cols: 'colsExcedente',
            acciones: 'accionesExcedente',
            claseFila: 'claseFilaExcedente'
        },
        nuevo_pedido: {
            guardar: 'guardarPedido',
            tipopedido: {
                titulo: 'Tipo',
                url: 'http://localhost:3000/tipos_pedido',
                id: 'id',
                texto: 'nombretipos_pedido'
            },
            profundidad: {
                titulo: 'Profundidad'
            },
            tabla: {
                id_campo: 'id',
                cols: [{
                    texto: 'MATERIAL',
                    campo: 'materialpedidos',
                    tipo: {
                        tipo: 'object',
                        dataset: 'materiales',
                        id: 'id',
                        texto: 'nombremateriales'
                    }
                },{
                    texto: 'CANTIDAD',
                    campo: 'cantidadpedidos',
                    tipo: 'int'
                }],
                eliminar: true,
                guardar: 'guardarNuevoPedido'
            }
        },
        inicio: [{
            id: 'materiales',
            titulo: 'Materiales',
            orden:  [{
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
            source: 'inicioNecesitaMateriales',
            id_campo: 'materialpedidos',
            cols: 'colsNecesitaMateriales',
            acciones: 'accionesNecesitaMateriales',
            claseFila: 'claseFilaNecesita'
        },{
            id: 'pedidos',
            titulo: 'Pedidos',
            orden: {
                campo: "nombretipos_pedido",
                desc: false
            },
            id_campo: 'idtipos_pedido',
            source: 'inicioPedidos',
            cols: 'colsPedidos',
            acciones: 'accionesPedidos',
            claseFila: 'claseFilaPedidos'
        },{
            id: 'necesita',
            titulo: 'Necesita',
            orden:  [{
                campo: "profundidadpedidos",
                desc: true
            },{
                campo: "haciendomateriales",
                desc: true
            }],
            source: 'inicioNecesita',
            id_campo: 'materialpedidos',
            cols: 'colsNecesita',
            acciones: 'accionesNecesita',
            claseFila: 'claseFilaNecesita'
        }],
        inicio_pedido: {
            id: 'pedido',
            orden: {
                campo: "nombremateriales",
                desc: false
            },
            id_campo: 'idpedidos',
            source: 'inicioPedido',
            cols: 'colsPedido',
            acciones: 'accionesPedido',
            claseFila: 'claseFilaPedido'
        }
    }
};

const middleware = [ thunk ]
middleware.push(createLogger())

const store = createStore(
    reducer,
    applyMiddleware(...middleware)
)

ReactDOM.render(
    <Provider store={store}>
        <App    menu={options.menu}
                config={options.config}
        />
    </Provider>,
    document.getElementById('react-container')
);
