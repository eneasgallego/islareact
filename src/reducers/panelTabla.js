import { getState } from '../componentes/base';
import {
    DIMENSIONAR_PANELTABLA
} from '../actions/app';

const _initState = () => ({
    alto: undefined
});

const _dimensionarPanelTabla = (state, id, alto, titulo) => getState(state, id, _initState, {
    alto: alto - titulo.offsetHeight
});

export default (state = {}, action = {}) => {
    switch (action.type) {
    case DIMENSIONAR_PANELTABLA:
        return {
            ...state,
            ..._dimensionarPanelTabla(state, action.id, action.alto, action.titulo)
        };
    default:
        return state;
    }
};
