import PanelTablaInicio from './PanelTablaInicio';
import { connect } from 'react-redux';

import { ID_INICIO_MATERIALES } from '../actions/Tabla';

import { hacerMaterial } from '../actions/BD';

import { parseCols, getClaseFilaMateriales } from '../utils/utils';

import { ORDER_UP, ORDER_DOWN } from '../utils/constantes';

import getVistaNecesita from '../datos/VistaNecesita';

/* Private functions */
const _parseData = data => getVistaNecesita(data,item => item.stockmateriales + item.haciendomateriales < item.cantidadpedidos).filter(item => (item.procesadopedidos && !!~item.maximofabricas) && item.stockmateriales + item.haciendomateriales < item.cantidadpedidos);
const _getCols = () => parseCols([{
    texto: 'PROF',
    campo: 'profundidadpedidos'
}, {
    texto: 'MATERIAL',
    campo: 'nombremateriales'
}, {
    texto: 'FALTA',
    campo: 'faltamateriales'
}, {
    texto: 'FABRICA',
    campo: 'nombrefabricas'
}]);
const _getOrden = () => [{
    campo(item) {
        return item.stockmateriales < item.cantidadpedidos &&
        item.stockmateriales + item.haciendomateriales < item.cantidadpedidos &&
//            item.maximofabricas !== maximoFabricas &&
        item.haciendofabricas < item.maximofabricas &&
        item.faltanecesita ?
            ORDER_UP :
            ORDER_DOWN;
    },
    desc: true
},{
    campo: 'profundidadpedidos',
    desc:  true
},{
    campo: 'faltamateriales',
    desc:  true
}];
const _getAcciones = () => [{
    texto: 'hacer',
    tag:   'handlerHacerMaterial'
}];

class PanelTablaInicioMateriales extends PanelTablaInicio {
    constructor(props) {
        super(props);

        this.id = ID_INICIO_MATERIALES;
        this.getClaseFila = getClaseFilaMateriales;
        this.parseData = _parseData;
        this.cols = _getCols();
        this.orden = _getOrden();
        this.acciones = _getAcciones();
        this.titulo = 'Materiales';
    }

    /* Handlers */
    handlerHacerMaterial(material) {
        const { dispatch } = this.props;

        dispatch(hacerMaterial(material.materialpedidos));
    }
}

const mapStateToProps = state => ({
    ...state.panelTablaInicioMateriales,
    filas: state.bd.vistaNecesitaHacer
});


export default connect(mapStateToProps)(PanelTablaInicioMateriales);
