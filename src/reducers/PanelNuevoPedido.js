import {
    initState,
    CAMBIAR_TIPO_NUEVO_PEDIDO,
    NUEVA_FILA_NUEVO_PEDIDO
} from '../actions/PanelNuevoPedido';

import { createDefaultRow } from '../utils/utils';

const _cambiarTipoNuevoPedido = (nuevoPedido, tipoPedido) => ({
    ...nuevoPedido,
    tipoPedido
});
const _nuevaFilaNuevoPedido = (nuevoPedido, cols) => ({
    ...nuevoPedido,
    filas: [createDefaultRow(cols)].concatenar(nuevoPedido.filas)
});

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
        /*
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
