import { ajax } from '../utils/utils';

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
