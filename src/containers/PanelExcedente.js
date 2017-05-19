import PanelTablaInicio from './PanelTablaInicio';
import { connect } from 'react-redux';

import { ID_EXCEDENTE } from '../actions/Tabla';

import { ganarMaterial, venderMaterial } from '../actions/BD';

import { parseCols } from '../utils/utils';

import { NO_NECESITA } from '../utils/constantes';

import getVistaExcedente from '../datos/VistaExcedente';

/* Private functions */
const _getCols = () => parseCols([{
    texto: 'MATERIAL',
    campo: 'nombremateriales'
}, {
    texto: 'STOCK',
    campo: 'stockmateriales',
    tipo:  'int'
}, {
    texto: 'HACIENDO',
    campo: 'haciendomateriales',
    tipo:  'int'
}, {
    texto: 'PEDIDOS PRO',
    campo: 'cantidadpedidosprocesados',
    tipo:  'int'
}, {
    texto: 'PEDIDOS',
    campo: 'cantidadpedidos',
    tipo:  'int'
}, {
    texto: 'EXCEDENTE PRO',
    campo: 'excedentematerialesprocesados',
    tipo:  'int'
}, {
    texto: 'EXCEDENTE',
    campo: 'excedentemateriales',
    tipo:  'int'
}, {
    texto: 'FABRICA',
    campo: 'fabricamateriales',
    tipo:  {
        tipo:    'object',
        dataset: 'fabricas',
        id:      'id',
        texto:   'nombrefabricas'
    }
}]);
const _getOrden = () => [{
    campo: 'excedentematerialesprocesados',
    desc:  true
},{
    campo: 'excedentemateriales',
    desc:  true
},{
    campo: 'stockmateriales',
    desc:  true
},{
    campo: 'cantidadpedidos',
    desc:  true
},{
    campo: 'cantidadpedidosprocesados',
    desc:  true
},{
    campo: 'nombremateriales',
    desc:  false
}];
const _getAcciones = () => [{
    texto: 'ganar',
    tag:   'handlerGanarMaterial'
},{
    texto: 'vender',
    tag:   'handlerVenderMaterial'
}];
const _claseFilaExcedente = datos => datos.excedentemateriales > NO_NECESITA || datos.excedentematerialesprocesados > NO_NECESITA ?
        'bueno' :
    datos.stockmateriales + datos.haciendomateriales >= datos.cantidadpedidos ?
        'medio' :
        'malo';

class PanelExcedente extends PanelTablaInicio {
    constructor(props) {
        super(props);

        this.id = ID_EXCEDENTE;
        this.getClaseFila = _claseFilaExcedente;
        this.parseData = getVistaExcedente;
        this.cols = _getCols();
        this.orden = _getOrden();
        this.acciones = _getAcciones();
        this.titulo = 'Excedente';
        this.puedeFiltrar = true;
    }

    /* Handlers */
    handlerVenderMaterial(material) {
        const { dispatch } = this.props;

        dispatch(venderMaterial(material.materialpedidos));
    }
    handlerGanarMaterial(material) {
        const { dispatch } = this.props;

        dispatch(ganarMaterial(material.materialpedidos));
    }
}

const mapStateToProps = state => ({
    ...state.panelExcedente,
    filas:         state.bd.vistaExcedente,
    combosDataset: state.bd
});


export default connect(mapStateToProps)(PanelExcedente);
