import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { emptyFunction } from '../../utils/utils';

import Tabla from './Tabla';

/* Private functions */
const _getDefaultProps = () => ({
    cols:           [],
    filas:          [],
    onClickNuevo:   emptyFunction,
    combosDataset:  {},
    eliminar:       false,
    onCambiaEditar: emptyFunction,
    onEliminar:     emptyFunction
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
        cols:           PropTypes.array.isRequired,
        filas:          PropTypes.array.isRequired,
        onClickNuevo:   PropTypes.func.isRequired,
        combosDataset:  PropTypes.object,
        eliminar:       PropTypes.bool,
        onCambiaEditar: PropTypes.func,
        onEliminar:     PropTypes.func
    }
    getDefaultProps: _getDefaultProps

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
            onCambiaEditar
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
//                id_campo={this.props.id_campo}
//                url={this.props.url}
//                onResizeFila={this.onResizeFila}
            />
        );
    }
}

export default ListaTabla;
