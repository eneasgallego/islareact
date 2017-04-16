import PanelTablaInicio from './PanelTablaInicio';
import { connect } from 'react-redux';

import { ID_INICIO_PEDIDOS } from '../actions/Tabla';
import { cambiarVerPedido } from '../actions/App';

import { getInitialState } from '../reducers/Tabla';

import { parseCols } from '../utils/utils';

import getVistaPedidos from '../datos/VistaPedidos';

import { PROCESADO_PEDIDO, PROCESADO_PEDIDO_ALGUNO} from '../utils/constantes';

/* Constanst */
const _ID = ID_INICIO_PEDIDOS;

/* Private functions */
const _getDefaultProps = getInitialState;

const _getCols = () => parseCols([{
    texto: 'PEDIDO',
    campo: 'nombretipos_pedido'
}]);
const _getOrden = () => [{
    campo: 'nombretipos_pedido',
    desc:  false
}];
const _getAcciones = () => [{
    texto: 'ver',
    tag:   'handlerVerPedido'
}, {
    texto: 'procesar',
    tag:   'accionProcesarPedidos'
}, {
    texto: 'cerrar',
    tag:   'accionCerrarPedido'
}];
const _getClaseFila = datos => datos.faltapedidos ?
    datos.procesadopedidos === PROCESADO_PEDIDO ?
        'malo' :
    datos.procesadopedidos === PROCESADO_PEDIDO_ALGUNO && 'huerto' :
    datos.procesadopedidos === PROCESADO_PEDIDO ?
        'bueno' :
    datos.procesadopedidos === PROCESADO_PEDIDO_ALGUNO ?
        'medio' :
        '';

class PanelTablaInicioPedidos extends PanelTablaInicio {
    constructor(props) {
        super(props);

        this.id = ID_INICIO_PEDIDOS;
        this.getClaseFila = _getClaseFila;
        this.parseData = getVistaPedidos;
        this.cols = _getCols();
        this.orden = _getOrden();
        this.acciones = _getAcciones();
        this.titulo = 'Pedidos';
    }

    /* Handlers */
    handlerVerPedido(pedido) {
        const { dispatch } = this.props;

        dispatch(cambiarVerPedido(pedido));
    }
}

const mapStateToProps = state => ({
    ...state.panelTablaInicioPedidos,
    filas: state.app.bd.vistaPedidos || []
});

export default connect(mapStateToProps)(PanelTablaInicioPedidos);
