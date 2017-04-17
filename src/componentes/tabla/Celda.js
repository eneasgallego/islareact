import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

import { emptyFunction } from '../../utils/utils';

import {
    ORDER_EQUAL,
    ESCAPE_KEY, ENTER_KEY
} from '../../utils/constantes';

import Combo from '../ui/Combo';
import TextField from '../ui/TextField';

/* Private functions */
const _getDefaultProps = () => ({
    header:           false,
    tipo:             {},
    mostrarFiltro:    emptyFunction,
    comboDataset:     [],
    campo:            '',
    datos:            '',
    onResize:         emptyFunction,
    onComienzaEditar: emptyFunction,
    onCambiaEditar:   emptyFunction
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
const _renderTitle = filtro => filtro && filtro.valor ?
    typeof filtro.valor === 'string' ?
        filtro.valor :
    typeof filtro.valor === 'object' && filtro.tipo === 'int' && filtro.valor.getTitulo() :
        '';
const _renderIconoOrden = orden => typeof orden === 'undefined' ?
    '' :
    `icon icon-triangle ${orden < ORDER_EQUAL ?
        'icon-inv' :
        ''}`;

class Celda extends Component {
    /* Properties */
    static propTypes = {
        header:           PropTypes.bool,
        ancho:            PropTypes.number,
        tipo:             PropTypes.object.isRequired,
        filtro:           PropTypes.object,
        orden:            PropTypes.number,
        comboDataset:     PropTypes.array,
        campo:            PropTypes.string.isRequired,
//        mostrarFiltro: PropTypes.func.isRequired,
        datos:            PropTypes.any,
        onResize:         PropTypes.func.isRequired,
        onComienzaEditar: PropTypes.func,
        onCambiaEditar:   PropTypes.func
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.setState({editar: false});

        this.handlerResize = this.handlerResize.bind(this);
        this.handlerClick = this.handlerClick.bind(this);
        this.handlerChange = this.handlerChange.bind(this);
        this.handlerKeyPress = this.handlerKeyPress.bind(this);
        this.handlerBlur = this.handlerBlur.bind(this);
    }
    componentDidMount() {
        window.addEventListener('resize', this.handlerResize);
        this.handlerResize();
    }
    componentWillUpdate(nextProps, nextState) {
        const
            { editar } = this.state,
            { onComienzaEditar, campo } = this.props;

        onComienzaEditar && nextState.editar && nextState.editar !== editar && onComienzaEditar(campo);
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
        const
            { editar } = this.state;

        e.stopPropagation();

        !editar && this.setState({editar: true});
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

    /* Render */
    renderFiltros() {
//        const {
//            filtro,
//            mostrarFiltro
//            combosDataset,
//            campo
//        } = this.props;

        return this;
//        filtro && mostrarFiltro(this) && this.mostrarFiltros() ?
//            <FiltroTabla
//                tipo={filtro.tipo}
//                valor={filtro.valor}
//                filtro={{
//                    ...filtro,
//                    lista: combosDataset[campo]
//                }}
//                    onClick={this.onClickPanel}
//                    onClosePanel={this.onClosePanel}
//                    onMouseOver={this.onMouseOverPanel}
//                    onMouseOut={this.onMouseOutPanel}
//                    onFiltrado={this.onFiltrado}
//            /> :
//        null;
    }
    renderCeldaHeader() {
        const {
            ancho,
            tipo,
            filtro,
            orden,
            datos
        } = this.props;

        return (
            <th
                className={_renderClassHeader(filtro)}
                style={_renderStyle(ancho, tipo.tipo)}
                title={_renderTitle(filtro)}
//                onMouseOver={this.onMouseOver}
//                onMouseOut={this.onMouseOut}
//                onClick={this.accionCelda}
            >
                <div className="tabla-celda-div">
                    <i className={_renderIconoOrden(orden)}>
                        {orden}
                    </i>
                    {datos}
                </div>
                {/* this.renderFiltros() */}
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
                onClick={this.handlerClick}
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
