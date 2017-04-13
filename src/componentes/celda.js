import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { getMapStateToProps } from './base';

import {
	setOrdenCelda,
	guardarCelda,
	setMostrarFiltrosOverCelda,
	setMostrarFiltrosOverPanelCelda,
	filtrarCelda,
	toggleMostrarFiltrosClickCelda,
	limpiarMostrarFiltrosCelda,
	setEditarCelda
} from '../actions/celda';

import Combo from './combo';
import CheckBox from './checkbox';
import TextField from './textfield';
import FiltroTabla from './filtrotabla';

import {
	ENTER_KEY, ESCAPE_KEY,
	ORDER_EQUAL, ORDER_UP, ORDER_DOWN
} from '../constantes';
const TIME_TO_WAIT = 100;

const _stopPropagation = e => { e.stopPropagation() };
const _handlerLoadField = field => { field.focus() };

class Celda extends React.Component {
    static propTypes = {
        id:                      React.PropTypes.string.isRequired,
        tipo:                    React.PropTypes.object.isRequired,
        guardar:                 React.PropTypes.func,
        orden:                   React.PropTypes.number,
        ordenDesc:               React.PropTypes.bool,
        ordenCelda:              React.PropTypes.number,
        filtro:                  React.PropTypes.object,
        mostrarFiltrosOver:      React.PropTypes.bool,
        mostrarFiltrosOverPanel: React.PropTypes.bool,
        mostrarFiltrosClick:     React.PropTypes.bool,
        onResize:                React.PropTypes.func.isRequired,
        onClick:                 React.PropTypes.func.isRequired,
        onFiltrado:              React.PropTypes.func,
        onFiltroFijado:          React.PropTypes.func
    }
    componentDidMount() {
        window.addEventListener('resize', this.handlerResize);

        this.handlerResize();
    }
    componentWillReceiveProps(nextProps) {
        const { dispatch, id, orden, ordenDesc } = this.props;

        nextProps.orden !== orden && nextProps.ordenDesc !== ordenDesc && dispatch(setOrdenCelda(id, nextProps.orden, nextProps.ordenDesc));
    }
    handlerResize(e) {
        const { onResize } = this.props;
        const dom = ReactDOM.findDOMNode(this);

        onResize({
            width:  dom.offsetWidth,
            height: dom.offsetHeight,
            top:    dom.offsetTop,
            left:   dom.offsetLeft,
            index:  dom.cellIndex
        });
    }
    guardar(valor, field) {
        const { dispatch, id, tipo:{tipo}, guardar } = this.props;
        let _valor = valor;

        if (typeof _valor === 'string' && (tipo === 'float' || tipo === 'int')) {
            if (!isNaN(_valor)) {
                _valor = parseFloat(_valor);
                if (tipo === 'int') {
                    _valor = ~~_valor;
                }
            }
        }

        dispatch(guardarCelda(id, guardar, _valor, field));
    }
    handlerMouseOver() {
        const { dispatch, id } = this.props;

        setTimeout(() => {
            dispatch(setMostrarFiltrosOverCelda(id, true));
        }, TIME_TO_WAIT);
    }
    handlerMouseOut() {
        const { dispatch, id } = this.props;

        setTimeout(() => {
            dispatch(setMostrarFiltrosOverCelda(id, false));
        }, TIME_TO_WAIT);
    }
    handlerMouseOverPanel() {
        const { dispatch, id } = this.props;

        setTimeout(() => {
            dispatch(setMostrarFiltrosOverPanelCelda(id, true));
        }, TIME_TO_WAIT);
    }
    handlerMouseOutPanel(e, panel, panelflotante, filtrotabla) {
        const { dispatch, id } = this.props;

        setTimeout(() => {
            dispatch(setMostrarFiltrosOverPanelCelda(id, false));
        }, TIME_TO_WAIT);
    }
    handlerFiltrado(valor) {
        const { dispatch, id, onFiltrado } = this.props;

        dispatch(filtrarCelda(id, valor, onFiltrado));
    }
    handlerFiltroFijado() {
        const { onFiltroFijado, mostrarFiltrosClick, campo } = this.props;

        onFiltroFijado && onFiltroFijado(mostrarFiltrosClick ?
            campo :
            false);
    }
    handlerClickPanel(e) {
        const { dispatch, id, mostrarFiltrosClick } = this.props;

        e.stopPropagation();
        if (!e.soloMostrar || !mostrarFiltrosClick) {
            dispatch(toggleMostrarFiltrosClickCelda(id));
            this.handlerFiltroFijado();
        }
        if (e.soloMostrar) {
            delete e.soloMostrar;
        }
    }
    handlerClosePanel(e) {
        const { dispatch, id } = this.props;

        dispatch(limpiarMostrarFiltrosCelda(id));
        this.handlerFiltroFijado();
    }
    handlerBlurTextField(e) {
        this.guardar(e.currentTarget.value);
    }
    handlerBlurField(e, field) {
        const { dispatch, id } = this.props;

        dispatch(setEditarCelda(id, false));
    }
    handlerKeyPressText(e) {
        const { dispatch, id } = this.props;

        if (e.keyCode === ESCAPE_KEY || e.charCode === ESCAPE_KEY) {
            dispatch(setEditarCelda(id, false));
        } else if (e.keyCode === ENTER_KEY || e.charCode === ENTER_KEY) {
            this.guardar(e.currentTarget.value);
        }
    }
    handlerChangeCombo(e) {
        this.guardar(e.currentTarget.value);
    }
    handlerClickCheck(valor) {
        this.guardar(valor);
    }
    changeOrden() {
        const { ordenCelda } = this.props;

        this.setState({
            orden: ordenCelda > ORDER_EQUAL ?
                ORDER_DOWN :
                ORDER_UP
        }, () => {
            this.props.onChangeDesc.call(this, ordenCelda, this);
        });
    }
    mostrarFiltros() {
        return this.state.mostrar_filtros_over || this.state.mostrar_filtros_over_panel || this.state.mostrar_filtros_click;
    }
    renderEditar() {
        const {
			editar,
			tipo,
			datos,
			combosDataset,
			campo
		} = this.props;
        let ret = '';

        if (editar) {
            if (tipo.tipo === 'object') {
                ret = (
					<Combo
						valor={datos}
						combo={tipo}
						onClick={_stopPropagation}
						onBlur={this.handlerBlurField}
						onChange={this.handlerChangeCombo}
						onLoad={_handlerLoadField}
						dataset={combosDataset[campo]}
					/>);
            } else if (tipo.tipo === 'bool') {
                ret = (
					<CheckBox
						valor={datos}
						onClick={this.handlerClickCheck}
						onBlur={this.handlerBlurField}
						onLoad={_handlerLoadField}
					/>);
            } else {
                ret = (
					<TextField
						valor={datos}
						onClick={_stopPropagation}
						onBlur={this.handlerBlurTextField}
						onKeyPress={this.handlerKeyPressText}
						onLoad={_handlerLoadField}
					/>);
            }
        }

        return ret;
    }
    renderValor() {
        const {
			datos,
			tipo ,
			combosDataset,
			campo
		} = this.props;

        let ret = datos;

        if (tipo.tipo === 'object') {
            const dataset = combosDataset[campo];

            if (dataset) {
                const item = dataset.buscar(tipo.id, ret);

                if (item) {
                    ret = item[tipo.texto];
                }
            }
        } else if (tipo.tipo === 'bool') {
            ret = ret ?
                'Sí' :
                'No';
        }

        return ret;
    }
    renderStyle() {
        const ret = {};
        const { tipo:{tipo} } = this.props;

        if (this.props.ancho) {
            ret.width = `${this.props.ancho}px`;
        }

        if (tipo === 'int' || tipo === 'float') {
            ret.textAlign = 'right';
        } else if (tipo === 'bool') {
            ret.textAlign = 'center';
        }

        return ret;
    }
    renderCelda() {
        const { onClick } = this.props;

        return (
			<td
				style={this.renderStyle()}
				onClick={onClick}
			>
				<div className="tabla-celda-div">
					{this.renderValor()}
					{this.renderEditar()}
				</div>
			</td>);
    }
    renderIconoOrden() {
        let ret = '';
        const { ordenCelda } = this.props;

        if (this.props.orden) {
            if (ordenCelda > ORDER_EQUAL) {
                ret = 'icon icon-triangle';
            } else if (ordenCelda < ORDER_EQUAL) {
                ret = 'icon icon-triangle icon-inv';
            }
        }

        return ret;
    }
    renderFiltros() {
        const { filtro, mostrarFiltro, campo, combosDataset } = this.props;

        if (filtro && mostrarFiltro(campo) && this.mostrarFiltros()) {
            return (
				<FiltroTabla
					tipo={filtro.tipo}
					valor={filtro.valor}
					filtro={{...filtro, lista: combosDataset[campo]}}
					onClick={this.handlerClickPanel}
					onClosePanel={this.handlerClosePanel}
					onMouseOver={this.handlerMouseOverPanel}
					onMouseOut={this.handlerMouseOutPanel}
					onFiltrado={this.handlerFiltrado}
				/>);
        }

        return null;
    }
    renderTitle() {
        let ret = '';
        const { filtro } = this.props;

        if (filtro && filtro.valor) {
            if (typeof filtro.valor === 'string') {
                ret = filtro.valor;
            } else if (typeof filtro.valor === 'object') {
                if (filtro.tipo === 'int') {
                    ret = filtro.valor.getTitulo();
                }
            }
        }

        return ret;
    }
    renderClassHeader() {
        let ret = '';
        const { filtro } = this.props;

        if (filtro && filtro.valor && ((filtro.valor instanceof Array && filtro.valor.length) || !(filtro.valor instanceof Array))) {
            ret = 'filtrado';
        }

        return ret;
    }
    renderCeldaHeader() {
        const { onClick } = this.props;

        return (
			<th 	style={this.renderStyle()}
				onMouseOver={this.handlerMouseOver}
				onMouseOut={this.handlerMouseOut}
				onClick={onClick}
				title={this.renderTitle()}
				className={this.renderClassHeader()}
			>
				<div 	className="tabla-celda-div">
					<i 	className={this.renderIconoOrden()}>
						{this.props.orden}
					</i>
					{this.props.datos}
				</div>
				{this.renderFiltros()}
			</th>);
    }
    render() {
        return this.props.header ?
                this.renderCeldaHeader() :
                this.renderCelda();
    }
}

export default connect(getMapStateToProps('celda'))(Celda);
