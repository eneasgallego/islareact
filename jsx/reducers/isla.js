import {
    LOAD,
    LOAD_RESPONSE,
    VER_PEDIDO,
    ACTUALIZAR_BD,
    EDITAR,
    INSERTAR,
    INSERTAR_RESPONSE,
    ELIMINAR,
    RECOGER_MATERIAL,
    RECOGER_TODO_MATERIAL,
    HACER_MATERIAL,
    VENDER_MATERIAL,
    GANAR_MATERIAL,
    PROCESAR_PEDIDO,
    PROCESAR_PEDIDOS,
    CERRAR_PEDIDO,
    GUARDAR_BD,
    NUEVA_FILA,
    ELIMINAR_BD
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
      }
    }

    return ret;
  }
  const vistasActualizar = getVistasActualizar(tabla);
  debugger;
  const ordenarVistas = vistas=>{
    for (let i = 0 ; i < vistas.length - 1 ; i++) {
      for (let j = i + 1 ; j < vistas.length ; j++) {
        const vista = vistas[i];
        const vista2 = vistas[j];
        if (!!~vista.dependencias.indexOf(vista2.key)) {
          vistas[i] = vista2;
          vistas[j] = vista;
        }
      }
    }
    return vistas;
  }
  const vistasOrdenar = ordenarVistas(vistasActualizar);
  //vistasActualizar.sort((a,b)=>(!!~a.dependencias.indexOf(b.key)) ? 1 : !!~b.dependencias.indexOf(a.key) ? -1 : 0);
  while(vistasOrdenar.length) {
    const vista = vistasOrdenar.shift();
    ret = {
      ...ret,
      ...generarVista(ret, vista, true)
    }
  }

  return ret;
}

const recogerMaterial = material => {
  if (material.haciendomateriales > 0) {
    material.haciendomateriales -= material.hacemateriales;
    material.stockmateriales += material.hacemateriales;

    return [{
      accion: EDITAR,
      toEdit: ['materiales', material, material.id]
    }]
  } else {
    throw new Error('No hay nada que recoger');
  }

  return [];
}
const recogerTodoMaterial = material => {
  if (material.haciendomateriales > 0) {
    material.stockmateriales += material.haciendomateriales;
    material.haciendomateriales = 0;

    return [{
      accion: EDITAR,
      toEdit: ['materiales', material, material.id]
    }]
  } else {
    throw new Error('No hay nada que recoger');
  }

  return [];
}
const hacerMaterial = (material, cantidad, bd) => {
  let ret = [];

  let vistaFabricas = bd.vistaFabricas;
  let fabrica = vistaFabricas.find(fabrica=>fabrica.fabricamateriales==material.fabricamateriales);

  if (fabrica.maximofabricas >= 0) {
    if (fabrica.haciendomateriales < fabrica.maximofabricas) {
      let materiales_necesita = bd.vistaMaterialesNecesita.filter(item => {
        return item.materialmateriales_necesita == material.id;
      });

      let material_necesita_falta = materiales_necesita.find(item => {
        return item.cantidadmateriales_necesita - item.stockmaterialesnecesita > 0;
      });
      if (!material_necesita_falta) {
        material.haciendomateriales += (material.hacemateriales * cantidad);

        ret.push({
          accion: EDITAR,
          toEdit: ['materiales', material, material.id]
        })

        materiales_necesita.forEach((material_necesita) => {
          let dif = material_necesita.stockmaterialesnecesita - material_necesita.cantidadmateriales_necesita;
          dif *= cantidad;
          let auxMaterial = bd.materiales.find(material=>material.id==material_necesita.materialnecesitamateriales_necesita);
          auxMaterial.stockmateriales = dif;
          ret.push({
            accion: EDITAR,
            toEdit: ['materiales', auxMaterial, auxMaterial.id]
          })
        });
      } else {
        throw new Error('Falta ' + material_necesita_falta.nombrematerialesnecesita + '.');
      }
    } else {
      throw new Error('Fábrica completa.');
    }
  } else {
    material.stockmateriales += (material.hacemateriales * cantidad);
  }

  return ret;
}
const venderMaterial = material => {
  if (material.stockmateriales > 0) {

    material.stockmateriales--;

    return [{
      accion: EDITAR,
      toEdit: ['materiales', material, material.id]
    }]
  } else {
    throw new Error('No hay nada que vender');
  }

  return [];
}
const ganarMaterial = material => {
  material.stockmateriales++;

  return [{
    accion: EDITAR,
    toEdit: ['materiales', material, material.id]
  }]
}

const procesarPedido = pedido => {
  let ret = [];
  if (!pedido.procesadopedidos) {
    pedido.procesadopedidos = true;
    ret.push({
      accion: EDITAR,
      toEdit: ['pedidos',pedido,pedido.id]
    });
  }

  return ret;
}
const procesarPedidos = (tipo, pedidos) => {
  let ret = [];

  let pedidos_filtrados = pedidos.filter(item => item.tipopedidos == tipo);

  pedidos_filtrados.forEach(item => {
    ret.push.apply(ret, procesarPedido(item));
  });

  return ret;
}
const cerrarPedido = (tipo, bd) => {
  let ret = [];

  let vistaPedido = bd.vistaPedido;
  let pedidos = vistaPedido.filter(item => item.tipopedidos == tipo);

  pedidos.forEach(pedido => {
    if (!pedido.novacia_pedido) {
      let material = bd.materiales.find(material=>material.id==pedido.materialpedidos);
      material.stockmateriales -= pedido.cantidadpedidos
      if (material.stockmateriales < 0) {
        material.stockmateriales = 0;
      }
      ret.push({
        accion: EDITAR,
        toEdit: ['materiales',material,material.id]
      });
    }
  });

  let pedidos_eliminar = bd.pedidos.filter(pedido => pedido.tipopedidos == tipo);
  pedidos_eliminar.forEach(pedido => {
    bd.pedidos.splice(bd.pedidos.indexOf(pedido), 1);
    ret.push({
      accion: ELIMINAR,
      toEdit: ['pedidos',pedido.id]
    });
  });

  return ret;
}
const insertarBD = (bd, tabla, id) => {
  let tablaBD = bd[tabla];
  let obj = tablaBD.find(obj=>obj.id==undefined);
  obj.id = id;
  return bd;
}
const guardarBD = (bd, tabla, id, campo, valor, persistir) => {
  let ret = [];

  let tablaBD = bd[tabla];
  let obj = tablaBD.find(obj=>obj.id==id);
  obj[campo] = valor;
  persistir && ret.push({
    accion: id ? EDITAR : INSERTAR,
    toEdit: [tabla, obj, id]
  })

  return {
    bd: bd,
    toEdit: ret
  };
}
const nuevaFila = (bd, tabla, obj) => {
  bd[tabla].unshift(obj);
  return bd;
}
const eliminarBD = (bd, tabla, id, persistir) => {
  let ret = [];

  let filas = bd[tabla];
  let indice = filas.indexOf(filas.find(item => {
    return (item.id == id);
  }));
  if (!!~indice) {
    filas.splice(indice, 1);
  }

  persistir && ret.push({
    accion: ELIMINAR,
    toEdit: [tabla, id]
  })

  return {
    bd: bd,
    toEdit: ret
  };
}
const _manageToEdit = (oldToEdit, newToEdit) => {
  let ret = [];
  ret.push.apply(ret,oldToEdit)
  ret.push.apply(ret,newToEdit)
  return ret;
}

const isla = (state = {
  isFetching: false,
  bd: {}
}, action={}) => {
  try {
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
          bd: actualizarBD(state.bd, action.tabla)
        }
      case INSERTAR:
        return {
          ...state,
          toEdit: action.toEdit
        }
      case INSERTAR_RESPONSE:
        return {
          ...state,
          bd: insertarBD(state.bd, action.tabla, action.id)
        }
      case EDITAR:
        return {
          ...state,
          toEdit: action.toEdit
        }
      case ELIMINAR:
        return {
          ...state,
          toEdit: action.toEdit
        }
      case RECOGER_MATERIAL:
        return {
          ...state,
          toEdit: _manageToEdit(state.toEdit, recogerMaterial(action.material))
        }
      case RECOGER_TODO_MATERIAL:
        return {
          ...state,
          toEdit: _manageToEdit(state.toEdit, recogerTodoMaterial(action.material))
        }
      case HACER_MATERIAL:
        return {
          ...state,
          toEdit: _manageToEdit(state.toEdit, hacerMaterial(action.material, action.cantidad, state.bd))
        }
      case VENDER_MATERIAL:
        return {
          ...state,
          toEdit: _manageToEdit(state.toEdit, venderMaterial(action.material))
        }
      case GANAR_MATERIAL:
        return {
          ...state,
          toEdit: _manageToEdit(state.toEdit, ganarMaterial(action.material))
        }
      case PROCESAR_PEDIDO:
        return {
          ...state,
          toEdit: _manageToEdit(state.toEdit, procesarPedido(action.pedido))
        }
      case PROCESAR_PEDIDOS:
        return {
          ...state,
          toEdit: _manageToEdit(state.toEdit, procesarPedidos(action.tipo, state.bd.pedidos))
        }
      case CERRAR_PEDIDO:
        return {
          ...state,
          toEdit: _manageToEdit(state.toEdit, cerrarPedido(action.tipo, state.bd))
        }
      case GUARDAR_BD:
        let estado = guardarBD(state.bd, action.tabla, action.id, action.campo, action.valor, action.persistir);
        const toEdit = _manageToEdit(state.toEdit, estado.toEdit);

        return {
          ...state,
          bd: estado.bd,
          toEdit: toEdit
        }
      case NUEVA_FILA:
        return {
          ...state,
          bd: nuevaFila(state.bd, action.tabla, action.obj)
        }
      case ELIMINAR_BD:
        let estadoEliminar = eliminarBD(state.bd, action.tabla, action.id, action.persistir);
        const toEditEliminar = _manageToEdit(state.toEdit, estadoEliminar.toEdit);

        return {
          ...state,
          bd: estadoEliminar.bd,
          toEdit: toEditEliminar
        }
      default:
        return state
    }
  } catch (e) {
    return {
      ...state,
      error: e
    }
  }
}

export default isla;