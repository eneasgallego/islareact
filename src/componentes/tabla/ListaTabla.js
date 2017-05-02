import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import Tabla from './Tabla';

/* Private functions */
const _getDefaultProps = () => ({
    combosDataset: {},
    eliminar:      false
});
const _acciones = eliminar => eliminar ?
[{
    texto: 'Eliminar',
    tag:   'eliminar'
}] :
    null;

class ListaTabla extends Component {
    /* Properties */
    static propTypes = {
        cols:            PropTypes.array.isRequired,
        filas:           PropTypes.array.isRequired,
        onClickNuevo:    PropTypes.func.isRequired,
        orden:           PropTypes.array,
        combosDataset:   PropTypes.object,
        eliminar:        PropTypes.bool,
        onCambiaEditar:  PropTypes.func,
        onEliminar:      PropTypes.func,
        onCambiaOrden:   PropTypes.func,
        onFiltrado:      PropTypes.func,
        onLimpiarFiltro: PropTypes.func,
        filtros:         PropTypes.array
    }
    static defaultProps = _getDefaultProps()

    /* Lifecycle */
    componentWillMount() {
        this.handlerEliminar = this.handlerEliminar.bind(this);
    }

    /* Handlers */
    handlerEliminar(tag, datos) {
        const { onEliminar, filas } = this.props;

        onEliminar && onEliminar(filas.indexOf(datos));
    }

    /* Render */
    render() {
        const {
            cols,
            filas,
            onClickNuevo,
            combosDataset,
            eliminar,
            onCambiaEditar,
            orden,
            onCambiaOrden,
            filtros,
            onFiltrado,
            onLimpiarFiltro
        } = this.props;

        return (
            <Tabla
                ref="tabla"
                cols={cols}
                filas={filas}
                guardar
                onClickAcciones={this.handlerEliminar}
                onClickNuevo={onClickNuevo}
                combosDataset={combosDataset}
                acciones={_acciones(eliminar)}
                onCambiaEditar={onCambiaEditar}
                orden={orden}
                onCambiaOrden={onCambiaOrden}
                puedeFiltrar
                filtros={filtros}
                onFiltrado={onFiltrado}
                onLimpiarFiltro={onLimpiarFiltro}
            />
        );
    }
}

export default ListaTabla;
