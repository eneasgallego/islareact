export default {
    key: 'vistaExcedente',
    dependencias: ['vistaFabricas', 'pedidos_dinamicos', 'materiales'],
    fn: (vistaFabricas, pedidos_dinamicos, materiales) => {
        let ret = [];
        let map = {};

        for (let i = 0 ; i < materiales.length ; i++) {
            let material = materiales[i];

            let id = material.id;

            let fabrica = vistaFabricas.find(fabrica=>fabrica.fabricamateriales==material.fabricamateriales);

            let materialpedidos = pedidos_dinamicos.filter(item => item.materialpedidos == id);
            let materialpedidosprocesados = materialpedidos.filter(item => item.procesadopedidos);
            let cantidadmaterialpedidos = materialpedidos.calcular('cantidadpedidos');
            let cantidadmaterialpedidosprocesados = materialpedidosprocesados.calcular('cantidadpedidos');

            let obj = map[id];
            if (!obj) {
                obj = {
                    materialpedidos: id,
                    nombremateriales: material.nombremateriales,
                    stockmateriales: material.stockmateriales,
                    haciendomateriales: material.haciendomateriales,
                    cantidadpedidos: cantidadmaterialpedidos,
                    cantidadpedidosprocesados: cantidadmaterialpedidosprocesados,
                    excedentemateriales: material.stockmateriales - cantidadmaterialpedidos,
                    excedentematerialesprocesados: material.stockmateriales - cantidadmaterialpedidosprocesados,
                    nombrefabricas: fabrica.nombrefabricas,
                    eshuerto: fabrica.maximofabricas == -1
                };
                ret.push(obj);
            }

            map[id] = obj;
        }

        return ret;
    }
}