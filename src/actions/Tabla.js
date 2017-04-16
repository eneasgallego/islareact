import { ajax } from '../utils/utils';

export const ID_INICIO_MATERIALES = 'inicio_materiales';
export const ID_INICIO_PEDIDOS = 'inicio_pedidos';
export const ID_INICIO_NECESITA = 'inicio_necesita';
export const ID_INICIO_PEDIDO = 'inicio_pedido';

export const CAMBIAR_ORDEN_TABLA = 'CAMBIAR_ORDEN_TABLA';
export const cambiarOrdenTabla = (idTabla, orden) => ({
    type: CAMBIAR_ORDEN_TABLA,
    idTabla,
    orden
});

export const CARGAR_FILAS_TABLA_START = 'CARGAR_FILAS_TABLA_START';
const cargarFilasTablaStart = idTabla => ({
    type: CARGAR_FILAS_TABLA_START,
    idTabla
});

export const CARGAR_FILAS_TABLA_SUCCESS = 'CARGAR_FILAS_TABLA_SUCCESS';
const cargarFilasTablaSuccess = (idTabla, data, parseData) => ({
    type: CARGAR_FILAS_TABLA_SUCCESS,
    idTabla,
    data,
    parseData
});

export const CARGAR_FILAS_TABLA_ERROR = 'CARGAR_FILAS_TABLA_ERROR';
const cargarFilasTablaError = (idTabla, error) => ({
    type: CARGAR_FILAS_TABLA_ERROR,
    idTabla,
    error
});

export const cargarFilasTabla = (idTabla, url, params, parseData) => dispatch => {
    dispatch(cargarFilasTablaStart(idTabla));

    return ajax({
        metodo: 'get',
        url,
        params
    })
        .then(json => dispatch(cargarFilasTablaSuccess(idTabla, json, data => parseData(data, params))))
        .catch(error => dispatch(cargarFilasTablaError(idTabla, error)));
};
/*
export const recogerMaterial = (material, idMaterial, bd) => {
    dispatch(recogerMaterialStart());

    return editar('materiales', material, 'id', id, callback, error)
        .then(json => dispatch(recogerMaterialSuccess(json)))
        .catch(error => dispatch(recogerMaterialError(error)));


    let mapas = {};

    let materiales = this.getMapa('materiales','id',mapas,bd.materiales);
    let material = materiales[id];

    if (material.haciendomateriales > 0) {

        material.haciendomateriales -= material.hacemateriales;
        material.stockmateriales += material.hacemateriales;

        this.editar('materiales',material,'id',id,callback, error);
    } else {
        throw new Error('No hay nada que recoger');
    }
};
*/
