import calcularTotales from './calcularTotales.js'

export default {
    key: 'vistaMaterialesFalta',
    dependencias: ['vistaMaterialesNecesita','materiales'],
    fn: (vistaMaterialesNecesita, materiales) => {
        let ret = [];
        let map = {};

        for (let i = 0 ; i < materiales.length ; i++) {
            let material = materiales[i];

            let id = material.id;

            let materiales_necesita = vistaMaterialesNecesita.filter(item => {
                return item.materialmateriales_necesita == id;
            });

            let obj = map[id];
            if (!obj) {
                obj = {
                    idmateriales: id,
                    nombremateriales: material.nombremateriales,
                    dif: false
                };
                ret.push(obj);
            }

            let totales = calcularTotales({
                dif: {
                    tipo(a, b) {
                        let ret = false;

                        if (typeof(a) === 'undefined') {
                            ret = b;
                        } else if (a && b) {
                            ret = true;
                        }

                        return ret;
                    },
                    lista: materiales_necesita,
                    valor(item) {
                        return (item.cantidadmateriales_necesita - item.stockmaterialesnecesita) <= 0;
                    },
                    defecto: true
                }
            });
            for (let key in totales) {
                if (typeof(totales[key]) !== 'undefined') {
                    obj[key] = totales[key];
                }
            }

            map[id] = obj;
        }

        return ret;
    }
}