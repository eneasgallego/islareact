import React, { Component } from 'react';

import {
    cambiarOrdenTabla,
    cargarFilasTabla
} from '../actions/Tabla';

import { getInitialState } from '../reducers/Tabla';

import PanelTabla from '../componentes/panel/PanelTabla';
import { getPropTypesTabla } from '../utils/utils';

/* Private functions */
const _getDefaultProps = getInitialState;

class PanelTablaInicio extends Component {
    /* Properties */
    static propTypes = getPropTypesTabla()
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        const { dispatch } = this.props;

        dispatch(cambiarOrdenTabla(this.id, this.orden));
        dispatch(cargarFilasTabla(this.id, 'http://localhost:3000/db', {}, this.parseData));
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
                id={this.id}
                ref={this.id}
                titulo={this.titulo}
                cols={this.cols}
                filas={filas}
                filtros={filtros}
                orden={orden}
                claseFila={this.getClaseFila}
                onClickAcciones={this.handlerClickAcciones}
                alto={alto}
                velo={cargando}
                acciones={this.acciones}
        >
        </PanelTabla>
        );

    }
}

export default PanelTablaInicio;
