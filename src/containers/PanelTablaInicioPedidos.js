import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import {
    ID_INICIO_PEDIDOS,
    cambiarOrdenTabla,
    cargarFilasTabla
} from '../actions/Tabla';

import PanelTabla from '../componentes/panel/PanelTabla';
import { parseCols } from '../utils/utils';

import getVistaPedidos from '../datos/VistaPedidos';

import { PROCESADO_PEDIDO, PROCESADO_PEDIDO_ALGUNO} from '../utils/constantes';

/* Constanst */
const _ID = ID_INICIO_PEDIDOS;

/* Private functions */
const _getDefaultProps = () => ({
    filas:    [],
    filtros:  [],
    orden:    [],
    cargando: false
});

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

class PanelTablaInicioPedidos extends Component {
    /* Properties */
    static propTypes = {
        filas:    PropTypes.array.isRequired,
        filtros:  PropTypes.array.isRequired,
        orden:    PropTypes.array.isRequired,
        alto:     PropTypes.number,
        cargando: PropTypes.bool
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        const { dispatch } = this.props;

        dispatch(cambiarOrdenTabla(_ID, _getOrden()));
        dispatch(cargarFilasTabla(_ID, 'http://localhost:3000/db', {}, getVistaPedidos));
    }

    /* Handlers */
    handlerClickAcciones(tag) {
        if (typeof this[tag] === 'function') {
            this[tag].apply(this, arguments);
        }
    }

    /* Render */
    render() {
        const {
            filas,
            filtros,
            orden,
            alto,
            cargando
        } = this.props;

        return (
            <PanelTabla
                id={_ID}
                ref={_ID}
                titulo="Pedidos"
                cols={_getCols()}
                filas={filas}
                filtros={filtros}
                orden={orden}
                claseFila={_getClaseFila}
                onClickAcciones={this.handlerClickAcciones}
                alto={alto}
                velo={cargando}
                acciones={_getAcciones()}
//                idCampo="materialpedidos"
            >
            </PanelTabla>
        );

    }
}

const mapStateToProps = state => ({
    ...state.panelTablaInicioPedidos
});

export default connect(mapStateToProps)(PanelTablaInicioPedidos);
