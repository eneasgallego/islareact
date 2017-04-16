export const ID_INICIO_MATERIALES = 'inicio_materiales';
export const ID_INICIO_PEDIDOS = 'inicio_pedidos';
export const ID_INICIO_NECESITA = 'inicio_necesita';
export const ID_INICIO_PEDIDO = 'inicio_pedido';

export const CAMBIAR_ORDEN_TABLA = 'CAMBIAR_ORDEN_TABLA';
export const cambiarOrdenTabla = (idTabla, orden) => ({
    type: CAMBIAR_ORDEN_TABLA,
    idTabla,
    orden
});

/*
export const recogerMaterial = (material, idMaterial, bd) => {
    dispatch(recogerMaterialStart());

    return editar('materiales', material, 'id', id, callback, error)
        .then(json => dispatch(recogerMaterialSuccess(json)))
        .catch(error => dispatch(recogerMaterialError(error)));


    let mapas = {};

    let materiales = this.getMapa('materiales','id',mapas,bd.materiales);
    let material = materiales[id];

    if (material.haciendomateriales > 0) {

        material.haciendomateriales -= material.hacemateriales;
        material.stockmateriales += material.hacemateriales;

        this.editar('materiales',material,'id',id,callback, error);
    } else {
        throw new Error('No hay nada que recoger');
    }
};
*/
