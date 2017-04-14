import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { emptyFunction } from '../../utils/utils';
import { ORDER_EQUAL } from '../../utils/constantes';

import Celda from './Celda';
import Menu from '../menu/Menu';

const _SUM_MOSTRAR_ORDEN = 1;

/* Private functions */
const _getDefaultProps = () => ({
    header:          false,
    claseFila:       emptyFunction,
    datos:           {},
    acciones:        [],
    onClickAcciones: emptyFunction,
    cols:            [],
    filtros:         false,
    orden:           []
});
const _claseFila = (header, claseFila, datos) => `${header ?
    'header' :
    ''} ${claseFila ?
        claseFila(datos) :
        ''}`;
const _renderAcciones = (acciones, cols, header, onClickAcciones) => {
    debugger;

    return acciones && acciones.length ?
    [header ?
            <th key={cols.length}></th> :
            <td key={cols.length}>
                <Menu
                    menu={acciones}
                    accion={onClickAcciones}
                />
            </td>] :
        [];
};
const _orden = (orden, campo) => orden ?
    orden.indice('campo', campo) + _SUM_MOSTRAR_ORDEN :
    ORDER_EQUAL;

class Fila extends Component {
    /* Properties */
    static propTypes = {
        header:          PropTypes.bool,
        claseFila:       PropTypes.func,
        datos:           PropTypes.object.isRequired,
        onClickAcciones: PropTypes.func,
        cols:            PropTypes.array.isRequired,
        filtros:         PropTypes.bool,
        orden:           PropTypes.array,
        acciones:        PropTypes.array
    }
    getDefaultProps: _getDefaultProps

    /* Render */
    renderCeldas() {
        const {
            cols,
            header,
            acciones,
            onClickAcciones,
            filtros,
            orden,
            datos
        } = this.props;

        return cols.map((col, index) => (
                <Celda
                    key={index}
                    header={header}
                    tipo={col.tipo}
                    filtro={filtros ?
                        col.filtro :
                        undefined}
                    orden={_orden(orden, col.campo)}
                    datos={datos[col.campo]}
//                    campo={col.campo}
//                    guardar={this.guardar}
//                    onClick={this.props.onClickCelda}
//                    onChangeValor={this.onChangeValor}
//                    onChangeDesc={this.onChangeDesc}
//                    combos_dataset={this.props.combos_dataset}
//                    ancho={this.props.anchos[i]}
//                    orden_desc={this.orden(col.campo) && this.props.orden.desc}
//                    mostrarFiltro={this.mostrarFiltro}
//                    onFiltroFijado={this.onFiltroFijado}
//                    onFiltrado={this.onFiltrado}
//                    onResize={this.onResizeCelda}
            />)
        ).concatenar(_renderAcciones(acciones, cols, header, onClickAcciones));
    }
    render() {
        const {
            header,
            claseFila,
            datos
        } = this.props;

        return (
            <tr className={_claseFila(header, claseFila, datos)} >
				{this.renderCeldas()}
            </tr>
        );
    }
}

export default Fila;
