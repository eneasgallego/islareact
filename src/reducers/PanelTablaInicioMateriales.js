import {
    ID_INICIO_MATERIALES,
    CAMBIAR_ORDEN_TABLA
} from '../actions/Tabla';

import {
    getInitialState,
    cambiarOrdenTabla
} from './Tabla';

export default (state = getInitialState(), action = {}) => {
    switch (action.type) {
    case CAMBIAR_ORDEN_TABLA:
        return cambiarOrdenTabla(state, action, ID_INICIO_MATERIALES);
    default:
        return state;
    }
};
