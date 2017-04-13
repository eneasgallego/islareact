import React, { Component } from 'react';
// import { PropTypes } from 'prop-types';

/*
import {
    limpiarDatasetTipopedidosError,
    } from './actions/app'
*/
import PanelTablaInicioMateriales from './PanelTablaInicioMateriales';

/* Private functions */
const _render = () => <div >{<PanelTablaInicioMateriales ref="materiales" />}</div>;

class PanelTablaInicio extends Component {
    static propTypes = {
    }

    render: _render
}

export default PanelTablaInicio;
