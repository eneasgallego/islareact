import { getMapa } from './utils';
import getVistaFabricas from './vistaFabricas';
import getVistaMaterialesFalta from './vistaMaterialesFalta';
import getPedidosDinamicos from './pedidosDinamicos';

import {
    ORDER_EQUAL, ORDER_UP, ORDER_DOWN,
    FIRST_INDEX,
    PROCESADO_PEDIDO, NUMERO_DEFECTO
} from '../constantes';

export default (data,calcularProfundidad,sinpedidos) => {
    const ret = [];
    const map = {};
    const mapas = {};

    const vistaFabricas = getVistaFabricas(data);
    const vistaMaterialesFalta = getVistaMaterialesFalta(data);

    const pedidosDinamicos = getPedidosDinamicos(data);

    const mapVistaFabricas = getMapa('vistaFabricas','fabricamateriales',mapas,vistaFabricas);
    const mapVistaMaterialesFalta = getMapa('vistaMaterialesFalta','idmateriales',mapas,vistaMaterialesFalta);

    const calcularPedidos = (material, pedidos) => {
        if (sinpedidos || pedidos.length) {
            const fabrica = mapVistaFabricas[material.fabricamateriales];
            const materialFalta = mapVistaMaterialesFalta[material.id];

            let obj = map[material.id];

            if (!obj) {
                obj = {
                    materialpedidos:    material.id,
                    nombremateriales:   material.nombremateriales,
                    fabricamateriales:  material.fabricamateriales,
                    nombrefabricas:     fabrica.nombrefabricas,
                    maximofabricas:     fabrica.maximofabricas,
                    haciendofabricas:   fabrica.haciendomateriales,
                    stockmateriales:    material.stockmateriales,
                    haciendomateriales: material.haciendomateriales,
                    procesadopedidos:   PROCESADO_PEDIDO,
                    faltanecesita:      materialFalta.dif,
                    cantidadpedidos:    NUMERO_DEFECTO,
                    faltamateriales:    NUMERO_DEFECTO,
                    profundidadpedidos: undefined
                };
                ret.push(obj);
                map[material.id] = obj;
            }

            for (let i = FIRST_INDEX; i < pedidos.length; i++) {
                const pedido = pedidos[i];

                if (pedido.procesadopedidos) {
                    obj.cantidadpedidos += pedido.cantidadpedidos;

                    if (typeof obj.profundidadpedidos === 'undefined' && calcularProfundidad(obj)) {
                        obj.profundidadpedidos = pedido.profundidadpedidos;
                    }
                }
            }
        }
    };

    for (let i = FIRST_INDEX; i < data.materiales.length; i++) {
        const material = data.materiales[i];
        const pedidos = pedidosDinamicos.filter(item => item.materialpedidos === material.id).sort((a,b) => a.profundidadpedidos === b.profundidadpedidos ?
            ORDER_EQUAL :
            a.profundidadpedidos > b.profundidadpedidos ?
                ORDER_DOWN :
                ORDER_UP);

        calcularPedidos(material, pedidos);
    }

    for (let i = FIRST_INDEX; i < ret.length; i++) {
        const item = ret[i];

        item.faltamateriales = item.cantidadpedidos - item.stockmateriales - item.haciendomateriales;
    }

    return ret;
};
