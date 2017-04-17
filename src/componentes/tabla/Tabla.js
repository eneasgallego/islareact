import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

import {
    INIT_PROFUNDIDAD, UP_PROFUNDIDAD,
    ORDER_UP, ORDER_DOWN, ORDER_EQUAL,
    INIT_INDEX
} from '../../utils/constantes';

import { renderStyleAlto, emptyFunction } from '../../utils/utils';

import Menu from '../menu/Menu';
import Fila from './Fila';

/* Private functions */
const _getDefaultProps = () => ({
    guardar:         false,
    alto:            undefined,
    cols:            [],
    filas:           [],
    filtros:         [],
    orden:           [],
    velo:            false,
    claseFila:       emptyFunction,
    onClickAcciones: emptyFunction,
    onClickNuevo:    emptyFunction,
    combosDataset:   {},
    onCambiaEditar:  emptyFunction
});
const _getInitialState = () => ({
    altoTabla: undefined,
    altoBody:  undefined,
    anchos:    []
});
const _getDatosHeader = cols => {
    const datos = {};

    for (let i = INIT_INDEX; i < cols.length; i++) {
        datos[cols[i].campo] = cols[i].texto;
    }

    return datos;
};
const _renderMenu = (guardar, accion) => guardar ?
    <Menu
        ref="menu"
        className="menu-tabla"
        menu={[{
            texto: 'NUEVO',
            tag:   'nuevo'
        }]}
        accion={accion}
    /> :
    null;
const _getCalcOrdenar = (campo, datos) => typeof campo === 'function' ?
    campo(datos) :
    parseFloat(datos[campo]);
const _getValorOrdenar = (campo, datos) => isNaN(_getCalcOrdenar(campo, datos)) ?
    datos[campo] :
    _getCalcOrdenar(campo, datos);

const _ordenarFila = (orden, a, b, prof = INIT_PROFUNDIDAD) => orden && orden[prof] ?
        ((valA, valB, desc) => valA === valB ?
                _ordenarFila(orden, a, b, prof + UP_PROFUNDIDAD) :
                (desc && valA < valB) || (!desc && valA > valB) ?
                    ORDER_UP :
                    ORDER_DOWN)(_getValorOrdenar(orden[prof].campo, a), _getValorOrdenar(orden[prof].campo, b), orden[prof].desc) :
    ORDER_EQUAL;

const _filtrar = (filtros, fila) => filtros ?
    filtros.every(filtro => filtro.valor &&
            typeof filtro.valor === 'string' ?
                ~`${fila}`.toUpperCase().indexOf(`${filtro.valor}`.toUpperCase()) :
                !(typeof filtro.valor === 'object' && !filtro.valor.filtrar(fila))) :
    true;
const _renderVelo = () => (
    <div className="velo">
        <div className="velo-fondo" />
        <div className="velo-imagen" />
    </div>
);
const _calcAltoTabla = (alto, domMenu) => {
    let altoTabla = alto;

    if (domMenu) {
        altoTabla -= domMenu.offsetHeight;
    }

    return altoTabla;
};
const _calcAltoBody = (alto, domDiv) => alto - domDiv.querySelector('thead').offsetHeight;

const _calcAlto = function *_calcAlto(alto, dom) {
    yield _calcAltoTabla(alto, dom.querySelector('.menu-tabla'));
    yield _calcAltoBody(alto, dom.querySelector('.tabla-div'));
};

class Tabla extends Component {
    /* Properties */
    static propTypes = {
        guardar:         PropTypes.bool,
        alto:            PropTypes.number,
        cols:            PropTypes.array.isRequired,
        filas:           PropTypes.array.isRequired,
        filtros:         PropTypes.array,
        orden:           PropTypes.array,
        velo:            PropTypes.bool,
        claseFila:       PropTypes.func,
        onClickAcciones: PropTypes.func,
        acciones:        PropTypes.array,
        onClickNuevo:    PropTypes.func,
        combosDataset:   PropTypes.object,
        onCambiaEditar:  PropTypes.func
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerResizeCelda = this.handlerResizeCelda.bind(this);
        this.handlerClickMenu = this.handlerClickMenu.bind(this);
        this.handlerCambiaEditar = this.handlerCambiaEditar.bind(this);

        this.setState(_getInitialState());
    }
    componentWillReceiveProps(nextProps) {
        const { alto } = this.props,
            calcAlto = _calcAlto(nextProps.alto, ReactDOM.findDOMNode(this));

        alto !== nextProps.alto && this.setState({
            altoTabla: calcAlto.next().value,
            altoBody:  calcAlto.next().value
        });
    }

    /* Handlers */
    handlerClickMenu(tag) {
        const { onClickNuevo } = this.props;

        tag === 'nuevo' && onClickNuevo();
    }
    handlerComienzaEditar(campo) {
        console.log(this);
    }
    handlerCambiaEditar(valor, campo, datos) {
        const {
            onCambiaEditar,
            filas
        } = this.props;

        onCambiaEditar && onCambiaEditar(valor, campo, filas.indexOf(datos));
    }
    handlerResizeCelda(offset) {
        const { anchos } = this.state;

        if (!anchos[offset.index] || anchos[offset.index] < offset.width) {
            anchos[offset.index] = offset.width;
            this.setState({anchos: anchos.slice()});
        }
    }

    /* Methods */

    /* Render */
    renderFilas() {
        const {
            filas,
            filtros,
            orden,
            claseFila,
            onClickAcciones,
            cols,
            acciones,
            combosDataset
        } = this.props,
            { anchos } = this.state;

        const filter = filas.filter(_filtrar.bind(null, filtros));
        const sort = filter.sort(_ordenarFila.bind(filter, orden));
        const map = sort.map((fila, index) => (
            <Fila
                key={index}
                claseFila={claseFila}
                datos={fila}
                onClickAcciones={onClickAcciones}
                cols={cols}
                acciones={acciones}
                anchos={anchos}
                onResizeCelda={this.handlerResizeCelda}
                combosDataset={combosDataset}
                onComienzaEditar={this.handlerComienzaEditar}
                onCambiaEditar={this.handlerCambiaEditar}
//                    guardar={this.guardar}
//                    id_campo={this.props.id_campo}
//                    onResize={this.onResizeFila}
//                    onClickCelda={this.onClickCelda}
//                    onChangeValor={this.onChangeValor}
//                    combos_dataset={this.state.combos_dataset}
//                    filtros={false}
        />
        ));

        return map;
    }
    renderTabla() {
        const
            { cols, orden, acciones } = this.props,
            { altoTabla, altoBody, anchos } = this.state;

        return (
            <div
                className="tabla-div"
                style={renderStyleAlto(altoTabla)}
            >
                <table className="tabla">
                    <thead>
                        <Fila
                            header
                            datos={_getDatosHeader(cols)}
                            cols={cols}
                            orden={orden}
                            acciones={acciones}
                            anchos={anchos}
                            onResizeCelda={this.handlerResizeCelda}
//                            filtros={filtros}
    //                    ref={this.refFilas}
    //                    onResize={this.onResizeFila}
    //                    onClickCelda={this.onClickCeldaHeader}
    //                    onChangeDesc={this.ordenar}
    //                    combos_dataset={this.state.combos_dataset}
    //                    onFiltrado={this.onFiltrado}
                        />
                    </thead>
                    <tbody style={renderStyleAlto(altoBody)}>
                    {this.renderFilas()}
                    </tbody>
                </table>
            </div>
        );
    }
    render() {
        const
            { guardar, velo, alto } = this.props;

        return (
            <div className="tabla-cont" style={renderStyleAlto(alto)}>
				{_renderMenu(guardar, this.handlerClickMenu)}
				{this.renderTabla()}
				{velo && _renderVelo()}
            </div>
        );
    }
}

export default Tabla;
