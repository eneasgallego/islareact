import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

import { emptyFunction } from '../../utils/utils';

import { ORDER_EQUAL } from '../../utils/constantes';

/* Private functions */
const _getDefaultProps = () => ({
    header:        false,
    tipo:          {},
    mostrarFiltro: emptyFunction,
    combosDataset: {},
    campo:         '',
    datos:         '',
    onResize:      emptyFunction
});
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
        header:   PropTypes.bool,
        ancho:    PropTypes.number,
        tipo:     PropTypes.object.isRequired,
        filtro:   PropTypes.object,
        orden:    PropTypes.number,
//        mostrarFiltro: PropTypes.func.isRequired,
//        combosDataset: PropTypes.object.isRequired,
//        campo:  PropTypes.string.isRequired,
        datos:    PropTypes.any.isRequired,
        onResize: PropTypes.func.isRequired
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentDidMount() {
        window.addEventListener('resize', this.handlerResize);
        this.handlerResize();
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
            combosDataset,
            campo,
            datos
        } = this.props;

        return tipo.tipo === 'object' ?
            combosDataset[campo].buscar(tipo.id, datos)[tipo.texto] :
        tipo.tipo === 'bool' ?
            datos ?
                'Sí' :
                'No' :
            datos;
    }
    renderCelda() {
        const {
            ancho,
            tipo
        } = this.props;

        return (
            <td
                style={_renderStyle(ancho, tipo.tipo)}
                onClick={this.accionCelda}
            >
                <div className="tabla-celda-div">
                    {this.renderValor()}
                    {/* this.renderEditar() */}
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
