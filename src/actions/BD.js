import { ajax, editar } from '../utils/utils';

import { NO_NECESITA, NUMERO_DEFECTO } from '../utils/constantes';


export const CARGAR_BD_START = 'CARGAR_BD_START';
const cargarBDStart = () => ({
    type: CARGAR_BD_START
});

export const CARGAR_BD_SUCCESS = 'CARGAR_BD_SUCCESS';
const cargarBDSuccess = data => ({
    type: CARGAR_BD_SUCCESS,
    data
});

export const CARGAR_BD_ERROR = 'CARGAR_BD_ERROR';
const cargarBDError = error => ({
    type: CARGAR_BD_ERROR,
    error
});

export const cargarBD = () => dispatch => {
    dispatch(cargarBDStart());

    return ajax({
        metodo: 'get',
        url:    'http://localhost:3000/db'
    })
        .then(json => dispatch(cargarBDSuccess(json)))
        .catch(error => dispatch(cargarBDError(error)));
};

export const recogerMaterial = idMaterial => (dispatch, getState) => {
    dispatch(cargarBDStart());

    const state = getState();
    const materiales = state.bd.materiales.slice();
    const material = materiales.buscar('id', idMaterial);

    if (material.haciendomateriales > NO_NECESITA) {

        material.haciendomateriales -= material.hacemateriales;
        material.stockmateriales += material.hacemateriales;

        return editar('materiales', material, idMaterial)
            .then(json => dispatch(cargarBDSuccess({
                ...state.bd,
                materiales
            })))
            .catch(error => dispatch(cargarBDError(error)));
    }
    throw new Error('No hay nada que recoger');

};

export const recogerTodoMaterial = idMaterial => (dispatch, getState) => {
    dispatch(cargarBDStart());

    const state = getState();
    const materiales = state.bd.materiales.slice();
    const material = materiales.buscar('id', idMaterial);

    if (material.haciendomateriales > NO_NECESITA) {

        material.stockmateriales += material.haciendomateriales;
        material.haciendomateriales = NUMERO_DEFECTO;

        return editar('materiales', material, idMaterial)
            .then(json => dispatch(cargarBDSuccess({
                ...state.bd,
                materiales
            })))
    .catch(error => dispatch(cargarBDError(error)));
    }
    throw new Error('No hay nada que recoger');

};
