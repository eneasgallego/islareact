import { getMapa } from './utils';

import { FIRST_INDEX, NUMERO_DEFECTO } from '../constantes';

export default data => {
    const ret = [];
    const map = {};
    const mapas = {};

    for (let i = FIRST_INDEX; i < data.materiales.length; i++) {
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

        obj.haciendomateriales += material.haciendomateriales;

        map[id] = obj;
    }

    return ret;
};
