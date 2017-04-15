import { getMapa } from './utils';
import getVistaFabricas from './VistaFabricas';
import getVistaMaterialesFalta from './VistaMaterialesFalta';
import getPedidosDinamicos from './PedidosDinamicos';

import { INIT_INDEX } from '../utils/constantes';

export default data => {
    const ret = [];
    const map = {};
    const mapas = {};

    const vistaFabricas = getVistaFabricas(data);
    const vistaMaterialesFalta = getVistaMaterialesFalta(data);
    const pedidosDinamicos = getPedidosDinamicos(data);

    for (let i = INIT_INDEX; i < pedidosDinamicos.length; i++) {
        const pedido = pedidosDinamicos[i];

        const materiales = getMapa('materiales','id',mapas,data.materiales);
        const material = materiales[pedido.materialpedidos];

        const mapVistaFabricas = getMapa('vistaFabricas','fabricamateriales',mapas,vistaFabricas);
        const fabrica = mapVistaFabricas[material.fabricamateriales];

        const mapVistaMaterialesFalta = getMapa('vistaMaterialesFalta','idmateriales',mapas,vistaMaterialesFalta);
        const materialFalta = mapVistaMaterialesFalta[material.id];

        const {
            id,
            tipopedidos,
            procesadopedidos,
            cantidadpedidos
        } = pedido;

        let obj = map[id];

        if (!obj) {
            obj = {
                idpedidos:          id,
                tipopedidos,
                procesadopedidos,
                cantidadpedidos,
                materialpedidos:    material.id,
                nombremateriales:   material.nombremateriales,
                stockmateriales:    material.stockmateriales,
                haciendomateriales: material.haciendomateriales,
                maximofabricas:     fabrica.maximofabricas,
                haciendofabricas:   fabrica.haciendomateriales,
                faltanecesita:      materialFalta.dif
            };
            ret.push(obj);
        }

        map[id] = obj;
    }

    return ret;
};
