import {
    CARGAR_BD_START,
    CARGAR_BD_SUCCESS
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
            ...generarVistasBD(action.data, true),
            cargando: false
        };
    default:
        return state;
    }
};
