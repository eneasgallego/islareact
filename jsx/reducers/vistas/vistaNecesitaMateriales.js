import vistaNecesitaFactory from './vistaNecesitaFactory.js'

export default {
    key: 'vistaNecesitaMateriales',
    dependencias: ['vistaFabricas','vistaMaterialesFalta', 'pedidos_dinamicos', 'materiales'],
    fn: (vistaFabricas, vistaMaterialesFalta, pedidos_dinamicos, materiales) => vistaNecesitaFactory(vistaFabricas, vistaMaterialesFalta, pedidos_dinamicos, materiales, item=>item.stockmateriales + item.haciendomateriales < item.cantidadpedidos)
}