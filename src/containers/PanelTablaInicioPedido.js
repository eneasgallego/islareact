import PanelTablaInicio from './PanelTablaInicio';
import { connect } from 'react-redux';

import { ID_INICIO_PEDIDO } from '../actions/Tabla';

import { getInitialState } from '../reducers/Tabla';

import { parseCols } from '../utils/utils';

import getVistaPedido from '../datos/VistaPedido';

// import { PROCESADO_PEDIDO, PROCESADO_PEDIDO_ALGUNO} from '../utils/constantes';

/* Private functions */
const _getDefaultProps = getInitialState;

const _getCols = () => parseCols([{
    texto: 'MATERIAL',
    campo: 'nombremateriales'
}, {
    texto: 'NECESITA',
    campo: 'cantidadpedidos',
    tipo:  'float'
}, {
    texto: 'TIENE',
    campo: 'stockmateriales',
    tipo:  'float'
}, {
    texto: 'HACIENDO',
    campo: 'haciendomateriales',
    tipo:  'float'
}]);
const _getOrden = () => [{
    campo: 'nombremateriales',
    desc:  false
}];
const _getAcciones = () => [{
    texto: 'hacer',
    tag:   'accionHacerMaterial'
}, {
    texto: 'recoger',
    tag:   'accionRecogerMaterial'
}, {
    texto: 'procesar',
    tag:   'accionProcesarPedido'
}];
const _getClaseFilaDeeper = datos => datos.faltanecesita ?
        'malo' :
        'nulo';
const _getClaseFilaInner = datos => datos.stockmateriales >= datos.cantidadpedidos ?
        'bueno' :
        datos.stockmateriales + datos.haciendomateriales >= datos.cantidadpedidos ?
            'medio' :
        datos.haciendofabricas < datos.maximofabricas ?
            _getClaseFilaDeeper(datos) :
            '';
const _getClaseFila = datos => datos.procesadopedidos ?
        _getClaseFilaInner(datos) :
        'huerto';
const _parseData = (data, params) => getVistaPedido(data).filter(item => item.tipopedidos === params.idTiposPedido);

class PanelTablaInicioPedido extends PanelTablaInicio {
    constructor(props) {
        super(props);

        this.id = ID_INICIO_PEDIDO;
        this.getClaseFila = _getClaseFila;
        this.parseData = _parseData;
        this.cols = _getCols();
        this.orden = _getOrden();
        this.acciones = _getAcciones();
        this.titulo = 'Pedido';
    }
}

const mapStateToProps = state => ({
    ...state.panelTablaInicioPedido
});

export default connect(mapStateToProps)(PanelTablaInicioPedido);
