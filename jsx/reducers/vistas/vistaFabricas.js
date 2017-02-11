export default {
    key: 'vistaFabricas',
    dependencias: ['materiales','fabricas'],
    fn: (materiales, fabricas) => {
        let ret = [];
        let map = {};

        for (let i = 0 ; i < materiales.length ; i++) {
            let material = materiales[i];

            let fabrica = fabricas.find(fabrica => fabrica.id == material.fabricamateriales);

            let id = material.fabricamateriales;

            let obj = map[id];
            if (!obj) {
                obj = {
                    fabricamateriales: id,
                    nombrefabricas: fabrica.nombrefabricas,
                    maximofabricas: fabrica.maximofabricas,
                    haciendomateriales: 0
                };
                ret.push(obj);
            }

            obj.haciendomateriales += material.haciendomateriales;

            map[id] = obj;
        }

        return ret;
    }
}