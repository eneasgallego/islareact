import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

import {
    INIT_PROFUNDIDAD, UP_PROFUNDIDAD,
    ORDER_UP, ORDER_DOWN,
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
    onClickAcciones: emptyFunction
});
const _getInitialState = () => ({
    altoTabla: undefined,
    altoBody:  undefined
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

const _ordenarFila = (orden, a, b, prof = INIT_PROFUNDIDAD) => ((valA, valB, desc) => ((valA === valB) && _ordenarFila(orden, a, b, prof + UP_PROFUNDIDAD)) ||
    (desc && valA < valB) ||
    (!desc && valA > valB) ?
        ORDER_UP :
        ORDER_DOWN)(_getValorOrdenar(orden[prof].campo, a), _getValorOrdenar(orden[prof].campo, b), orden[prof].desc);

const _filtrar = (filtros, fila) => filtros.every(filtro => filtro.valor &&
            typeof filtro.valor === 'string' ?
                ~`${fila}`.toUpperCase().indexOf(`${filtro.valor}`.toUpperCase()) :
                !(typeof filtro.valor === 'object' && !filtro.valor.filtrar(fila)));
const _renderVelo = () => (
    <div className="velo">
        <div className="velo-fondo" />
        <div className="velo-imagen" />
    </div>
);
const _calcAltoTabla = dom => {
    let altoTabla = dom.offsetHeight;
    const domMenu = dom.querySelector('.menu-tabla');

    if (domMenu) {
        altoTabla -= domMenu.offsetHeight;
    }

    return altoTabla;
};
const _calcAltoBody = (dom, domDiv) => ({alto_body: domDiv.offsetHeight - domDiv.querySelector('thead').offsetHeight});

const _calcAlto = function *_calcAlto(dom) {
    yield _calcAltoTabla(dom);
    yield _calcAltoBody(dom, dom.querySelector('.tabla-div'));
};

const _handlerAccionMenu = () => { /**/ };

class Tabla extends Component {
    /* Properties */
    static propTypes = {
        guardar:         PropTypes.bool,
        alto:            PropTypes.number,
        cols:            PropTypes.array.isRequired,
        filas:           PropTypes.array.isRequired,
        filtros:         PropTypes.array.isRequired,
        orden:           PropTypes.array.isRequired,
        velo:            PropTypes.bool,
        claseFila:       PropTypes.func.isRequired,
        onClickAcciones: PropTypes.func.isRequired,
        acciones:        PropTypes.array
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.setState(_getInitialState());
    }
    componentWillReceiveProps(nextProps) {
        const { alto } = this.props,
            calcAlto = _calcAlto(ReactDOM.findDOMNode(this));

        alto !== nextProps.alto && this.setState({
            altoTabla: calcAlto.next().value,
            altoBody:  calcAlto.next().value
        });
    }

    /* Methods */
    dimensionar(alto) {
        this.setState({alto}/* , this.calcAltoTabla */);
    }

    /* Render */
    renderFilas() {
        const {
            filas,
            filtros,
            orden,
            claseFila,
            onClickAcciones,
            cols,
            acciones
        } = this.props;

        return filas.filter(_filtrar.bind(null, filtros))
            .sort((a, b) => _ordenarFila.bind(null, orden))
            .map((fila, index) => (
                <Fila
                    key={index}
                    claseFila={claseFila}
                    datos={fila}
                    onClickAcciones={onClickAcciones}
                    cols={cols}
                    acciones={acciones}
//                    guardar={this.guardar}
//                    id_campo={this.props.id_campo}
//                    onResize={this.onResizeFila}
//                    onResizeCelda={this.onResizeCelda}
//                    onClickCelda={this.onClickCelda}
//                    onChangeValor={this.onChangeValor}
//                    combos_dataset={this.state.combos_dataset}
//                    anchos={this.state.anchos}
//                    filtros={false}
                />
            ));
    }
    renderTabla() {
        const
            { cols, orden, acciones } = this.props,
            { altoTabla, altoBody } = this.state;

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
//                            filtros={filtros}
    //                    ref={this.refFilas}
    //                    onResize={this.onResizeFila}
    //                    onResizeCelda={this.onResizeCelda}
    //                    onClickCelda={this.onClickCeldaHeader}
    //                    onChangeDesc={this.ordenar}
    //                    combos_dataset={this.state.combos_dataset}
    //                    anchos={this.state.anchos}
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
				{_renderMenu(guardar, _handlerAccionMenu)}
				{this.renderTabla()}
				{velo && _renderVelo()}
            </div>
        );
    }
}

export default Tabla;
