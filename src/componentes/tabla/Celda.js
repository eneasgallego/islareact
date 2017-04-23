import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

import { emptyFunction } from '../../utils/utils';

import {
    ESCAPE_KEY, ENTER_KEY
} from '../../utils/constantes';

import FiltroTabla from './filtros/FiltroTabla';

import Combo from '../ui/Combo';
import TextField from '../ui/TextField';

/* Private functions */
const _getDefaultProps = () => ({
    header:           false,
    tipo:             {},
    mostrarFiltro:    false,
    campo:            '',
    datos:            '',
    onResize:         emptyFunction,
    onComienzaEditar: emptyFunction,
    onCambiaEditar:   emptyFunction,
    onMostrarFiltro:  emptyFunction,
    onOcultarFiltro:  emptyFunction
});

const _getValorDataset = (dataset, tipo, datos) => dataset && (dataset.buscar(tipo.id, datos) || {})[tipo.texto];
const _parseValor = (valor, tipo) => {
    let ret = valor;

    if (typeof ret === 'string' && (tipo === 'float' || tipo === 'int' || tipo === 'object')) {
        if (!isNaN(ret)) {
            ret = parseFloat(ret);
            if (tipo !== 'float') {
                ret = ~~ret;
            }
        }
    }

    return ret;
};
const _mostrarFiltros = (mostrarFiltrosOver, mostrarFiltrosOverPanel, mostrarFiltrosClick) => mostrarFiltrosOver || mostrarFiltrosOverPanel || mostrarFiltrosClick;
const _handlerClickFiltro = e => e.stopPropagation();

const _renderStyle = (ancho, tipo) => ({
    width: ancho ?
        `${ancho}px` :
        undefined,
    textAlign: tipo === 'int' || tipo === 'float' ?
        'right' :
        tipo === 'bool' ?
            'center' :
            undefined
});
const _renderClassHeader = filtro => filtro && filtro.valor && ((filtro.valor instanceof Array && filtro.valor.length) || !(filtro.valor instanceof Array)) ?
    'filtrado' :
    '';
const _renderIconoOrden = ordenDesc => `icon icon-triangle ${ordenDesc ?
        'icon-inv' :
        ''}`;
const _renderOrden = (orden, ordenDesc) => orden ?
    <i className={_renderIconoOrden(ordenDesc)}>
        {orden}
    </i> :
    '';

class Celda extends Component {
    /* Properties */
    static propTypes = {
        header:           PropTypes.bool,
        ancho:            PropTypes.number,
        tipo:             PropTypes.object.isRequired,
        filtro:           PropTypes.object,
        orden:            PropTypes.number,
        ordenDesc:        PropTypes.bool,
        comboDataset:     PropTypes.array,
        campo:            PropTypes.string.isRequired,
        mostrarFiltro:    PropTypes.bool,
        datos:            PropTypes.any,
        onResize:         PropTypes.func.isRequired,
        onComienzaEditar: PropTypes.func,
        onCambiaEditar:   PropTypes.func,
        onClick:          PropTypes.func,
        onMostrarFiltro:  PropTypes.func,
        onOcultarFiltro:  PropTypes.func,
        onFiltrado:       PropTypes.func,
        onLimpiarFiltro:  PropTypes.func
    }
    getDefaultProps: _getDefaultProps
    /* Lifecycle */
    componentWillMount() {
        this.setState({
            editar:              false,
            mostrarFiltrosCelda: false
        });

        this.handlerResize = this.handlerResize.bind(this);
        this.handlerClick = this.handlerClick.bind(this);
        this.handlerClickEditar = this.handlerClickEditar.bind(this);
        this.handlerChange = this.handlerChange.bind(this);
        this.handlerKeyPress = this.handlerKeyPress.bind(this);
        this.handlerBlur = this.handlerBlur.bind(this);
        this.handlerContextMenu = this.handlerContextMenu.bind(this);
        this.handlerClosePanel = this.handlerClosePanel.bind(this);
        this.handlerFiltrado = this.handlerFiltrado.bind(this);
        this.handlerLimpiarFiltro = this.handlerLimpiarFiltro.bind(this);
    }
    componentDidMount() {
        window.addEventListener('resize', this.handlerResize);
        this.handlerResize();
    }
    componentWillUpdate(nextProps, nextState) {
        const
            {
                editar
            } = this.state,
            {
                onComienzaEditar,
                campo
            } = this.props;

        onComienzaEditar && nextState.editar && nextState.editar !== editar && onComienzaEditar(campo);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handlerResize);
    }

    /* Handlers */
    handlerResize() {
        const { onResize } = this.props,
            dom = ReactDOM.findDOMNode(this);

        onResize({
            width:  dom.offsetWidth,
            height: dom.offsetHeight,
            top:    dom.offsetTop,
            left:   dom.offsetLeft,
            index:  dom.cellIndex
        });
    }
    handlerClick(e) {
        const { onClick, campo } = this.props;

        e.stopPropagation();

        onClick && onClick(campo);
    }
    handlerClickEditar(e) {
        const { editar } = this.state;

        !editar && this.setState({editar: true});

        this.handlerClick(e);
    }
    handlerChange(valor) {
        const {
            onCambiaEditar,
            campo,
            tipo: {tipo}
        } = this.props;

        onCambiaEditar && onCambiaEditar(_parseValor(valor, tipo), campo);

        this.setState({editar: false});
    }
    handlerKeyPress(valor, key) {
        if (key === ESCAPE_KEY) {
            this.setState({editar: false});
        } else if (key === ENTER_KEY) {
            this.handlerChange(valor);
        }
    }
    handlerBlur() {
        this.setState({editar: false});
    }
    handlerContextMenu(e) {
        const {
            onMostrarFiltro,
            onOcultarFiltro,
            campo,
            filtro,
            mostrarFiltro } = this.props;

        e.preventDefault();

        filtro && (mostrarFiltro ?
            onOcultarFiltro(campo) :
            onMostrarFiltro(campo));
    }
    handlerClosePanel() {
        const { onOcultarFiltro, campo } = this.props;

        onOcultarFiltro(campo);
    }
    handlerFiltrado(valor) {
        const {
            onFiltrado,
            campo
        } = this.props;

        onFiltrado && onFiltrado(valor, campo);
    }
    handlerLimpiarFiltro() {
        const {
            onLimpiarFiltro,
            campo
        } = this.props;

        onLimpiarFiltro && onLimpiarFiltro(campo);
    }

    /* Render */
    renderFiltros() {
        const {
            header,
            filtro,
            mostrarFiltro,
            tipo
        } = this.props;

        return header && filtro && mostrarFiltro ?
            <FiltroTabla
                tipo={filtro.tipo || tipo}
                valor={filtro.valor}
                filtro={filtro}
                onClick={_handlerClickFiltro}
                onClosePanel={this.handlerClosePanel}
                onFiltrado={this.handlerFiltrado}
                onLimpiarFiltro={this.handlerLimpiarFiltro}
            /> :
        null;
    }
    renderCeldaHeader() {
        const {
            ancho,
            tipo,
            filtro,
            orden,
            ordenDesc,
            datos
        } = this.props;

        return (
            <th
                className={_renderClassHeader(filtro)}
                style={_renderStyle(ancho, tipo.tipo)}
                onClick={this.handlerClick}
                onContextMenu={this.handlerContextMenu}
            >
                <div className="tabla-celda-div">
                    {_renderOrden(orden, ordenDesc)}
                    {datos}
                </div>
                { this.renderFiltros() }
            </th>
        );
    }
    renderValor() {
        const {
            tipo,
            comboDataset,
            datos
        } = this.props;

        return tipo.tipo === 'object' ?
            _getValorDataset(comboDataset, tipo, datos) :
        tipo.tipo === 'bool' ?
            datos ?
                'Sí' :
                'No' :
            datos;
    }
    renderEditar() {
        const
            {
                tipo,
                datos,
                comboDataset
            } = this.props,
            { editar } = this.state;

        if (editar) {
            if (tipo.tipo === 'object') {
                return (
                    <Combo
                        valor={datos}
                        combo={tipo}
                        dataset={comboDataset}
                        onChange={this.handlerChange}
                        campoId={tipo.id}
                        campoTexto={tipo.texto}
//                        onClick={this.onClickField}
                        onBlur={this.handlerBlur}
//                        onLoad={this.onLoadField}
                    />
                );
            } else if (tipo.tipo === 'bool') {
                /* return (
                    <CheckBox
                        valor={datos}
                        onClick={this.onClickCheck}
                        onBlur={this.onBlurField}
                        onLoad={this.onLoadField}
                    />
                ); */
            }

            return (
                    <TextField
                        valor={datos}
                        onBlur={this.handlerChange}
                        onKeyPress={this.handlerKeyPress}
//                        onClick={this.onClickField}
                    />
            );

        }

        return null;
    }
    renderCelda() {
        const {
            ancho,
            tipo
        } = this.props;

        return (
            <td
                style={_renderStyle(ancho, tipo.tipo)}
                onClick={this.handlerClickEditar}
            >
                <div className="tabla-celda-div">
                    {this.renderValor()}
                    { this.renderEditar() }
                </div>
            </td>
        );
    }
    render() {
        const { header } = this.props;

        return header ?
            this.renderCeldaHeader() :
            this.renderCelda();
    }
}

export default Celda;
