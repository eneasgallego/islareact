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

const _handlerError = dispatch => error => dispatch(cargarBDError(error));

export const cargarBD = () => dispatch => {
    dispatch(cargarBDStart());

    ajax({
        metodo: 'get',
        url:    'http://localhost:3000/db'
    })
        .then(json => dispatch(cargarBDSuccess(json)))
        .catch(_handlerError(dispatch));
};

export const recogerMaterial = idMaterial => (dispatch, getState) => {
    const
        state = getState(),
        materiales = state.bd.materiales.slice(),
        material = materiales.buscar('id', idMaterial);

    if (material.haciendomateriales > NO_NECESITA) {

        material.haciendomateriales -= material.hacemateriales;
        material.stockmateriales += material.hacemateriales;

        editar('materiales', material, idMaterial)
            .catch(_handlerError(dispatch));
    } else {
        _handlerError(dispatch)(new Error('No hay nada que recoger'));
    }
    dispatch(cargarBDSuccess({
        ...state.bd,
        materiales
    }));
};

export const recogerTodoMaterial = idMaterial => (dispatch, getState) => {
    const
        state = getState(),
        materiales = state.bd.materiales.slice(),
        material = materiales.buscar('id', idMaterial);

    if (material.haciendomateriales > NO_NECESITA) {

        material.stockmateriales += material.haciendomateriales;
        material.haciendomateriales = NUMERO_DEFECTO;

        editar('materiales', material, idMaterial)
    .catch(_handlerError(dispatch));
    } else {
        _handlerError(dispatch)(new Error('No hay nada que recoger'));
    }
    dispatch(cargarBDSuccess({
        ...state.bd,
        materiales
    }));
};

export const cerrarPedido = idTipoPedido => (dispatch, getState) => {
    const
        state = getState(),
        { pedidos, materiales } = state.bd,
        vistaPedido = getVistaBD(state.bd, 'vistaPedido'),
        pedidosCerrar = vistaPedido.filter(item => item.tipopedidos === idTipoPedido);

    for (let i = INIT_INDEX; i < pedidosCerrar.length; i++) {
        const
            pedido = pedidosCerrar[i],
            material = materiales.buscar('id', pedido.materialpedidos),
            index = pedidos.indice('id', pedido.idpedidos);

        material.stockmateriales -= pedido.cantidadpedidos;
        if (material.stockmateriales < NUMERO_DEFECTO) {
            material.stockmateriales = NUMERO_DEFECTO;
        }

        ~index && pedidos.splice(index, POS_TO_DELETE_SPLICE);

        editar('materiales', material, material.id)
            .catch(_handlerError(dispatch));

        eliminar('pedidos', pedido.idpedidos)
            .catch(_handlerError(dispatch));
    }

    dispatch(cargarBDSuccess({
        ...state.bd,
        materiales: materiales.slice(),
        pedidos:    pedidos.slice()
    }));
};

export const procesarPedido = idPedido => (dispatch, getState) => {
    const
        state = getState(),
        { pedidos } = state.bd,
        pedido = pedidos.buscar('id', idPedido);

    debugger;
    if (pedido.procesadopedidos) {
        _handlerError(dispatch)(new Error('Ya está procesado'));
    } else {
        pedido.procesadopedidos = true;
        editar('pedidos', pedido, pedido.id)
            .catch(_handlerError(dispatch));
        dispatch(cargarBDSuccess({
            ...state.bd,
            pedidos: pedidos.slice()
        }));
    }
};
