import vistaNecesitaFactory from './vistaNecesitaFactory.js'

export default {
    key: 'vistaNecesita',
    dependencias: ['vistaFabricas','vistaMaterialesFalta', 'pedidos_dinamicos', 'materiales'],
    fn: (vistaFabricas, vistaMaterialesFalta, pedidos_dinamicos, materiales) => vistaNecesitaFactory(vistaFabricas, vistaMaterialesFalta, pedidos_dinamicos, materiales, item=>item.stockmateriales < item.cantidadpedidos, true)

}