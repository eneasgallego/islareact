export const initState = () => ({
    nuevoPedido: {
        filas: []
    }
});

export const CAMBIAR_TIPO_NUEVO_PEDIDO = 'CAMBIAR_TIPO_NUEVO_PEDIDO';
export const cambiarTipoNuevoPedido = tipoPedido => ({
    type: CAMBIAR_TIPO_NUEVO_PEDIDO,
    tipoPedido
});

export const NUEVA_FILA_NUEVO_PEDIDO = 'NUEVA_FILA_NUEVO_PEDIDO';
export const nuevaFilaNuevoPedido = cols => ({
    type: NUEVA_FILA_NUEVO_PEDIDO,
    cols
});
