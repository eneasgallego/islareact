export const getInitialState = () => ({
    filas:    [],
    filtros:  [],
    orden:    [],
    cargando: false
});

const _checkTabla = (state, action, idTabla, fn) => action.idTabla === idTabla ?
{
    ...state,
    ...fn()
} :
state;

export const cambiarOrdenTabla = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => ({orden: action.orden}));

export const cargarFilasTablaStart = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => ({cargando: true}));
export const cargarFilasTablaSuccess = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => ({
    filas:    action.parseData(action.data),
    cargando: false
}));
export const cargarFilasTablaError = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => ({cargando: false, error: action.error}));
