export default {
    key: 'vistaMaterialesNecesita',
    dependencias: ['materiales_necesita','materiales'],
    fn: (materiales_necesita, materiales) => {
        let ret = [];
        let map = {};
        let mapas = {};

        for (let i = 0 ; i < materiales_necesita.length ; i++) {
            let material_necesita = materiales_necesita[i];

            let material = materiales.find(material=>material.id==material_necesita.materialmateriales_necesita);
            let materialNecesita = materiales.find(material=>material.id==material_necesita.materialnecesitamateriales_necesita);

            let id = material_necesita.id;

            let obj = map[id];
            if (!obj) {
                obj = {
                    idmateriales_necesita: id,
                    materialmateriales_necesita: material_necesita.materialmateriales_necesita,
                    nombremateriales: material.nombremateriales,
                    stockmateriales: material.stockmateriales,
                    haciendomateriales: material.haciendomateriales,
                    materialnecesitamateriales_necesita: material_necesita.materialnecesitamateriales_necesita,
                    nombrematerialesnecesita: materialNecesita.nombremateriales,
                    stockmaterialesnecesita: materialNecesita.stockmateriales,
                    haciendomaterialesnecesita: materialNecesita.haciendomateriales,
                    cantidadmateriales_necesita: material_necesita.cantidadmateriales_necesita
                };
                ret.push(obj);
            }

            map[id] = obj;
        }

        return ret;
    }
}