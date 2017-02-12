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
const _editar = () => ({
    type: EDITAR
})
export const editarBD = (tabla, data, id) => dispatch => {
    //dispatch(_editar())
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
const _recogerMaterial = material => ({
    type: RECOGER_MATERIAL,
    material: material
})
export const recogerMaterial = material => dispatch => {
    if (material.haciendomateriales > 0) {
        material.haciendomateriales -= material.hacemateriales;
        material.stockmateriales += material.hacemateriales;

        dispatch(editarBD('materiales', material, material.id));
    } else {
        throw new Error('No hay nada que recoger');
    }
}
export const RECOGER_TODO_MATERIAL = 'RECOGER_TODO_MATERIAL'
const _recogerTodoMaterial = material => ({
    type: RECOGER_TODO_MATERIAL,
    material: material
})
export const recogerTodoMaterial = material => dispatch => {
    if (material.haciendomateriales > 0) {
        material.stockmateriales += material.haciendomateriales;
        material.haciendomateriales = 0;

        dispatch(editarBD('materiales', material, material.id));
    } else {
        throw new Error('No hay nada que recoger');
    }
}