import {
    CARGAR_BD_START,
    CARGAR_BD_SUCCESS,
    CARGAR_BD_ERROR
} from '../actions/BD';

import { generarVistasBD, initVistasBD } from '../datos/utils';

export default (state = initVistasBD(), action = {}) => {
    switch (action.type) {
    case CARGAR_BD_START:
        return {
            ...state,
            cargando: true
        };
    case CARGAR_BD_SUCCESS:
        return {
            ...state,
            ...generarVistasBD(action.data),
            cargando: false
        };
    case CARGAR_BD_ERROR:
        return {
            ...state,
            cargando: false,
            error:    action.error
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
