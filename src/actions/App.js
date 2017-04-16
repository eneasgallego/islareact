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
