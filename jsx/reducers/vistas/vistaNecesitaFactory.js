export default (vistaFabricas, vistaMaterialesFalta, pedidos_dinamicos, materiales, calcularProfundidad, sinpedidos) => {
    let ret = [];
    let map = {};
    let mapas = {};

    let calcularPedidos = (material, pedidos)=>{
        if (sinpedidos || pedidos.length) {
            let fabrica = vistaFabricas.find(fabrica => fabrica.fabricamateriales == material.fabricamateriales);
            let material_falta = vistaMaterialesFalta.find(materialFalta => materialFalta.idmateriales == material.id);

            let obj = map[material.id];
            if (!obj) {
                obj = {
                    materialpedidos: material.id,
                    nombremateriales: material.nombremateriales,
                    fabricamateriales: material.fabricamateriales,
                    nombrefabricas: fabrica.nombrefabricas,
                    maximofabricas: fabrica.maximofabricas,
                    haciendofabricas: fabrica.haciendomateriales,
                    stockmateriales: material.stockmateriales,
                    haciendomateriales: material.haciendomateriales,
                    procesadopedidos: 1,
                    faltanecesita: material_falta.dif,
                    cantidadpedidos: 0,
                    faltamateriales: 0,
                    profundidadpedidos: undefined
                };
                ret.push(obj);
                map[material.id] = obj;
            }

            for (let i = 0 ; i < pedidos.length ; i++) {
                let pedido = pedidos[i];

                if (pedido.procesadopedidos) {
                    obj.cantidadpedidos += pedido.cantidadpedidos;

                    if (typeof(obj.profundidadpedidos) === 'undefined' && calcularProfundidad(obj)) {
                        obj.profundidadpedidos = pedido.profundidadpedidos;
                    }
                }
            }
        }
    };

    for (let i = 0 ; i < materiales.length ; i++) {
        let material = materiales[i];
        let pedidos = pedidos_dinamicos.filter(item=>item.materialpedidos==material.id).sort((a,b)=>a.profundidadpedidos==b.profundidadpedidos ? 0 : a.profundidadpedidos>b.profundidadpedidos ? -1 : 1);

        calcularPedidos(material, pedidos);
    }

    for (let i = 0 ; i < ret.length ; i++) {
        let item = ret[i];

        item.faltamateriales = item.cantidadpedidos - item.stockmateriales - item.haciendomateriales;
    }

    return ret;
}