import ListaTabla from './ListaTabla';
import { connect } from 'react-redux';

import { ID_TIPOS_PEDIDO } from '../actions/Tabla';

import { parseCols } from '../utils/utils';

/* Private functions */
const _getCols = () => parseCols([{
    texto: 'TIPO',
    campo: 'nombretipos_pedido'
},{
    texto: 'PROFUNDIDAD',
    campo: 'profundidadtipos_pedido',
    tipo:  'int'
},{
    texto: 'NO VACIA',
    campo: 'novacia_pedido',
    tipo:  'bool'
}]);

class ListaTablaTiposPedido extends ListaTabla {
    constructor(props) {
        super(props);

        this.id = ID_TIPOS_PEDIDO;
        this.cols = _getCols();
        this.titulo = 'Tipos Pedido';
        this.dataset = 'tipos_pedido';
    }
}

const mapStateToProps = state => ({
    ...state.listaTiposPedido,
    filas: state.bd.tipos_pedido
});


export default connect(mapStateToProps)(ListaTablaTiposPedido);
