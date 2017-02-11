export default {
    key: 'inicioPedido',
    dependencias: ['vistaPedido', 'idVerPedido'],
    fn: (vistaPedido, idVerPedido) => {
        return vistaPedido.filter(item => {
            return item.tipopedidos == idVerPedido.idtipos_pedido
        });
    }
}