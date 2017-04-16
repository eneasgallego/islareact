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
    orden:           [],
    anchos:          [],
    onResizeCelda:   emptyFunction,
    combosDataset:   {}
});
const _claseFila = (header, claseFila, datos) => `${header ?
    'header' :
    ''} ${claseFila ?
        claseFila(datos) :
        ''}`;
const _renderAcciones = (acciones, cols, header, onClickAcciones) => acciones && acciones.length ?
[header ?
            <th key={cols.length}></th> :
            <td key={cols.length}>
                <Menu
                    menu={acciones}
                    accion={onClickAcciones}
                />
            </td>] :
        [];

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
        acciones:        PropTypes.array,
        anchos:          PropTypes.array.isRequired,
        onResizeCelda:   PropTypes.func.isRequired,
        combosDataset:   PropTypes.object
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerAcciones = this.handlerAcciones.bind(this);
    }

    /* Render */
    renderCeldas() {
        const {
            cols,
            header,
            acciones,
            filtros,
            orden,
            datos,
            anchos,
            onResizeCelda,
            combosDataset
        } = this.props;

        return cols.map((col, index) => {
            const dato = datos[col.campo];

            return (
                <Celda
                    key={index}
                    header={header}
                    tipo={col.tipo}
                    filtro={filtros ?
                        col.filtro :
                        undefined}
                    orden={_orden(orden, col.campo)}
                    datos={dato}
                    ancho={anchos[index]}
                    onResize={onResizeCelda}
                    combosDataset={combosDataset}
//                    campo={col.campo}
//                    guardar={this.guardar}
//                    onClick={this.props.onClickCelda}
//                    onChangeValor={this.onChangeValor}
//                    onChangeDesc={this.onChangeDesc}
//                    combos_dataset={this.props.combos_dataset}
//                    orden_desc={this.orden(col.campo) && this.props.orden.desc}
//                    mostrarFiltro={this.mostrarFiltro}
//                    onFiltroFijado={this.onFiltroFijado}
//                    onFiltrado={this.onFiltrado}
            />
            );
        }).concatenar(_renderAcciones(acciones, cols, header, this.handlerAcciones));

    }

    /* Handlers */
    handlerAcciones(tag) {
        const { onClickAcciones, datos } = this.props;

        onClickAcciones && onClickAcciones(tag, datos);
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
