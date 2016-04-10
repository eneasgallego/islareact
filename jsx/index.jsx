import React from 'react'
import ReactDOM from 'react-dom'

/*
 import Sandbox from './sandbox.jsx'

let texto = "Laya Dueñas";

ReactDOM.render(<Sandbox texto={ texto } />, document.getElementById('react-container'))
*/


import App from './app.jsx'

let options = {
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
            orden: {
                campo: "profundidadpedidos",
                desc: true
            },
            id_campo: 'materialpedidos',
            parseData: 'parseDataHuerto',
            cols: 'colsNecesitaMateriales',
            acciones: 'accionesNecesitaHuerto',
            claseFila: 'claseFilaNecesita'
        },{
            id: 'materiales',
            titulo: 'Materiales',
            url: 'http://localhost:3000/db',
            orden: {
                campo: "profundidadpedidos",
                desc: true
            },
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
            orden: {
                campo: "profundidadpedidos",
                desc: true
            },
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

ReactDOM.render(
    <App    menu={options.menu}
            config={options.config}
    />,
    document.getElementById('react-container')
);