export const FIJAR_FILTRO_FILA = 'FIJAR_FILTRO_FILA';
export const fijarFiltroFila = (id, campo) => ({
    type: FIJAR_FILTRO_FILA,
    id,
    campo
});
