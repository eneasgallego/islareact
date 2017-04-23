import ListaTabla from './ListaTabla';
import { connect } from 'react-redux';

import { ID_FABRICAS } from '../actions/Tabla';

import { parseCols } from '../utils/utils';

/* Private functions */
const _getCols = () => parseCols([{
    texto: 'FABRICA',
    campo: 'nombrefabricas'
},{
    texto: 'MAXIMO',
    campo: 'maximofabricas',
    tipo:  'int'
}]);

class ListaTablaFabricas extends ListaTabla {
    constructor(props) {
        super(props);

        this.id = ID_FABRICAS;
        this.cols = _getCols();
        this.titulo = 'Fabricas';
        this.dataset = 'fabricas';
    }
}

const mapStateToProps = state => ({
    ...state.listaFabricas,
    filas: state.bd.fabricas
});


export default connect(mapStateToProps)(ListaTablaFabricas);
