import {
    ajax,
    insertar,
    editar,
    eliminar
} from '../utils/utils';

import { limpiarNuevoPedido } from './PanelNuevoPedido';

import { getVistaBD } from '../datos/utils';

import {
    cambiarContenido,
    handlerError
} from './app';

import {
    NO_NECESITA,
    NUMERO_DEFECTO,
    INIT_INDEX,
    POS_TO_DELETE_SPLICE
} from '../utils/constantes';

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

const insertarBDSuccess = (tabla, newData, oldData) => (dispatch, getState) => {
    const
        state = getState(),
        filasTabla = state.bd[tabla],
        index = filasTabla.indexOf(oldData);

    if (~index) {
        filasTabla[index] = newData;

        dispatch(cargarBDSuccess({
            ...state.bd,
            [tabla]: filasTabla.slice()
        }));
    }
};

export const insertarBD = (tabla, data) => (dispatch, getState) => {
    const
        state = getState(),
        filasTabla = state.bd[tabla];

    filasTabla.unshift(data);

    insertar(tabla, data)
        .then(json => dispatch(insertarBDSuccess(tabla, json, data)))
        .catch(_handlerError(dispatch));
};

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
export const ganarMaterial = idMaterial => (dispatch, getState) => {
    const
        state = getState(),
        { materiales } = state.bd,
        material = materiales.buscar('id', idMaterial);

    material.stockmateriales++;

    editar('materiales', material, idMaterial)
        .catch(_handlerError(dispatch));

    dispatch(cargarBDSuccess({
        ...state.bd,
        materiales: materiales.slice()
    }));
};
export const venderMaterial = idMaterial => (dispatch, getState) => {
    const
        state = getState(),
        { materiales } = state.bd,
        material = materiales.buscar('id', idMaterial);

    if (material.stockmateriales > NO_NECESITA) {
        material.stockmateriales--;
    } else {
        _handlerError(dispatch)(new Error('No hay para vender.'));
    }

    editar('materiales', material, idMaterial)
        .catch(_handlerError(dispatch));

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

export const crearNuevoPedido = nuevoPedido => dispatch => {
    try {
        const { tipoPedido , filas } = nuevoPedido;

        if (tipoPedido) {
            if (filas.length) {
                for (let i = INIT_INDEX; i < filas.length; i++) {
                    dispatch(insertarBD('pedidos', {
                        ...filas[i],
                        tipopedidos:        tipoPedido.id,
                        profundidadpedidos: tipoPedido.profundidadtipos_pedido,
                        procesadopedidos:   false
                    }));
                }

                dispatch(cambiarContenido('inicio'));
                dispatch(limpiarNuevoPedido());
            } else {
                handlerError(new Error('Debe haber seleccionado algún material.'));
            }
        } else {
            handlerError(new Error('Hay que seleccionar el Tipo de Pedido.'));
        }
    } catch (e) {
        handlerError(e);
    }
};

export const NUEVA_FILA = 'NUEVA_FILA';
export const nuevaFila = (tabla, cols) => ({
    type: NUEVA_FILA,
    tabla,
    cols
});

export const eliminarFila = (dataset, index) => (dispatch, getState) => {
    const
        state = getState(),
        tabla = state.bd[dataset],
        fila = tabla[index];

    tabla.splice(index, POS_TO_DELETE_SPLICE);

    eliminar(dataset, fila.id)
        .catch(_handlerError(dispatch));

    dispatch(cargarBDSuccess({
        ...state.bd,
        [dataset]: tabla.slice()
    }));
};

export const cambiarValorTabla = (dataset, valor, campo, index) => (dispatch, getState) => {
    const
        state = getState(),
        tabla = state.bd[dataset],
        fila = tabla[index];

    fila[campo] = valor;

    if (fila.id === undefined) {
        insertar(dataset, fila)
            .then(json => dispatch(insertarBDSuccess(dataset, json, fila)))
            .catch(_handlerError(dispatch));
    } else {
        editar(dataset, fila, fila.id)
            .catch(_handlerError(dispatch));
    }

    dispatch(cargarBDSuccess({
        ...state.bd,
        [dataset]: tabla.slice()
    }));
};
