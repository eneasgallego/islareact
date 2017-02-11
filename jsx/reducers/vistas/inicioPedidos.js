export default {
    key: 'inicioPedidos',
    dependencias: ['pedidos_dinamicos', 'tipos_pedido', 'materiales'],
    fn: (pedidos_dinamicos, tipos_pedido, materiales) => {
        let ret = [];
        let map = {};
        let mapas = {};


        for (let i = 0 ; i < pedidos_dinamicos.length ; i++) {
            let pedido = pedidos_dinamicos[i];

            let id = pedido.tipopedidos;

            let tipo_pedido = tipos_pedido.find(tipo=>tipo.id==id);

            let material = materiales.find(material=>material.id==pedido.materialpedidos);

            let faltapedidos = (pedido.cantidadpedidos - material.stockmateriales) > 0;

            let obj = map[id];
            if (!obj) {
                obj = {
                    idtipos_pedido: id,
                    cantidadpedido: 0,
                    procesadopedidos: 0, // 1: Todos, 0: Ninguno, -1: Alguno
                    faltapedidos: faltapedidos,
                    nombretipos_pedido: tipo_pedido.nombretipos_pedido,
                    stockmateriales: material.stockmateriales,
                    haciendomateriales: material.haciendomateriales
                };
                ret.push(obj);
            }

            obj.cantidadpedido += pedido.cantidadpedidos;

            if (pedido.procesadopedidos && obj.procesadopedidos === 0) {
                obj.procesadopedidos = 1;
            } else if (!pedido.procesadopedidos && obj.procesadopedidos === 1) {
                obj.procesadopedidos = -1;
            }

            obj.faltapedidos = (obj.faltapedidos || faltapedidos);

            map[id] = obj;
        }

        return ret;
    }
}