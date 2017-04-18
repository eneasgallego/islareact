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
