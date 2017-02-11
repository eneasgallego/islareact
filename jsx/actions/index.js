export const LOAD = 'LOAD'
export const LOAD_RESPONSE = 'LOAD_RESPONSE'

export const load = () => ({
  type: LOAD,
  loadResponse: loadResponse
})

export const loadResponse = response => ({
  type: LOAD_RESPONSE,
  data: response
})

