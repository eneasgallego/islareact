import { getMapa } from './utils';

import { INIT_INDEX } from '../utils/constantes';

export default data => {
    const ret = [];
    const map = {};
    const mapas = {};

    for (let i = INIT_INDEX; i < data.materiales_necesita.length; i++) {
        const materialNecesita = data.materiales_necesita[i];

        const materiales = getMapa('materiales','id',mapas,data.materiales);
        const material = materiales[materialNecesita.materialmateriales_necesita];
        const materialNecesitaNecesita = materiales[materialNecesita.materialnecesitamateriales_necesita];

        const { id } = materialNecesita;

        let obj = map[id];

        if (!obj) {
            obj = {
                idmateriales_necesita:               id,
                materialmateriales_necesita:         materialNecesita.materialmateriales_necesita,
                nombremateriales:                    material.nombremateriales,
                stockmateriales:                     material.stockmateriales,
                haciendomateriales:                  material.haciendomateriales,
                materialnecesitamateriales_necesita: materialNecesita.materialnecesitamateriales_necesita,
                nombrematerialesnecesita:            materialNecesitaNecesita.nombremateriales,
                stockmaterialesnecesita:             materialNecesitaNecesita.stockmateriales,
                haciendomaterialesnecesita:          materialNecesitaNecesita.haciendomateriales,
                cantidadmateriales_necesita:         materialNecesita.cantidadmateriales_necesita
            };
            ret.push(obj);
        }

        map[id] = obj;
    }

    return ret;
};
