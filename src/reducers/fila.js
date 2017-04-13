/*
 import { getState } from '../componentes/base';

import {
    FIJAR_FILTRO_FILA
} from '../actions/fila';

const _initState = () => ({
    filtroFijado: ''
});

const _fijarFiltroFila = (state, id, campo) => getState(state, id, _initState, ownState => ({filtroFijado: campo}));


export default (state = {}, action = {}) => {
    switch (action.type) {
    case FIJAR_FILTRO_FILA:
        return {
            ...state,
            ..._fijarFiltroFila(state, action.id, action.campo)
        };
    default:
        return state;
    }
};
*/
