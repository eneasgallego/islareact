import {
    LOAD,
    LOAD_RESPONSE
} from '../actions'

import vistas from './vistas'

const generarVistas = bd => {
  let ret = {};

  const generarVista = vista => {
    if (typeof(ret[vista.key]) === 'undefined') {
      const cargarDependencias = dependencias => {
        let retDep = [];
        const cargarDependencia = dependencia => {
          if (typeof(ret[dependencia]) === 'undefined') {
            if (typeof(vistas[dependencia]) === 'undefined') {
              throw 'No existe la dependencia ' + dependencia
            } else {
              generarVista(vistas[dependencia]);
              cargarDependencia(dependencia);
            }
          } else {
            retDep.push(ret[dependencia]);
          }
        }
        dependencias.forEach(cargarDependencia)

        return retDep;
      }

      let dependencias = cargarDependencias(vista.dependencias);

      const datos = vista.fn.apply(this, dependencias);

      ret[vista.key] = datos;
    }
  }

  for (var key in bd) {
    ret[key] = bd[key];
  }

  for (var key in vistas) {
    generarVista(vistas[key]);
  }

  return ret;
}

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
        bd: generarVistas(action.data)
      }
    default:
      return state
    }
}

export default isla;