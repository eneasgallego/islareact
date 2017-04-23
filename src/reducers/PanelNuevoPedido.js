import {
    initState,
    CAMBIAR_TIPO_NUEVO_PEDIDO,
    NUEVA_FILA_NUEVO_PEDIDO,
    CAMBIAR_VALOR_TABLA_NUEVO_PEDIDO,
    ELIMINAR_FILA_TABLA_NUEVO_PEDIDO,
    LIMPIAR_NUEVO_PEDIDO
} from '../actions/PanelNuevoPedido';

import { createDefaultRow } from '../utils/utils';

import { POS_TO_DELETE_SPLICE } from '../utils/constantes';

const _cambiarTipoNuevoPedido = (nuevoPedido, tipoPedido) => ({
    ...nuevoPedido,
    tipoPedido
});
const _nuevaFilaNuevoPedido = (nuevoPedido, cols) => ({
    ...nuevoPedido,
    filas: [createDefaultRow(cols)].concatenar(nuevoPedido.filas)
});
const _cambiarValorTablaNuevoPedido = (nuevoPedido, valor, campo, index) => {
    const
        { filas } = nuevoPedido,
        fila = {
            ...filas[index],
            [campo]: valor
        };

    filas[index] = fila;

    return {
        ...nuevoPedido,
        filas: filas.slice()
    };
};
const _eliminarFilaTablaNuevoPedido = (nuevoPedido, index) => {
    const { filas } = nuevoPedido;

    filas.splice(index, POS_TO_DELETE_SPLICE);

    return {
        ...nuevoPedido,
        filas: filas.slice()
    };
};

export default (state = initState(), action = {}) => {
    switch (action.type) {
    case CAMBIAR_TIPO_NUEVO_PEDIDO:
        return {
            ...state,
            nuevoPedido: _cambiarTipoNuevoPedido(state.nuevoPedido, action.tipoPedido)
        };
    case NUEVA_FILA_NUEVO_PEDIDO:
        return {
            ...state,
            nuevoPedido: _nuevaFilaNuevoPedido(state.nuevoPedido, action.cols)
        };
    case CAMBIAR_VALOR_TABLA_NUEVO_PEDIDO:
        return {
            ...state,
            nuevoPedido: _cambiarValorTablaNuevoPedido(state.nuevoPedido, action.valor, action.campo, action.index)
        };
    case ELIMINAR_FILA_TABLA_NUEVO_PEDIDO:
        return {
            ...state,
            nuevoPedido: _eliminarFilaTablaNuevoPedido(state.nuevoPedido, action.index)
        };
    case LIMPIAR_NUEVO_PEDIDO:
        return {
            ...state,
            nuevoPedido: {}
        };
    default:
        return state;
    }
};
