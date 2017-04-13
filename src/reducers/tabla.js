import { getState } from '../componentes/base';

import { NUMERO_DEFECTO, FIRST_INDEX } from '../constantes';

import {
    DIMENSIONAR_ANCHOS_TABLA,
    DIMENSIONAR_TABLA,
    NUEVA_FILA_TABLA,
    CARGAR_FILAS_TABLA_START,
    CARGAR_FILAS_TABLA_SUCCESS,
    CARGAR_FILAS_TABLA_ERROR,
    MARCAR_CARGADO_TABLA,
    CARGAR_COMBOS_TABLA_SUCCESS,
    CARGAR_COMBOS_TABLA_ERROR
} from '../actions/tabla';

const _initState = () => ({
    anchos:        [],
    alto:          undefined,
    altoTabla:     undefined,
    altoBody:      undefined,
    filas:         [],
    cargando:      false,
    filasCargadas: false,
    combosDataset: {},
    valFiltros:    {}
});

const _dimensionarAnchosTabla = (state, id, offset) => getState(state, id, _initState, ownState => {
    const anchos = ownState.anchos.slice();
    const ancho = anchos[offset.index];

    if (!ancho || ancho < offset.width) {
        anchos[offset.index] = offset.width;
    }

    return {
        anchos
    };
});
const _dimensionarTabla = (state, id, alto, tabla) => getState(state, id, _initState, ownState => {
    let altoTabla = alto;
    const domMenu = tabla.querySelector('.menu-tabla');

    if (domMenu) {
        altoTabla -= domMenu.offsetHeight;
    }

    const domDiv = tabla.querySelector('.tabla-div');
    let altoBody = domDiv.offsetHeight;
    const domHead = domDiv.querySelector('thead');

    altoBody -= domHead.offsetHeight;

    return {
        alto,
        altoTabla,
        altoBody
    };
});
const _nuevaFilaTabla = (state, id, cols) => getState(state, id, _initState, ownState => {
    const
        _getValorDefecto = tipo => tipo === 'string' ?
            '' :
            tipo === 'int' || tipo === 'float' || tipo === 'object' ?
                NUMERO_DEFECTO :
                tipo === 'bool' ?
                    false :
                    undefined,
        filas = ownState.filas.slice(),
        obj = {};

    for (let i = FIRST_INDEX; i < cols.length; i++) {
        const col = cols[i];

        obj[col.campo] = _getValorDefecto(col.tipo.tipo);
    }
    filas.unshift(obj);

    return {
        filas
    };
});
const _cargarFilasTablaStart = (state, id) => getState(state, id, _initState, ownState => ({cargando: true}));
const _cargarFilasTablaSuccess = (state, id, data, parseData) => getState(state, id, _initState, ownState => ({
    filas:         parseData(data),
    filasCargadas: true,
    cargando:      false
}));
const _marcarCargadoTabla = (state, id) => getState(state, id, _initState, ownState => ({cargando: false, filasCargadas: true}));
const _cargarCombosTablaSuccess = (state, id, campo, data) => getState(state, id, _initState, ownState => {
    const combosDataset = {...ownState.combosDataset};

    combosDataset[campo] = data;

    return {
        combosDataset
    };
});


export default (state = {}, action = {}) => {
    switch (action.type) {
    case DIMENSIONAR_ANCHOS_TABLA:
        return {
            ...state,
            ..._dimensionarAnchosTabla(state, action.id, action.offset)
        };
    case DIMENSIONAR_TABLA:
        return {
            ...state,
            ..._dimensionarTabla(state, action.id, action.alto, action.tabla)
        };
    case NUEVA_FILA_TABLA:
        return {
            ...state,
            ..._nuevaFilaTabla(state, action.id, action.cols)
        };
    case CARGAR_FILAS_TABLA_START:
        return {
            ...state,
            ..._cargarFilasTablaStart(state, action.id)
        };
    case CARGAR_FILAS_TABLA_SUCCESS:
        return {
            ...state,
            ..._cargarFilasTablaSuccess(state, action.id, action.data, action.parseData)
        };
    case CARGAR_FILAS_TABLA_ERROR:
        return {
            ...state
        };
    case MARCAR_CARGADO_TABLA:
        return {
            ...state,
            ..._marcarCargadoTabla(state, action.id)
        };
    case CARGAR_COMBOS_TABLA_SUCCESS:
        return {
            ...state,
            ..._cargarCombosTablaSuccess(state, action.id, action.campo, action.data)
        };
    case CARGAR_COMBOS_TABLA_ERROR:
        return {
            ...state
        };
    default:
        return state;
    }
};
