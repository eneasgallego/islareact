import React, { Component } from 'react';

import { cambiarOrdenTabla, setOrdenTabla } from '../actions/Tabla';

import { getInitialState } from '../reducers/Tabla';

import PanelTabla from '../componentes/panel/PanelTabla';
import { getPropTypesTabla } from '../utils/utils';

/* Private functions */
const _getDefaultProps = () => ({
    ...getInitialState(),
    filas: []
});

class PanelTablaInicio extends Component {
    /* Properties */
    static propTypes = getPropTypesTabla()
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        const { dispatch } = this.props;

        dispatch(setOrdenTabla(this.id, this.orden));

        this.handlerClickAcciones = this.handlerClickAcciones.bind(this);
        this.handlerCambiaOrden = this.handlerCambiaOrden.bind(this);
    }

    /* Handlers */
    handlerClickAcciones(tag, ...args) {

        typeof this[tag] === 'function' ?
            this[tag].apply(this, args) :
            console.warn(`There is no action for ${tag}`);
    }
    handlerCambiaOrden(campo) {
        const { dispatch } = this.props;

        dispatch(cambiarOrdenTabla(this.id, campo));
    }

    /* Render */
    render() {
        const {
            filas,
            filtros,
            orden,
            alto,
            cargando,
            titulo
        } = this.props;

        return (
            <PanelTabla
                id={this.id}
                ref={this.id}
                titulo={titulo || this.titulo}
                cols={this.cols}
                filas={filas}
                filtros={filtros}
                orden={orden}
                claseFila={this.getClaseFila}
                onClickAcciones={this.handlerClickAcciones}
                alto={alto}
                velo={cargando}
                acciones={this.acciones}
                onCambiaOrden={this.handlerCambiaOrden}
        >
        </PanelTabla>
        );

    }
}

export default PanelTablaInicio;
