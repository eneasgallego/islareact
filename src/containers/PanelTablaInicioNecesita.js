import PanelTablaInicio from './PanelTablaInicio';
import { connect } from 'react-redux';

import {
    ID_INICIO_NECESITA
//    recogerMaterial
} from '../actions/Tabla';

import { getInitialState } from '../reducers/Tabla';

import { parseCols, getClaseFilaMateriales } from '../utils/utils';

import getVistaNecesita from '../datos/VistaNecesita';

import { NO_NECESITA } from '../utils/constantes';

/* Constanst */
const _ID = ID_INICIO_NECESITA;

/* Private functions */
const _getDefaultProps = getInitialState;
const _parseData = data => getVistaNecesita(data,item => item.stockmateriales < item.cantidadpedidos, true).filter(item => item.haciendomateriales > NO_NECESITA);
const _getCols = () => parseCols([{
    texto: 'PROF',
    campo: 'profundidadpedidos'
}, {
    texto: 'MATERIAL',
    campo: 'nombremateriales'
}, {
    texto: 'HACIENDO',
    campo: 'haciendomateriales'
}, {
    texto: 'FABRICA',
    campo: 'nombrefabricas'
}]);
const _getOrden = () => [{
    campo: 'profundidadpedidos',
    desc:  true
},{
    campo: 'haciendomateriales',
    desc:  true
}];
const _getAcciones = () => [{
    texto: 'recoger',
    tag:   'handlerRecogerMaterial'
},{
    texto: 'todo',
    tag:   'accionRecogerTodoMaterial'
}];
const _getClaseFila = getClaseFilaMateriales;

class PanelTablaInicioNecesita extends PanelTablaInicio {
    constructor(props) {
        super(props);

        this.id = ID_INICIO_NECESITA;
        this.getClaseFila = _getClaseFila;
        this.parseData = _parseData;
        this.cols = _getCols();
        this.orden = _getOrden();
        this.acciones = _getAcciones();
        this.titulo = 'Necesita';
    }

    /* Handlers */
    /* handlerRecogerMaterial(material) {
        const { dispatch } = this.props;

        dispatch(recogerMaterial(material.materialpedidos));
    } */
}

const mapStateToProps = state => ({
    ...state.panelTablaInicioNecesita,
    filas: state.app.bd.vistaNecesitaHaciendo || []
});

export default connect(mapStateToProps)(PanelTablaInicioNecesita);
