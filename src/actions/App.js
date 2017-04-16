export const CAMBIAR_CONTENIDO = 'CAMBIAR_CONTENIDO';
export const cambiarContenido = contenido => ({
    type: CAMBIAR_CONTENIDO,
    contenido
});

export const DIMENSIONAR = 'DIMENSIONAR';
export const dimensionar = menu => ({
    type: DIMENSIONAR,
    menu
});

export const CAMBIAR_VER_PEDIDO = 'CAMBIAR_VER_PEDIDO';
export const cambiarVerPedido = pedido => ({
    type: CAMBIAR_VER_PEDIDO,
    pedido
});

export const SET_DIALOGO = 'SET_DIALOGO';
export const setDialogo = dialogo => ({
    type: SET_DIALOGO,
    dialogo
});

export const HANDLER_ERROR = 'HANDLER_ERROR';
export const handlerError = error => ({
    type: HANDLER_ERROR,
    error
});
