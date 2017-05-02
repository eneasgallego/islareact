import React, { Component } from 'react';

import {
    cambiarOrdenTabla,
    setOrdenTabla,
    filtrarTabla,
    limpiarFiltroTabla,
    initFiltrosTabla
} from '../actions/Tabla';

import PanelTabla from '../componentes/panel/PanelTabla';
import { getPropTypesTabla } from '../utils/utils';

class PanelTablaInicio extends Component {
    /* Properties */
    static propTypes = getPropTypesTabla()

    /* Lifecycle */
    componentWillMount() {
        const { dispatch, combosDataset } = this.props;

        dispatch(setOrdenTabla(this.id, this.orden));
        this.puedeFiltrar && dispatch(initFiltrosTabla(this.id, this.cols, combosDataset));

        this.handlerClickAcciones = this.handlerClickAcciones.bind(this);
        this.handlerCambiaOrden = this.handlerCambiaOrden.bind(this);
        this.handlerFiltrado = this.handlerFiltrado.bind(this);
        this.handlerLimpiarFiltro = this.handlerLimpiarFiltro.bind(this);
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
    handlerFiltrado(valor, campo) {
        const { dispatch } = this.props;

        dispatch(filtrarTabla(this.id, valor, campo));
    }
    handlerLimpiarFiltro(campo) {
        const { dispatch } = this.props;

        dispatch(limpiarFiltroTabla(this.id, campo));
    }

    /* Render */
    render() {
        const {
            filas,
            filtros,
            orden,
            alto,
            cargando,
            titulo,
            combosDataset
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
                puedeFiltrar={!!this.puedeFiltrar}
                onFiltrado={this.handlerFiltrado}
                onLimpiarFiltro={this.handlerLimpiarFiltro}
                combosDataset={combosDataset}
        >
        </PanelTabla>
        );

    }
}

export default PanelTablaInicio;
