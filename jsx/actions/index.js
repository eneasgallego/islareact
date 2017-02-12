export const LOAD_RESPONSE = 'LOAD_RESPONSE'
export const LOAD = 'LOAD'
const _loadResponse = data => ({
    type: LOAD_RESPONSE,
    data: data
})
const _load = () => ({
  type: LOAD
})
export const fetchBD = url => dispatch => {
    dispatch(_load())
    return fetch(url)
        .then(response => response.json())
        .then(json => dispatch(_loadResponse(json)))
}

export const EDITAR = 'EDITAR'
export const ELIMINAR = 'ELIMINAR'
const _routeBD = (dispatch, toEdit)=>{
    let obj = toEdit.shift();
    let fn, fn2;
    if (obj.accion == EDITAR) {
        fn = editarBD;
        fn2 = _editar;
    } else if (obj.accion == ELIMINAR) {
        fn = eliminarBD;
        fn2 = _eliminar;
    }
    fn && dispatch(fn.apply(this, obj.toEdit));
    dispatch(fn2(toEdit));
}
const _editar = toEdit => {
    return {
        type: EDITAR,
        toEdit: toEdit
    }
}
const _eliminar = toEdit => {
    return {
        type: ELIMINAR,
        toEdit: toEdit
    }
}
export const editarBD = (tabla, data, id) => dispatch => {
    if (tabla instanceof Array) {
        _routeBD(dispatch, tabla);
    } else {
        let url = 'http://localhost:3000/' + tabla + '/' + id;
        let body = [];

        for (let key in data) {
            body.push(key + '=' + data[key]);
        }
        body = encodeURI(body.join('&'));

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        return fetch(url, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => dispatch(_actualizarBD(tabla)))
            .catch(err => {throw err})
    }
}
export const eliminarBD = (tabla, id) => dispatch => {
    if (tabla instanceof Array) {
        _routeBD(dispatch, tabla);
    } else {
        let url = 'http://localhost:3000/' + tabla + '/' + id;

        return fetch(url, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(json => dispatch(_actualizarBD(tabla)))
            .catch(err => {throw err})
    }
}

export const ACTUALIZAR_BD = 'ACTUALIZAR_BD'
const _actualizarBD = tabla => ({
    type: ACTUALIZAR_BD,
    tabla: tabla
})

export const VER_PEDIDO = 'VER_PEDIDO'
const _verPedido = pedido => ({
    type: VER_PEDIDO,
    pedido: pedido
})
export const verPedido = pedido => dispatch => {
    dispatch(_verPedido(pedido))
    dispatch(_actualizarBD('idVerPedido'))
}

export const RECOGER_MATERIAL = 'RECOGER_MATERIAL'
export const recogerMaterial = material => ({
    type: RECOGER_MATERIAL,
    material: material
})
export const RECOGER_TODO_MATERIAL = 'RECOGER_TODO_MATERIAL'
export const recogerTodoMaterial = material => ({
    type: RECOGER_TODO_MATERIAL,
    material: material
})

export const HACER_MATERIAL = 'HACER_MATERIAL'
export const hacerMaterial = (material, cantidad) => ({
    type: HACER_MATERIAL,
    material: material,
    cantidad: cantidad
})

export const PROCESAR_PEDIDO = 'PROCESAR_PEDIDO'
export const procesarPedido = pedido => ({
    type: PROCESAR_PEDIDO,
    pedido: pedido
})
export const PROCESAR_PEDIDOS = 'PROCESAR_PEDIDOS'
export const procesarPedidos = tipo => ({
    type: PROCESAR_PEDIDOS,
    tipo: tipo
})
export const CERRAR_PEDIDO = 'CERRAR_PEDIDO'
export const cerrarPedido = tipo => ({
    type: CERRAR_PEDIDO,
    tipo: tipo
})
