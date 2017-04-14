import {
    ID_INICIO_PEDIDOS,
    CAMBIAR_ORDEN_TABLA,
    CARGAR_FILAS_TABLA_START,
    CARGAR_FILAS_TABLA_SUCCESS,
    CARGAR_FILAS_TABLA_ERROR
} from '../actions/Tabla';

import {
    getInitialState,
    cambiarOrdenTabla,
    cargarFilasTablaStart,
    cargarFilasTablaSuccess,
    cargarFilasTablaError
} from './Tabla';

export default (state = getInitialState(), action = {}) => {
    switch (action.type) {
    case CAMBIAR_ORDEN_TABLA:
        return cambiarOrdenTabla(state, action, ID_INICIO_PEDIDOS);
    case CARGAR_FILAS_TABLA_START:
        return cargarFilasTablaStart(state, action, ID_INICIO_PEDIDOS);
    case CARGAR_FILAS_TABLA_SUCCESS:
        return cargarFilasTablaSuccess(state, action, ID_INICIO_PEDIDOS);
    case CARGAR_FILAS_TABLA_ERROR:
        return cargarFilasTablaError(state, action, ID_INICIO_PEDIDOS);
    default:
        return state;
    }
};
