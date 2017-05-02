import {
    CAMBIAR_CONTENIDO,
    DIMENSIONAR,
    CAMBIAR_VER_PEDIDO,
    SET_DIALOGO,
    HANDLER_ERROR
} from '../actions/app';

const _menu = [{
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
}];

const _dimensionar = menu => window.innerHeight - menu.offsetHeight;
const _setDialogoError = error => ({
    titulo:      'Error',
    puedeCerrar: true,
    contenido:   error.message
});

export default (state = {
    menu:      _menu,
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
    case CAMBIAR_VER_PEDIDO:
        return {
            ...state,
            verPedido: action.pedido
        };
    case SET_DIALOGO:
        return {
            ...state,
            dialogo: action.dialogo
        };
    case HANDLER_ERROR:
        return {
            ...state,
            dialogo: _setDialogoError(action.error)
        };
    default:
        return state;
    }
};
