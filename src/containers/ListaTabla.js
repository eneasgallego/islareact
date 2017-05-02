import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
    cambiarOrdenTabla,
    setOrdenTabla,
    filtrarTabla,
    limpiarFiltroTabla,
    initFiltrosTabla
} from '../actions/Tabla';

import {
    nuevaFila,
    eliminarFila,
    cambiarValorTabla
} from '../actions/BD';

import ListaTabla from '../componentes/tabla/ListaTabla';

import { getPropTypesTabla } from '../utils/utils';

class PanelLista extends Component {
    /* Properties */
    static propTypes = {
        ...getPropTypesTabla(),
        orden: PropTypes.array.isRequired
    }

    /* Lifecycle */
    componentWillMount() {
        const { dispatch, combosDataset } = this.props;

        dispatch(setOrdenTabla(this.id, []));
        dispatch(initFiltrosTabla(this.id, this.cols, combosDataset));

        this.handlerNuevaFila = this.handlerNuevaFila.bind(this);
        this.handlerCambiaOrden = this.handlerCambiaOrden.bind(this);
        this.handlerFiltrado = this.handlerFiltrado.bind(this);
        this.handlerLimpiarFiltro = this.handlerLimpiarFiltro.bind(this);
        this.handlerEliminar = this.handlerEliminar.bind(this);
        this.handlerCambiaEditar = this.handlerCambiaEditar.bind(this);
    }

    /* Handlers */
    handlerNuevaFila() {
        const { dispatch } = this.props;

        dispatch(nuevaFila(this.dataset, this.cols));
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
    handlerEliminar(index) {
        const { dispatch } = this.props;

        dispatch(eliminarFila(this.dataset, index));
    }
    handlerCambiaEditar(valor, campo, index) {
        const { dispatch } = this.props;

        dispatch(cambiarValorTabla(this.dataset, valor, campo, index));
    }

    /* Render */
    render() {
        const {
            filas,
            filtros,
            orden,
            combosDataset
        } = this.props;

        return (
            <ListaTabla
                cols={this.cols}
                filas={filas}
                onClickNuevo={this.handlerNuevaFila}
                eliminar
                onEliminar={this.handlerEliminar}
                filtros={filtros}
                onFiltrado={this.handlerFiltrado}
                onLimpiarFiltro={this.handlerLimpiarFiltro}
                orden={orden}
                campoId="id"
                onCambiaOrden={this.handlerCambiaOrden}
                onCambiaEditar={this.handlerCambiaEditar}
                combosDataset={combosDataset}
            />
        );

    }
}

export default PanelLista;
