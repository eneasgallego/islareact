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

export const CAMBIAR_VALOR_TABLA_NUEVO_PEDIDO = 'CAMBIAR_VALOR_TABLA_NUEVO_PEDIDO';
export const cambiarValorTablaNuevoPedido = (valor, campo, index) => ({
    type: CAMBIAR_VALOR_TABLA_NUEVO_PEDIDO,
    valor,
    campo,
    index
});

export const ELIMINAR_FILA_TABLA_NUEVO_PEDIDO = 'ELIMINAR_FILA_TABLA_NUEVO_PEDIDO';
export const eliminarFilaTablaNuevoPedido = index => ({
    type: ELIMINAR_FILA_TABLA_NUEVO_PEDIDO,
    index
});

export const LIMPIAR_NUEVO_PEDIDO = 'LIMPIAR_NUEVO_PEDIDO';
export const limpiarNuevoPedido = () => ({
    type: LIMPIAR_NUEVO_PEDIDO
});
