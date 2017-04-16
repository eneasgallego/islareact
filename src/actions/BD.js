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

import { handlerError } from '../actions/App';

const _handlerError = dispatch => error => dispatch(handlerError(error));

export const CARGAR_BD_START = 'CARGAR_BD_START';
const cargarBDStart = () => ({
    type: CARGAR_BD_START
});

export const CARGAR_BD_SUCCESS = 'CARGAR_BD_SUCCESS';
const cargarBDSuccess = data => ({
    type: CARGAR_BD_SUCCESS,
    data
});

export const cargarBD = () => dispatch => {
    dispatch(cargarBDStart());

    ajax({
        metodo: 'get',
        url:    'http://localhost:3000/db'
    })
        .then(json => dispatch(cargarBDSuccess(json)))
        .catch(_handlerError(dispatch));
};

/* MATERIALES */
export const recogerMaterial = idMaterial => (dispatch, getState) => {
    const
        state = getState(),
        { materiales } = state.bd,
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
        materiales: materiales.slice()
    }));
};
export const recogerTodoMaterial = idMaterial => (dispatch, getState) => {
    const
        state = getState(),
        { materiales } = state.bd,
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
        materiales: materiales.slice()
    }));
};
export const hacerMaterial = idMaterial => (dispatch, getState) => {
    const
        state = getState(),
        { materiales } = state.bd,
        material = materiales.buscar('id', idMaterial),
        vistaFabricas = getVistaBD(state.bd, 'vistaFabricas'),
        fabrica = vistaFabricas.buscar('fabricamateriales', material.fabricamateriales);

    if (fabrica.haciendomateriales < fabrica.maximofabricas) {
        const
            materialesNecesita = getVistaBD(state.bd, 'vistaMaterialesNecesita').filter(item => item.materialmateriales_necesita === idMaterial),
            materialNecesitaFalta = materialesNecesita.buscar(item => item.cantidadmateriales_necesita - item.stockmaterialesnecesita > NO_NECESITA);

        if (materialNecesitaFalta) {
            _handlerError(dispatch)(new Error(`Falta ${materialNecesitaFalta.nombrematerialesnecesita}.`));
        } else {
            material.haciendomateriales += material.hacemateriales;

            editar('materiales', material, idMaterial)
                .catch(_handlerError(dispatch));

            for (let i = INIT_INDEX; i < materialesNecesita.length; i++) {
                const
                    materialNecesita = materialesNecesita[i],
                    dif = materialNecesita.stockmaterialesnecesita - materialNecesita.cantidadmateriales_necesita,
                    auxMaterial = materiales.buscar('id', materialNecesita.materialnecesitamateriales_necesita);

                auxMaterial.stockmateriales = dif;

                editar('materiales', auxMaterial, auxMaterial.id)
                    .catch(_handlerError(dispatch));
            }
        }
    } else {
        _handlerError(dispatch)(new Error('Fábrica completa.'));
    }

    dispatch(cargarBDSuccess({
        ...state.bd,
        materiales: materiales.slice()
    }));
};


/* PEDIDOS */
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

export const procesarPedidos = idTipoPedido => (dispatch, getState) => {
    const
        state = getState(),
        { pedidos } = state.bd,
        pedidosFiltrados = pedidos.filter(item => item.tipopedidos === idTipoPedido && !item.procesadopedidos);

    if (pedidosFiltrados.length) {
        for (let i = INIT_INDEX; i < pedidosFiltrados.length; i++) {
            const pedido = pedidosFiltrados[i];

            pedido.procesadopedidos = true;

            editar('pedidos', pedido, pedido.id)
                .catch(_handlerError(dispatch));
        }
        dispatch(cargarBDSuccess({
            ...state.bd,
            pedidos: pedidos.slice()
        }));
    } else {
        _handlerError(dispatch)(new Error('Ya está procesado'));
    }
};
