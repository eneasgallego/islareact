import {
    LOAD,
    LOAD_RESPONSE
} from '../actions'

const gestionarError = err => {
  throw err;
}
const loadIsla = () => {
  return new Promise((resolve, reject)=>{
    ajax({
      metodo: 'get',
      url: 'http://localhost:3000/db',
      success: resolve,
      error: reject
    });
  });
}

const isla = (state = {}, action) => {
  switch (action.type) {
    case LOAD:
      loadIsla()
          .then(r => dispatch({ type: LOAD_RESPONSE, value: r }))
      return state;

    case LOAD_RESPONSE:
      return action.data;
    default:
      return state
  }
}

export default isla
