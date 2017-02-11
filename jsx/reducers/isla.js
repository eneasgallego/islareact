import {
    LOAD,
    LOAD_RESPONSE
} from '../actions'

const isla = (state = {
  isFetching: false,
  bd: {}
}, action={}) => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        isFetching: true
      }
    case LOAD_RESPONSE:
      return {
        ...state,
        isFetching: false,
        bd: action.data
      }
    default:
      return state
    }
}

export default isla;