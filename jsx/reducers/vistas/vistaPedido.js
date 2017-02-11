export default {
    key: 'vistaPedido',
    dependencias: ['vistaFabricas','vistaMaterialesFalta', 'pedidos_dinamicos', 'materiales'],
    fn: (vistaFabricas, vistaMaterialesFalta, pedidos_dinamicos, materiales) => {
        let ret = [];
        let map = {};

        for (let i = 0 ; i < pedidos_dinamicos.length ; i++) {
            let pedido = pedidos_dinamicos[i];

            let material = materiales.find(material=>material.id==pedido.materialpedidos);
            let fabrica = vistaFabricas.find(fabrica=>fabrica.fabricamateriales==material.fabricamateriales);
            let material_falta = vistaMaterialesFalta.find(materialFalta=>materialFalta.idmateriales==material.id);

            let id = pedido.id;

            let obj = map[id];
            if (!obj) {
                obj = {
                    idpedidos: id,
                    tipopedidos: pedido.tipopedidos,
                    procesadopedidos: pedido.procesadopedidos,
                    materialpedidos: material.id,
                    nombremateriales: material.nombremateriales,
                    cantidadpedidos: pedido.cantidadpedidos,
                    stockmateriales: material.stockmateriales,
                    haciendomateriales: material.haciendomateriales,
                    maximofabricas: fabrica.maximofabricas,
                    haciendofabricas: fabrica.haciendomateriales,
                    faltanecesita: material_falta.dif
                };
                ret.push(obj);
            }

            map[id] = obj;
        }

        return ret;
    }
}