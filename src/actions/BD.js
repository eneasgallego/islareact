import {
    ajax,
    editar,
    eliminar
} from '../utils/utils';
import { getVistaBD } from '../datos/utils';


import {
    NO_NECESITA,
    NUMERO_DEFECTO,
    INIT_INDEX,
    POS_TO_DELETE_SPLICE
} from '../utils/constantes';


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

    ajax({
        metodo: 'get',
        url:    'http://localhost:3000/db'
    })
        .then(json => dispatch(cargarBDSuccess(json)))
        .catch(error => dispatch(cargarBDError(error)));
};

export const recogerMaterial = idMaterial => (dispatch, getState) => {
    dispatch(cargarBDStart());

    const
        state = getState(),
        materiales = state.bd.materiales.slice(),
        material = materiales.buscar('id', idMaterial);

    if (material.haciendomateriales > NO_NECESITA) {

        material.haciendomateriales -= material.hacemateriales;
        material.stockmateriales += material.hacemateriales;

        editar('materiales', material, idMaterial)
            .then(() => dispatch(cargarBDSuccess({
                ...state.bd,
                materiales
            })))
            .catch(error => dispatch(cargarBDError(error)));
    } else {
        throw new Error('No hay nada que recoger');
    }
};

export const recogerTodoMaterial = idMaterial => (dispatch, getState) => {
    dispatch(cargarBDStart());

    const
        state = getState(),
        materiales = state.bd.materiales.slice(),
        material = materiales.buscar('id', idMaterial);

    if (material.haciendomateriales > NO_NECESITA) {

        material.stockmateriales += material.haciendomateriales;
        material.haciendomateriales = NUMERO_DEFECTO;

        editar('materiales', material, idMaterial)
            .then(json => dispatch(cargarBDSuccess({
                ...state.bd,
                materiales
            })))
    .catch(error => dispatch(cargarBDError(error)));
    } else {
        throw new Error('No hay nada que recoger');
    }
};

export const cerrarPedido = idTipoPedido => (dispatch, getState) => {
    dispatch(cargarBDStart());

    const
        state = getState(),
        { pedidos, materiales } = state.bd,
        vistaPedido = getVistaBD(state.bd, 'vistaPedido'),
        pedidosCerrar = vistaPedido.filter(item => item.tipopedidos === idTipoPedido),
        reject = error => dispatch(cargarBDError(error));

    for (let i = INIT_INDEX; i < pedidosCerrar.length; i++) {
        const
            pedido = pedidosCerrar[i],
            material = materiales.buscar('id', pedido.materialpedidos),
            index = pedidos.indice('id', pedido.idpedidos);

        material.stockmateriales -= pedido.cantidadpedidos;
        if (material.stockmateriales < NUMERO_DEFECTO) {
            material.stockmateriales = NUMERO_DEFECTO;
        }

        debugger;
        ~index && pedidos.splice(index, POS_TO_DELETE_SPLICE);

        editar('materiales', material, material.id)
            .catch(reject);

        eliminar('pedidos', pedido.idpedidos)
            .catch(reject);
    }

    dispatch(cargarBDSuccess({
        ...state.bd,
        materiales: materiales.slice(),
        pedidos:    pedidos.slice()
    }));
};
