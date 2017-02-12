import {
    LOAD,
    LOAD_RESPONSE,
    VER_PEDIDO,
    ACTUALIZAR_BD,
    EDITAR,
    RECOGER_MATERIAL,
    RECOGER_TODO_MATERIAL,
    editarBD,
} from '../actions'

import vistas from './vistas'

const generarVista = (bd, vista, forzar) => {
  let ret = {
    ...bd
  }

  if (forzar || typeof(ret[vista.key]) === 'undefined') {
    const cargarDependencias = dependencias => {
      let retDep = [];
      const cargarDependencia = dependencia => {
        if (typeof(ret[dependencia]) === 'undefined') {
          if (typeof(vistas[dependencia]) === 'undefined') {
            throw 'No existe la dependencia ' + dependencia
          } else {
            ret = {
              ...ret,
              ...generarVista(ret, vistas[dependencia])
            }
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

  return ret;
}

const generarVistas = bd => {
  let ret = {
    ...bd,
    idVerPedido: {}
  };

  for (var key in vistas) {
    ret = {
      ...ret,
      ...generarVista(ret, vistas[key])
    }
  }

  return ret;
}

const actualizarBD = (bd, tabla)=>{
  let ret = {
    ...bd
  }
  const getVistasActualizar = tabla=>{
    let ret = [];
    for (let key in vistas) {
      const vista = vistas[key];
      const dependencias = vista.dependencias;
      if (!!~dependencias.indexOf(tabla)) {
        ret.push(vista)
        const vistasActualizar = getVistasActualizar(vista.key);
        const vistasFiltradas = vistasActualizar.filter(vista=>!~ret.indexOf(vista))
        ret.push.apply(ret, vistasFiltradas);
        //ret.concat(vistasFiltradas);
      }
    }

    ret.sort((a,b)=>(!!~a.dependencias.indexOf(b.key)) ? 1 : !!~b.dependencias.indexOf(a.key) ? -1 : 0);

    return ret;
  }
  const vistasActualizar = getVistasActualizar(tabla);
  while(vistasActualizar.length) {
    const vista = vistasActualizar.shift();
    ret = {
      ...ret,
      ...generarVista(ret, vista, true)
    }
  }

  return ret;
}

const recogerMaterial = (id, bd) => {
  let material = bd.materiales.find(material=>material.id==id)

  if (material.haciendomateriales > 0) {
    material.haciendomateriales -= material.hacemateriales;
    material.stockmateriales += material.hacemateriales;

    editarBD('materiales', material, id);
  } else {
    throw new Error('No hay nada que recoger');
  }
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
    case VER_PEDIDO:
      return {
        ...state,
        bd: {
          ...state.bd,
          idVerPedido: action.pedido
        },
        pedido_ver: action.pedido
      }
    case ACTUALIZAR_BD:
      return {
        ...state,
        bd: actualizarBD(state.bd,action.tabla)
      }
    case EDITAR:
      return {
        ...state
      }
    case RECOGER_MATERIAL:
      return {
        ...state
      }
    case RECOGER_TODO_MATERIAL:
      return {
        ...state
      }
    default:
      return state
  }
}

export default isla;