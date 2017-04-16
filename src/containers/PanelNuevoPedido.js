import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import { cambiarTipoNuevoPedido } from '../actions/PanelNuevoPedido';

import Panel from '../componentes/panel/Panel';

import Combo from '../componentes/ui/Combo';
import Boton from '../componentes/ui/Boton';

/* Private functions */
const _getDefaultProps = () => ({
    datasetTipoPedidos: [],
    nuevoPedido:        {}
});
const _getIdTipoPedido = nuevoPedido => nuevoPedido && nuevoPedido.tipoPedido && nuevoPedido.tipoPedido.idTipoPedido;

class PanelNuevoPedido extends Component {
    /* Properties */
    static propTypes = {
        datasetTipoPedidos: PropTypes.array.isRequired,
        nuevoPedido:        PropTypes.object.isRequired
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerChangeCombo = this.handlerChangeCombo.bind(this);
    }

    /* Handlers */
    handlerChangeCombo(valor) {
        const { dispatch, datasetTipoPedidos } = this.props;

        dispatch(cambiarTipoNuevoPedido(datasetTipoPedidos.buscar('id', parseInt(valor, 10))));
    }

    /* Render */
    renderContenidoNuevoPedido() {
        const {
            datasetTipoPedidos,
            nuevoPedido
        } = this.props;

        return datasetTipoPedidos.length ?
        [
            <Combo
                key="tipopedido"
                ref="tipopedido"
                titulo="Tipo"
                valor={_getIdTipoPedido(nuevoPedido)}
                onChange={this.handlerChangeCombo}
                campoId="id"
                campoTexto="nombretipos_pedido"
                dataset={datasetTipoPedidos}
                onLoad={this.dimensionar}
            />,
            <Boton
                key="aceptar"
                texto="ACEPTAR"
                accion={this.crearNuevoPedido}
            />/* ,
            <ListaTabla
                    id_campo={this.props.config.nuevo_pedido.tabla.id_campo}
                    url={this.props.config.nuevo_pedido.tabla.url}
                    cols={this.props.config.nuevo_pedido.tabla.cols}
                    eliminar={this.props.config.nuevo_pedido.tabla.eliminar}
                    key="tabla_nuevo_pedido"
                    ref="tabla_nuevo_pedido"
                    setDialogo={this.setDialogo}
                    onResizeFila={this.onResizeFilaNuevoPedido}
                    onLoad={this.dimensionar}
                    persistir={false}
                /> */
        ] :
            null;
    }
    render() {
        return (
            <Panel
                ref="panel_nuevo_pedido"
                className="panel_nuevo_pedido"
//                dimensionar={this.dimensionarNuevoPedido}
            >
                {this.renderContenidoNuevoPedido()}
            </Panel>
        );
    }
}

const mapStateToProps = state => ({
    ...state.panelNuevoPedido,
    datasetTipoPedidos: state.bd.tipos_pedido
});

export default connect(mapStateToProps)(PanelNuevoPedido);
