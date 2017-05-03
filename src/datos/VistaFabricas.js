import { getMapa } from './utils';

import { INIT_INDEX, NUMERO_DEFECTO, RADIX } from '../utils/constantes';

export default data => {
    const ret = [];
    const map = {};
    const mapas = {};

    for (let i = INIT_INDEX; i < data.materiales.length; i++) {
        const material = data.materiales[i];

        const fabricas = getMapa('fabricas','id',mapas,data.fabricas);
        const fabrica = fabricas[material.fabricamateriales];

        const id = material.fabricamateriales;

        let obj = map[id];

        if (!obj) {
            obj = {
                fabricamateriales:  id,
                nombrefabricas:     fabrica.nombrefabricas,
                maximofabricas:     fabrica.maximofabricas,
                haciendomateriales: NUMERO_DEFECTO
            };
            ret.push(obj);
        }

        obj.haciendomateriales += parseInt(material.haciendomateriales, RADIX);

        map[id] = obj;
    }

    return ret;
};
