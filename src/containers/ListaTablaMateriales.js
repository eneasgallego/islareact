import ListaTabla from './ListaTabla';
import { connect } from 'react-redux';

import { ID_MATERIALES } from '../actions/Tabla';

import { parseCols } from '../utils/utils';

/* Private functions */
const _getCols = () => parseCols([{
    texto: 'MATERIAL',
    campo: 'nombremateriales'
},{
    texto: 'FABRICA',
    campo: 'fabricamateriales',
    tipo:  {
        tipo:    'object',
        dataset: 'fabricas',
        id:      'id',
        texto:   'nombrefabricas'
    }
},{
    texto: 'HACE',
    campo: 'hacemateriales',
    tipo:  'int'
},{
    texto: 'STOCK',
    campo: 'stockmateriales',
    tipo:  'int'
},{
    texto: 'HACIENDO',
    campo: 'haciendomateriales',
    tipo:  'int'
}]);

class ListaTablaMateriales extends ListaTabla {
    constructor(props) {
        super(props);

        this.id = ID_MATERIALES;
        this.cols = _getCols();
        this.titulo = 'Materiales';
        this.dataset = 'materiales';
    }
}

const mapStateToProps = state => ({
    ...state.listaMateriales,
    filas:         state.bd.materiales,
    combosDataset: state.bd
});


export default connect(mapStateToProps)(ListaTablaMateriales);
