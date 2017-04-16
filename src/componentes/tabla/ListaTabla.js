import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { emptyFunction } from '../../utils/utils';

import Tabla from './Tabla';

/* Private functions */
const _getDefaultProps = () => ({
    cols:          [],
    filas:         [],
    onClickNuevo:  emptyFunction,
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
        cols:          PropTypes.array.isRequired,
        filas:         PropTypes.array.isRequired,
        onClickNuevo:  PropTypes.func.isRequired,
        combosDataset: PropTypes.object,
        eliminar:      PropTypes.bool
    }
    getDefaultProps: _getDefaultProps

    /* Render */
    render() {
        const {
            cols,
            filas,
            onClickNuevo,
            combosDataset,
            eliminar
        } = this.props;

        return (
            <Tabla
                ref="tabla"
                cols={cols}
                filas={filas}
                guardar
                onClickAcciones={this.handlerClickAcciones}
                onClickNuevo={onClickNuevo}
                combosDataset={combosDataset}
                acciones={_acciones(eliminar)}
//                id_campo={this.props.id_campo}
//                url={this.props.url}
//                onResizeFila={this.onResizeFila}
            />
        );
    }
}

export default ListaTabla;
