import ListaTabla from './ListaTabla';
import { connect } from 'react-redux';

import { ID_PEDIDOS } from '../actions/Tabla';

import { parseCols } from '../utils/utils';

/* Private functions */
const _getCols = () => parseCols([{
    texto: 'TIPO',
    campo: 'tipopedidos',
    tipo:  {
        tipo:    'object',
        dataset: 'tipos_pedido',
        id:      'id',
        texto:   'nombretipos_pedido'
    }
},{
    texto: 'MATERIAL',
    campo: 'materialpedidos',
    tipo:  {
        tipo:    'object',
        dataset: 'materiales',
        id:      'id',
        texto:   'nombremateriales'
    }
},{
    texto: 'CANTIDAD',
    campo: 'cantidadpedidos',
    tipo:  'int'
},{
    texto: 'PROCESADO',
    campo: 'procesadopedidos',
    tipo:  'bool'
},{
    texto: 'PROFUNDIDAD',
    campo: 'profundidadpedidos',
    tipo:  'int'
},{
    texto: 'NO VACIA',
    campo: 'novacia_pedido',
    tipo:  'bool'
}]);

class ListaTablaPedidos extends ListaTabla {
    constructor(props) {
        super(props);

        this.id = ID_PEDIDOS;
        this.cols = _getCols();
        this.titulo = 'Pedidos';
        this.dataset = 'pedidos';
    }
}

const mapStateToProps = state => ({
    ...state.listaPedidos,
    filas:         state.bd.pedidos,
    combosDataset: state.bd
});


export default connect(mapStateToProps)(ListaTablaPedidos);
