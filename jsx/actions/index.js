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

