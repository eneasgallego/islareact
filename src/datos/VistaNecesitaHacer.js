import getVistaNecesita from './VistaNecesita';

export default data => getVistaNecesita(data, item => item.stockmateriales + item.haciendomateriales < item.cantidadpedidos).filter(item => (item.procesadopedidos && !!~item.maximofabricas) && item.stockmateriales + item.haciendomateriales < item.cantidadpedidos);
