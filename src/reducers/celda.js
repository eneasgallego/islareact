import { getState } from '../componentes/base';

import {
    ORDER_EQUAL, ORDER_UP, ORDER_DOWN,
    NUMERO_DEFECTO
} from '../constantes';

import {
    SET_ORDEN_CELDA,
    GUARDAR_CELDA,
    SET_MOSTRAR_FILTROS_OVER_CELDA,
    SET_MOSTRAR_FILTROS_OVER_PANEL_CELDA,
    TOGGLE_MOSTRAR_FILTROS_CLICK_CELDA,
    LIMPIAR_MOSTRAR_FILTROS_CELDA,
    FILTRAR_CELDA,
    SET_EDITAR_CELDA
} from '../actions/celda';

const _initState = () => ({
    editar:                  false,
    mostrarFiltrosOver:      false,
    mostrarFiltrosOverPanel: false,
    mostrarFiltrosClick:     false,
    ordenCelda:              NUMERO_DEFECTO,
    filtro:                  undefined
});

const _setOrdenCelda = (state, id, orden, ordenDesc) => getState(state, id, _initState, ownState => ({ordenCelda: orden ?
    ordenDesc ?
        ORDER_DOWN :
        ORDER_UP :
    ORDER_EQUAL}));
const _guardarCelda = (state, id, guardar, valor, field) => getState(state, id, _initState, ownState => {
    guardar && guardar(valor, field);

    return {
        editar: false
    };
});
const _setEditarCelda = (state, id, editar) => getState(state, id, _initState, ownState => ({editar}));
const _setMostrarFiltrosOverCelda = (state, id, mostrarFiltrosOver) => getState(state, id, _initState, ownState => ({mostrarFiltrosOver}));
const _setMostrarFiltrosOverPanelCelda = (state, id, mostrarFiltrosOverPanel) => getState(state, id, _initState, ownState => ({mostrarFiltrosOverPanel}));
const _toggleMostrarFiltrosClickCelda = (state, id) => getState(state, id, _initState, ownState => ({mostrarFiltrosClick: !ownState.mostrarFiltrosClick}));
const _limpiarMostrarFiltrosCelda = (state, id) => getState(state, id, _initState, ownState => ({mostrarFiltrosOver: false, mostrarFiltrosOverPanel: false, mostrarFiltrosClick: false}));
const _filtrarCelda = (state, id, valor, onFiltrado) => getState(state, id, _initState, ownState => {
    onFiltrado(valor);

    return {
        filtro: {
            ...ownState.filtro,
            valor
        }
    };
});


export default (state = {}, action = {}) => {
    switch (action.type) {
    case SET_ORDEN_CELDA:
        return {
            ...state,
            ..._setOrdenCelda(state, action.id, action.orden, action.ordenDesc)
        };
    case GUARDAR_CELDA:
        return {
            ...state,
            ..._guardarCelda(state, action.id, action.guardar, action.valor, action.field)
        };
    case SET_MOSTRAR_FILTROS_OVER_CELDA:
        return {
            ...state,
            ..._setMostrarFiltrosOverCelda(state, action.id, action.mostrarFiltrosOver)
        };
    case SET_MOSTRAR_FILTROS_OVER_PANEL_CELDA:
        return {
            ...state,
            ..._setMostrarFiltrosOverPanelCelda(state, action.id, action.mostrarFiltrosOverPanel)
        };
    case FILTRAR_CELDA:
        return {
            ...state,
            ..._filtrarCelda(state, action.id, action.valor, action.onFiltrado)
        };
    case TOGGLE_MOSTRAR_FILTROS_CLICK_CELDA:
        return {
            ...state,
            ..._toggleMostrarFiltrosClickCelda(state, action.id)
        };
    case LIMPIAR_MOSTRAR_FILTROS_CELDA:
        return {
            ...state,
            ..._limpiarMostrarFiltrosCelda(state, action.id)
        };
    case SET_EDITAR_CELDA:
        return {
            ...state,
            ..._setEditarCelda(state, action.id)
        };
    default:
        return state;
    }
};
