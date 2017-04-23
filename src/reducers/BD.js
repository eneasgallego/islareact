import {
    CARGAR_BD_START,
    CARGAR_BD_SUCCESS,
    NUEVA_FILA
} from '../actions/BD';

import { generarVistasBD, initVistasBD } from '../datos/utils';

import { createDefaultRow } from '../utils/utils';

const _nuevaFila = (tabla, filas, cols) => ({
    [tabla]: [createDefaultRow(cols)].concatenar(filas)
});

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
            ...generarVistasBD(action.data, true),
            cargando: false
        };
    case NUEVA_FILA:
        return {
            ...state,
            ..._nuevaFila(action.tabla, state[action.tabla], action.cols)
        };

    default:
        return state;
    }
};
