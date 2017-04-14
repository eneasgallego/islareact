import { ajax } from '../utils/utils';

export const ID_INICIO_MATERIALES = 'inicio_materiales';
export const ID_INICIO_PEDIDOS = 'inicio_pedidos';
export const ID_INICIO_NECESITA = 'inicio_necesita';

export const CAMBIAR_ORDEN_TABLA = 'CAMBIAR_ORDEN_TABLA';
export const cambiarOrdenTabla = (idTabla, orden) => ({
    type: CAMBIAR_ORDEN_TABLA,
    idTabla,
    orden
});

export const CARGAR_FILAS_TABLA_START = 'CARGAR_FILAS_TABLA_START';
const cargarFilasTablaStart = idTabla => ({
    type: CARGAR_FILAS_TABLA_START,
    idTabla
});

export const CARGAR_FILAS_TABLA_SUCCESS = 'CARGAR_FILAS_TABLA_SUCCESS';
const cargarFilasTablaSuccess = (idTabla, data, parseData) => ({
    type: CARGAR_FILAS_TABLA_SUCCESS,
    idTabla,
    data,
    parseData
});

export const CARGAR_FILAS_TABLA_ERROR = 'CARGAR_FILAS_TABLA_ERROR';
const cargarFilasTablaError = (idTabla, error) => ({
    type: CARGAR_FILAS_TABLA_ERROR,
    idTabla,
    error
});

export const cargarFilasTabla = (idTabla, url, params, parseData) => dispatch => {
    dispatch(cargarFilasTablaStart(idTabla));

    return ajax({
        metodo: 'get',
        url,
        params
    })
        .then(json => dispatch(cargarFilasTablaSuccess(idTabla, json, parseData)))
        .catch(error => dispatch(cargarFilasTablaError(idTabla, error)));
};

/*

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

export const DIMENSIONAR = 'DIMENSIONAR';
export const dimensionar = menu => ({
    type: DIMENSIONAR,
    menu
});

    */
