export const SET_ORDEN_CELDA = 'SET_ORDEN_CELDA';
export const setOrdenCelda = (id, orden, ordenDesc) => ({
    type: SET_ORDEN_CELDA,
    id,
    orden,
    ordenDesc
});

export const GUARDAR_CELDA = 'GUARDAR_CELDA';
export const guardarCelda = (id, guardar, valor, field) => ({
    type: GUARDAR_CELDA,
    id,
    guardar,
    valor,
    field
});

export const SET_EDITAR_CELDA = 'SET_EDITAR_CELDA';
export const setEditarCelda = (id, editar) => ({
    type: SET_EDITAR_CELDA,
    id,
    editar
});

export const SET_MOSTRAR_FILTROS_OVER_CELDA = 'SET_MOSTRAR_FILTROS_OVER_CELDA';
export const setMostrarFiltrosOverCelda = (id, mostrarFiltrosOver) => ({
    type: SET_MOSTRAR_FILTROS_OVER_CELDA,
    id,
    mostrarFiltrosOver
});

export const SET_MOSTRAR_FILTROS_OVER_PANEL_CELDA = 'SET_MOSTRAR_FILTROS_OVER_PANEL_CELDA';
export const setMostrarFiltrosOverPanelCelda = (id, mostrarFiltrosOverPanel) => ({
    type: SET_MOSTRAR_FILTROS_OVER_PANEL_CELDA,
    id,
    mostrarFiltrosOverPanel
});

export const TOGGLE_MOSTRAR_FILTROS_CLICK_CELDA = 'TOGGLE_MOSTRAR_FILTROS_CLICK_CELDA';
export const toggleMostrarFiltrosClickCelda = id => ({
    type: TOGGLE_MOSTRAR_FILTROS_CLICK_CELDA,
    id
});

export const LIMPIAR_MOSTRAR_FILTROS_CELDA = 'LIMPIAR_MOSTRAR_FILTROS_CELDA';
export const limpiarMostrarFiltrosCelda = id => ({
    type: LIMPIAR_MOSTRAR_FILTROS_CELDA,
    id
});

export const FILTRAR_CELDA = 'FILTRAR_CELDA';
export const filtrarCelda = (id, valor, onFiltrado) => ({
    type: FILTRAR_CELDA,
    id,
    valor,
    onFiltrado
});
