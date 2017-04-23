import {
    getMapa,
    getVistaBD
} from './utils';

import { INIT_INDEX } from '../utils/constantes';

export default data => {
    const
        ret = [],
        map = {},
        mapas = {},
        vistaFabricas = getVistaBD(data, 'vistaFabricas'),
        pedidosDinamicos = getVistaBD(data, 'pedidosDinamicos');

    for (let i = INIT_INDEX; i < data.materiales.length; i++) {
        const
            material = data.materiales[i],
            { id } = material,
            mapVistaFabricas = getMapa('vistaFabricas','fabricamateriales',mapas,vistaFabricas),
            fabrica = mapVistaFabricas[material.fabricamateriales],
            materialpedidos = pedidosDinamicos.filter(item => item.materialpedidos === id),
            materialpedidosprocesados = materialpedidos.filter(item => item.procesadopedidos),
            cantidadmaterialpedidos = materialpedidos.calcular('cantidadpedidos'),
            cantidadmaterialpedidosprocesados = materialpedidosprocesados.calcular('cantidadpedidos');

        let obj = map[id];

        if (!obj) {
            obj = {
                materialpedidos:               id,
                nombremateriales:              material.nombremateriales,
                stockmateriales:               material.stockmateriales,
                haciendomateriales:            material.haciendomateriales,
                cantidadpedidos:               cantidadmaterialpedidos,
                cantidadpedidosprocesados:     cantidadmaterialpedidosprocesados,
                excedentemateriales:           material.stockmateriales - cantidadmaterialpedidos,
                excedentematerialesprocesados: material.stockmateriales - cantidadmaterialpedidosprocesados,
                fabricamateriales:             material.fabricamateriales,
                nombrefabricas:                fabrica.nombrefabricas
            };
            ret.push(obj);
        }

        map[id] = obj;
    }

    return ret;
};
