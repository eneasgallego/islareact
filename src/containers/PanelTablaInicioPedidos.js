import PanelTablaInicio from './PanelTablaInicio';
import { connect } from 'react-redux';

import { ID_INICIO_PEDIDOS } from '../actions/Tabla';

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
    tag:   'accionVerPedido'
}, {
    texto: 'procesar',
    tag:   'accionProcesarPedidos'
}, {
    texto: 'cerrar',
    tag:   'accionCerrarPedido'
}];
const _getClaseFila = datos => {
    let clase;

    if (datos.faltapedidos) {
        if (datos.procesadopedidos === PROCESADO_PEDIDO) {
            clase = 'malo';
        } else if (datos.procesadopedidos === PROCESADO_PEDIDO_ALGUNO) {
            clase = 'huerto';
        }
    } else if (datos.procesadopedidos === PROCESADO_PEDIDO) {
        clase = 'bueno';
    } else if (datos.procesadopedidos === PROCESADO_PEDIDO_ALGUNO) {
        clase = 'medio';
    }

    return clase;
};

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
}

const mapStateToProps = state => ({
    ...state.panelTablaInicioPedidos
});

export default connect(mapStateToProps)(PanelTablaInicioPedidos);
