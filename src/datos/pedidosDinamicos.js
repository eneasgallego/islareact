import { getMapa } from './utils';

import { NO_NECESITA, UP_PROFUNDIDAD, FIRST_INDEX, NUMERO_DEFECTO, INIT_ID } from '../constantes';

const TIPO_OTROS = 6;

export default data => {
    const ret = [];
    const mapas = {};

    const cantidadMaterialPedidos = idMaterial => {
        let num = NUMERO_DEFECTO;

        for (let i = FIRST_INDEX; i < ret.length; i++) {
            const _pedido = ret[i];

            if (_pedido.procesadopedidos && _pedido.materialpedidos === idMaterial) {
                num += _pedido.cantidadpedidos;
            }
        }

        return num;
    };

    const generarId = () => {
        let num = INIT_ID;

        while (ret.buscar('id',num) || data.pedidos.buscar('id',num)) {
            num++;
        }

        return num;
    };

    const materiales = getMapa('materiales','id',mapas,data.materiales);
    const hacerMaterialNecesita = (materialPadre, profundidad, cantidad) => {
        const materialesNecesita = data.materialesNecesita.filter(materialNecesita => materialNecesita.materialmateriales_necesita === materialPadre.id);

        if (materialesNecesita.length) {
            const stock = materialPadre.stockmateriales;
            const haciendo = materialPadre.haciendomateriales;
            const cantidadPedido = cantidadMaterialPedidos(materialPadre.id);
            const necesita = cantidad + cantidadPedido - stock - haciendo;

            if (necesita > NO_NECESITA) {
                let pedidoNecesita = necesita;

                if (pedidoNecesita > cantidad) {
                    pedidoNecesita = cantidad;
                }
                for (let i = FIRST_INDEX; i < materialesNecesita.length; i++) {
                    const materialNecesita = materialesNecesita[i];

                    const material = materiales[materialNecesita.materialnecesitamateriales_necesita];
                    let pedido = ret.buscar(_pedido => _pedido.tipopedidos === NO_NECESITA && _pedido.materialpedidos === material.id);
                    let insertar = false;

                    if (!pedido) {
                        pedido = {
                            tipopedidos:        TIPO_OTROS,
                            materialpedidos:    material.id,
                            procesadopedidos:   true,
                            cantidadpedidos:    NO_NECESITA,
                            profundidadpedidos: profundidad,
                            id:                 generarId()
                        };
                        insertar = true;
                    }
                    if (pedido.profundidadpedidos < profundidad) {
                        pedido.profundidadpedidos = profundidad;
                    }

                    const cantidadHace = Math.ceil(pedidoNecesita / materialPadre.hacemateriales);
                    const cantidadNecesita = cantidadHace * materialNecesita.cantidadmateriales_necesita;

                    hacerMaterialNecesita(material, profundidad + UP_PROFUNDIDAD, cantidadNecesita);
                    pedido.cantidadpedidos += cantidadNecesita;
                    insertar && ret.push(pedido);
                }
            }
        }
    };

    for (let i = FIRST_INDEX; i < data.pedidos.length; i++) {
        const pedido = data.pedidos[i];

        if (pedido.procesadopedidos) {
            const material = materiales[pedido.materialpedidos];

            hacerMaterialNecesita(material, pedido.profundidadpedidos + UP_PROFUNDIDAD, pedido.cantidadpedidos);
        }
        ret.push(pedido);
    }

    return ret;
};
