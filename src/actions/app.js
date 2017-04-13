/*

import { ajax } from '../componentes/base';

export const CARGAR_DATASET_TIPOPEDIDOS_START = 'CARGAR_DATASET_TIPOPEDIDOS_START';
const cargarDatasetTipopedidosStart = () => ({
    type: CARGAR_DATASET_TIPOPEDIDOS_START
});

export const CARGAR_DATASET_TIPOPEDIDOS_SUCCESS = 'CARGAR_DATASET_TIPOPEDIDOS_SUCCESS';
const cargarDatasetTipopedidosSuccess = data => ({
    type: CARGAR_DATASET_TIPOPEDIDOS_SUCCESS,
    data
});

export const CARGAR_DATASET_TIPOPEDIDOS_ERROR = 'CARGAR_DATASET_TIPOPEDIDOS_ERROR';
const cargarDatasetTipopedidosError = error => ({
    type: CARGAR_DATASET_TIPOPEDIDOS_ERROR,
    error
});

export const cargarDatasetTipopedidos = (url, orden) => dispatch => {
    dispatch(cargarDatasetTipopedidosStart());

    return ajax({
        metodo: 'get',
        url,
        params: {
            _sort:  orden,
            _order: 'ASC'
        }
    })
      .then(response => response.json())
      .then(json => dispatch(cargarDatasetTipopedidosSuccess(json)))
      .catch(error => dispatch(cargarDatasetTipopedidosError(error)));
};

export const LIMPIAR_DATASET_TIPOPEDIDOS_ERROR = 'LIMPIAR_DATASET_TIPOPEDIDOS_ERROR';
export const limpiarDatasetTipopedidosError = () => ({
    type: LIMPIAR_DATASET_TIPOPEDIDOS_ERROR
});

export const CAMBIAR_PEDIDO_VER = 'CAMBIAR_PEDIDO_VER';
export const cambiarPedidoVer = pedidoVer => ({
    type: CAMBIAR_PEDIDO_VER,
    pedidoVer
});

export const CAMBIAR_CONTENIDO = 'CAMBIAR_CONTENIDO';
export const cambiarContenido = contenido => ({
    type: CAMBIAR_CONTENIDO,
    contenido
});

export const DIMENSIONAR = 'DIMENSIONAR';
export const dimensionar = menu => ({
    type: DIMENSIONAR,
    menu
});

    */
