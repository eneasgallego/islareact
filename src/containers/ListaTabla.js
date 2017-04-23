import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
    cambiarOrdenTabla,
    setOrdenTabla,
    filtrarTabla,
    limpiarFiltroTabla,
    initFiltrosTabla
} from '../actions/Tabla';

import { nuevaFila, eliminarFila } from '../actions/BD';

import { getInitialState } from '../reducers/Tabla';

import ListaTabla from '../componentes/tabla/ListaTabla';
import { getPropTypesTabla } from '../utils/utils';

/* Private functions */
const _getDefaultProps = () => ({
    ...getInitialState(),
    filas: []
});

class PanelLista extends Component {
    /* Properties */
    static propTypes = {
        ...getPropTypesTabla(),
        orden: PropTypes.array.isRequired
    }
    getDefaultProps: _getDefaultProps

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
    }
    componentWillReceiveProps(nextProps) {
        const { dispatch, combosDataset } = this.props;

        combosDataset !== nextProps.combosDataset && dispatch(initFiltrosTabla(this.id, this.cols, nextProps.combosDataset));
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

    /* Render */
    render() {
        const {
            filas,
            filtros,
            orden
//            alto,
//            cargando,
//            titulo,
//            combosDataset
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
//                id_campo={this.props.config[this.state.contenido].id_campo}
//                url_editar={this.props.config[this.state.contenido].url_editar}
//                url_crear={this.props.config[this.state.contenido].url_crear}
//                url={this.props.config[this.state.contenido].url}
//                eliminar={this.props.config[this.state.contenido].eliminar}
//                key={this.state.contenido}
//                ref={this.state.contenido}
//                setDialogo={this.setDialogo}
            />
        );

    }
}

export default PanelLista;
