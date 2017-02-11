export default {
    key: 'pedidos_dinamicos',
    dependencias: ['materiales','pedidos', 'materiales_necesita'],
    fn: (materiales, pedidos, materialesNecesita) => {
        let ret = [];
        let mapas = {};

        let cantidadMaterialPedidos = id_material=>{
            let num = 0;

            for (let i = 0 ; i < ret.length ; i++) {
                let pedido = ret[i];

                if (pedido.procesadopedidos && pedido.materialpedidos == id_material) {
                    num += pedido.cantidadpedidos;
                }
            }

            return num;
        };

        let generarId= ()=>{
            let num = 1;
            while (	ret.buscar('id',num) ||
            pedidos.buscar('id',num)) {
                num++;
            };

            return num;
        };

        let hacerMaterialNecesita = (material_padre, profundidad, cantidad)=>{
            let materiales_necesita = materialesNecesita.filter(material_necesita=>material_necesita.materialmateriales_necesita==material_padre.id);
            if (materiales_necesita.length) {
                let stock = material_padre.stockmateriales;
                let haciendo = material_padre.haciendomateriales;
                let cantidad_pedido = cantidadMaterialPedidos(material_padre.id);
                let necesita = cantidad + cantidad_pedido - stock - haciendo;

                if (necesita > 0) {
                    let pedido_necesita = necesita;
                    if (pedido_necesita > cantidad) {
                        pedido_necesita = cantidad;
                    }
                    for (let i = 0 ; i < materiales_necesita.length ; i++) {
                        let material_necesita = materiales_necesita[i];

                        let material = materiales.find(material=>material.id==material_necesita.materialnecesitamateriales_necesita);
                        let pedido = ret.buscar(pedido=>pedido.tipopedidos==6 && pedido.materialpedidos==material.id);
                        let insertar = false;
                        if (!pedido) {
                            pedido = {
                                tipopedidos: 6,
                                materialpedidos: material.id,
                                procesadopedidos: true,
                                cantidadpedidos: 0,
                                profundidadpedidos: profundidad,
                                id: generarId()
                            };
                            insertar = true;
                        }
                        if (pedido.profundidadpedidos < profundidad) {
                            pedido.profundidadpedidos = profundidad;
                        }

                        let cantidad_hace = Math.ceil(pedido_necesita / material_padre.hacemateriales);
                        let cantidad_necesita = cantidad_hace * material_necesita.cantidadmateriales_necesita;
                        //let pedido_cantidadpedidos = cantidad_necesita - pedido.cantidadpedidos;
                        hacerMaterialNecesita(material, profundidad + 1, cantidad_necesita);
                        pedido.cantidadpedidos += cantidad_necesita;
                        insertar && ret.push(pedido);
                    }
                }
            }
        };

        for (let i = 0 ; i < pedidos.length ; i++) {
            let pedido = pedidos[i];

            if (pedido.procesadopedidos) {
                let material = materiales.find(material=>material.id==pedido.materialpedidos);

                hacerMaterialNecesita(material, pedido.profundidadpedidos + 1, pedido.cantidadpedidos);
            }
            ret.push(pedido);
        }

        return ret;
    }
}