import { ajax } from '../componentes/base';

import { FIRST_INDEX } from '../constantes';

export const DIMENSIONAR_ANCHOS_TABLA = 'DIMENSIONAR_ANCHOS_TABLA';
export const dimensionarAnchosTabla = (id, offset) => ({
    type: DIMENSIONAR_ANCHOS_TABLA,
    id,
    offset
});

export const DIMENSIONAR_TABLA = 'DIMENSIONAR_TABLA';
export const dimensionarTabla = (id, alto, tabla) => ({
    type: DIMENSIONAR_TABLA,
    id,
    alto,
    tabla
});

export const NUEVA_FILA_TABLA = 'NUEVA_FILA_TABLA';
export const nuevaFilaTabla = (id, cols) => ({
    type: NUEVA_FILA_TABLA,
    id,
    cols
});

export const CARGAR_FILAS_TABLA_START = 'CARGAR_FILAS_TABLA_START';
const cargarFilasTablaStart = id => ({
    type: CARGAR_FILAS_TABLA_START,
    id
});

export const CARGAR_FILAS_TABLA_SUCCESS = 'CARGAR_FILAS_TABLA_SUCCESS';
const cargarFilasTablaSuccess = (id, data, parseData) => ({
    type: CARGAR_FILAS_TABLA_SUCCESS,
    id,
    data,
    parseData
});

export const CARGAR_FILAS_TABLA_ERROR = 'CARGAR_FILAS_TABLA_ERROR';
const cargarFilasTablaError = error => ({
    type: CARGAR_FILAS_TABLA_ERROR,
    error
});

export const cargarFilasTabla = (id, url, params, parseData) => dispatch => {
    dispatch(cargarFilasTablaStart(id));

    return ajax({
        metodo: 'get',
        url,
        params
    })
      .then(json => dispatch(cargarFilasTablaSuccess(id, json, parseData)))
      .catch(error => dispatch(cargarFilasTablaError(id, error)));
};

export const MARCAR_CARGADO_TABLA = 'MARCAR_CARGADO_TABLA';
export const marcarCargadoTabla = id => ({
    type: MARCAR_CARGADO_TABLA,
    id
});

export const CARGAR_COMBOS_TABLA_SUCCESS = 'CARGAR_COMBOS_TABLA_SUCCESS';
const cargarCombosTablaSuccess = (id, campo, data) => ({
    type: CARGAR_COMBOS_TABLA_SUCCESS,
    id,
    campo,
    data
});

export const CARGAR_COMBOS_TABLA_ERROR = 'CARGAR_COMBOS_TABLA_ERROR';
const cargarCombosTablaError = error => ({
    type: CARGAR_COMBOS_TABLA_ERROR,
    error
});

export const cargarCombosTabla = (id, cols, combosDataset) => dispatch => new Promise(resolve => {
    const cargarCombo = col => {

        ajax({
            metodo: 'get',
            url:    col.tipo.url,
            params: {
                _sort:  col.tipo.texto,
                _order: 'ASC'
            }
        })
          .then(response => response.json())
          .then(json => dispatch(cargarCombosTablaSuccess(id, col.campo, json)))
          .catch(error => dispatch(cargarCombosTablaError(id, error)));
    };

    for (let i = FIRST_INDEX; i < cols.length; i++) {
        const col = cols[i];

        if (col.tipo.tipo === 'object') {
            if (!combosDataset[col.campo]) {
                cargarCombo(col);
            }
        }
    }
    resolve();
});
