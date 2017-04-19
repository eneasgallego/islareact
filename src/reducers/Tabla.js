import {
    CAMBIAR_ORDEN_TABLA,
    SET_ORDEN_TABLA,
    FILTRAR_TABLA,
    LIMPIAR_FILTRO_TABLA
} from '../actions/Tabla';

import {POS_TO_DELETE_SPLICE } from '../utils/constantes';

const _getInitialState = () => ({
    filtros:  [],
    orden:    [],
    cargando: false
});

const _checkTabla = (state, action, idTabla, fn) => action.idTabla === idTabla ?
{
    ...state,
    ...fn()
} :
state;

const _cambiarOrdenTabla = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => {
    const
        { orden } = state,
        { campo } = action,
        index = orden.indice('campo', campo);

    const item = ~index ?
    {
        ...orden[index],
        desc: !orden[index].desc
    } :
    {
        campo,
        desc: false
    };

    ~index && orden.splice(index, POS_TO_DELETE_SPLICE);

    orden.unshift({
        ...item
    });

    return orden.slice();
});
const _setOrdenTabla = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => ({orden: action.orden}));
const _filtrarTabla = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => {
    const
        { filtros } = state,
        index = filtros.indice('campo', action.campo),
        filtro = {
            campo: action.campo,
            valor: action.valor
        };

    if (~index) {
        filtros[index] = filtro;
    } else {
        filtros.push(filtro);
    }

    return {
        filtros: filtros.slice()
    };
});
const _limpiarFiltroTabla = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => {
    const
        { filtros } = state,
        index = filtros.indice('campo', action.campo);

    ~index && filtros.splice(index, POS_TO_DELETE_SPLICE);

    return {
        filtros: filtros.slice()
    };
});

export default idTabla => (state = _getInitialState(), action = {}) => {
    switch (action.type) {
    case CAMBIAR_ORDEN_TABLA:
        return _cambiarOrdenTabla(state, action, idTabla);
    case SET_ORDEN_TABLA:
        return _setOrdenTabla(state, action, idTabla);
    case FILTRAR_TABLA:
        return _filtrarTabla(state, action, idTabla);
    case LIMPIAR_FILTRO_TABLA:
        return _limpiarFiltroTabla(state, action, idTabla);
    default:
        return state;
    }
};
