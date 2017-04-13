import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

/*
import {
    limpiarDatasetTipopedidosError,
    } from './actions/app'
*/
import PanelTablaInicioMateriales from './PanelTablaInicioMateriales';


class PanelTablaInicio extends Component {
    static propTypes = {
        // From Redux
        config:          PropTypes.array.isRequired,
        configPedido:    PropTypes.object.isRequired,
        pedidoVer:       PropTypes.object,
        // From parent
        onClickAcciones: PropTypes.func.isRequired,
        alto:            React.PropTypes.number
    }

    render() {
        const { alto } = this.props;

        return (
            <div>
                <PanelTablaInicioMateriales
                    ref="materiales"
                    key="materiales"
                    alto={alto}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state.panelTablaInicio,
    config:       state.app.config.inicio,
    configPedido: state.app.config.inicio_pedido,
    pedidoVer:    state.app.pedidoVer
});

export default connect(mapStateToProps)(PanelTablaInicio);
