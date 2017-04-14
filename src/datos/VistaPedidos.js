import { getMapa } from './utils';
import getPedidosDinamicos from './PedidosDinamicos';

import {
    INIT_INDEX,
    PROCESADO_PEDIDO, PROCESADO_PEDIDO_NO, PROCESADO_PEDIDO_ALGUNO,
    NUMERO_DEFECTO,
    NO_NECESITA
} from '../utils/constantes';

export default data => {
    const ret = [];
    const map = {};
    const mapas = {};


    const pedidosDinamicos = getPedidosDinamicos(data);

    for (let i = INIT_INDEX; i < pedidosDinamicos.length; i++) {
        const pedido = pedidosDinamicos[i];

        const id = pedido.tipopedidos;

        const tiposPedido = getMapa('tipos_pedido', 'id', mapas, data.tipos_pedido);
        const tipoPedido = tiposPedido[id];

        const materiales = getMapa('materiales', 'id', mapas, data.materiales);
        const material = materiales[pedido.materialpedidos];

        const faltapedidos = (pedido.cantidadpedidos - material.stockmateriales) > NO_NECESITA;

        let obj = map[id];

        if (!obj) {
            obj = {
                idtipos_pedido:     id,
                cantidadpedido:     NUMERO_DEFECTO,
                procesadopedidos:   PROCESADO_PEDIDO_NO,
                faltapedidos,
                nombretipos_pedido: tipoPedido.nombretipos_pedido,
                stockmateriales:    material.stockmateriales,
                haciendomateriales: material.haciendomateriales
            };
            ret.push(obj);
        }

        obj.cantidadpedido += pedido.cantidadpedidos;

        if (pedido.procesadopedidos && obj.procesadopedidos === PROCESADO_PEDIDO_NO) {
            obj.procesadopedidos = PROCESADO_PEDIDO;
        } else if (!pedido.procesadopedidos && obj.procesadopedidos === PROCESADO_PEDIDO) {
            obj.procesadopedidos = PROCESADO_PEDIDO_ALGUNO;
        }

        obj.faltapedidos = obj.faltapedidos || faltapedidos;

        map[id] = obj;
    }

    return ret;
};
