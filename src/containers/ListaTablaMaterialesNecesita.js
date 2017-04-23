import ListaTabla from './ListaTabla';
import { connect } from 'react-redux';

import { ID_MATERIALES_NECESITA } from '../actions/Tabla';

import { parseCols } from '../utils/utils';

/* Private functions */
const _getCols = () => parseCols([{
    texto: 'MATERIAL',
    campo: 'materialmateriales_necesita',
    tipo:  {
        tipo:    'object',
        dataset: 'materiales',
        id:      'id',
        texto:   'nombremateriales'
    }
},{
    texto: 'NECESITA',
    campo: 'materialnecesitamateriales_necesita',
    tipo:  {
        tipo:    'object',
        dataset: 'materiales',
        id:      'id',
        texto:   'nombremateriales'
    }
},{
    texto: 'CANTIDAD',
    campo: 'cantidadmateriales_necesita',
    tipo:  'int'
}]);

class ListaTablaMaterialesNecesita extends ListaTabla {
    constructor(props) {
        super(props);

        this.id = ID_MATERIALES_NECESITA;
        this.cols = _getCols();
        this.titulo = 'Materiales Necesita';
        this.dataset = 'materiales_necesita';
    }
}

const mapStateToProps = state => ({
    ...state.listaMaterialesNecesita,
    filas:         state.bd.materiales_necesita,
    combosDataset: state.bd
});


export default connect(mapStateToProps)(ListaTablaMaterialesNecesita);
