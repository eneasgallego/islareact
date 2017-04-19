export const ID_INICIO_MATERIALES = 'inicio_materiales';
export const ID_INICIO_PEDIDOS = 'inicio_pedidos';
export const ID_INICIO_NECESITA = 'inicio_necesita';
export const ID_INICIO_PEDIDO = 'inicio_pedido';
export const ID_EXCEDENTE = 'excedente';

export const CAMBIAR_ORDEN_TABLA = 'CAMBIAR_ORDEN_TABLA';
export const cambiarOrdenTabla = (idTabla, campo) => ({
    type: CAMBIAR_ORDEN_TABLA,
    idTabla,
    campo
});

export const SET_ORDEN_TABLA = 'SET_ORDEN_TABLA';
export const setOrdenTabla = (idTabla, orden) => ({
    type: SET_ORDEN_TABLA,
    idTabla,
    orden
});

export const FILTRAR_TABLA = 'FILTRAR_TABLA';
export const filtrarTabla = (idTabla, valor, campo) => ({
    type: FILTRAR_TABLA,
    idTabla,
    valor,
    campo
});

export const LIMPIAR_FILTRO_TABLA = 'LIMPIAR_FILTRO_TABLA';
export const limpiarFiltroTabla = (idTabla, campo) => ({
    type: LIMPIAR_FILTRO_TABLA,
    idTabla,
    campo
});
