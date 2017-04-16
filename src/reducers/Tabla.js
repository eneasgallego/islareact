export const getInitialState = () => ({
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
