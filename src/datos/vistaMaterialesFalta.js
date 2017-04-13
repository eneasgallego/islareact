import { calcularTotales } from './utils';
import getVistaMaterialesNecesita from './vistaMaterialesNecesita';

import { NO_NECESITA, FIRST_INDEX } from '../constantes';

export default data => {
    const ret = [];
    const map = {};

    const vistaMaterialesNecesita = getVistaMaterialesNecesita(data);

    for (let i = FIRST_INDEX; i < data.materiales.length; i++) {
        const material = data.materiales[i];

        const { id } = material;

        const materialesNecesita = vistaMaterialesNecesita.filter(item => item.materialmateriales_necesita === id);

        let obj = map[id];

        if (!obj) {
            obj = {
                idmateriales:     id,
                nombremateriales: material.nombremateriales,
                dif:              false
            };
            ret.push(obj);
        }

        const totales = calcularTotales({
            dif: {
                tipo(a, b) {
                    if (typeof a === 'undefined') {
                        return b;
                    } else if (a && b) {
                        return true;
                    }

                    return false;
                },
                lista: materialesNecesita,
                valor(item) {
                    return item.cantidadmateriales_necesita - item.stockmaterialesnecesita <= NO_NECESITA;
                },
                defecto: true
            }
        });

        for (const key in totales) {
            if (typeof totales[key] !== 'undefined') {
                obj[key] = totales[key];
            }
        }

        map[id] = obj;
    }

    return ret;
};
