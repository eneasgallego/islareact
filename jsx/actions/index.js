export const LOAD = 'LOAD'
export const LOAD_RESPONSE = 'LOAD_RESPONSE'
export const load = () => ({
  type: LOAD
})
export const loadResponse = (data) => ({
  type: LOAD_RESPONSE,
  data: data
})
export const fetchBD = url => dispatch => {
  dispatch(load())
  return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(loadResponse(json)))
}

export const ACTUALIZAR_BD = 'ACTUALIZAR_BD'
export const actualizarBD = tabla => ({
    type: ACTUALIZAR_BD,
    tabla: tabla
})

export const VER_PEDIDO = 'VER_PEDIDO'
export const verPedido = pedido => ({
    type: VER_PEDIDO,
    pedido: pedido
})
export const cambiarVerPedido = pedido => dispatch => {
    dispatch(verPedido(pedido))
    dispatch(actualizarBD('idVerPedido'))
}
