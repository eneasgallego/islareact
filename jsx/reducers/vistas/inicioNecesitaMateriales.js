export default {
    key: 'inicioNecesitaMateriales',
    dependencias: ['vistaNecesitaMateriales'],
    fn: (vistaNecesitaMateriales) => {

        let ret = vistaNecesitaMateriales.filter(item => {
            return (item.procesadopedidos && !!~item.maximofabricas) && item.stockmateriales + item.haciendomateriales < item.cantidadpedidos;
        });

        return ret;
    }
}