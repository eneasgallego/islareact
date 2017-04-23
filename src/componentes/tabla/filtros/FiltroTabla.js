import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
    ESCAPE_KEY, ENTER_KEY
} from '../../../utils/constantes';

import PanelFlotante from '../../panel/PanelFlotante';
import TextField from '../../ui/TextField';
import ListaFieldNum from './ListaFieldNum';
import ListaFieldObj from './ListaFieldObj';

/* Private functions */
const _getDefaultProps = () => ({
});

class FiltroTabla extends Component {
    /* Properties */
    static propTypes = {
        onClick:         PropTypes.func,
        onClosePanel:    PropTypes.func,
        onFiltrado:      PropTypes.func,
        onLimpiarFiltro: PropTypes.func,
        valor:           PropTypes.any
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerKeyPress = this.handlerKeyPress.bind(this);
        this.handlerChangeLista = this.handlerChangeLista.bind(this);
    }

    /* Handlers */
    handlerKeyPress(valor, key) {
        if (key === ESCAPE_KEY) {
            this.cerrar();
        } else if (key === ENTER_KEY) {
            this.filtrar(valor);
        }
    }
    handlerChangeLista(valor) {
        this.filtrar(valor);
    }

    /* Methods */
    filtrar(valor) {
        const { onFiltrado, onLimpiarFiltro } = this.props;

        valor ?
            onFiltrado && onFiltrado(valor) :
            onLimpiarFiltro && onLimpiarFiltro();
    }
    cerrar() {
        const { onClosePanel } = this.props;

        return onClosePanel && onClosePanel();
    }

    /* Render */
    renderContenido() {
        const
            {
                valor,
                tipo:{tipo},
                filtro
            } = this.props;

        if (tipo === 'int') {
            return (
                <ListaFieldNum
                    valor={valor}
                    lista={filtro.lista}
                    onChange={this.handlerChangeLista}
                />
            );
        } else if (tipo === 'object') {
            return (
                <ListaFieldObj
                    lista={filtro.lista}
                    valor={valor}
                    campoTexto={filtro.texto}
                    campoId={filtro.id}
                    onChange={this.handlerChangeLista}
                />
            );
        }

        return (
            <TextField
                valor={valor || ''}
                onKeyPress={this.handlerKeyPress}
            />
        );

/*
        if (tipo === 'object') {
            return (
                <ListaFieldObj
                    valor={valor || []}
                    campo_texto={filtro.texto}
                    campo_valor={filtro.id}
                    lista={filtro.lista}
                    onChange={this.onChangeLista}
                    onMouseOver={this.onClick}
                />
            );
        } else if (tipo === 'bool') {
            return (
                <ListaFieldBool
                    valor={valor || []}
                    onChange={this.onChangeLista}
                />
            );
        } else if (tipo === 'int') {
            return (
                <ListaFieldNum
                    valor={valor || []}
                    onChange={this.onChangeLista}
                />
            );
        } else {
            return (
                <TextField
                    valor={valor}
                    onClick={this.onClickField}
                    onBlur={this.onBlurTextField}
                    onKeyPress={this.onKeyPressText}
                    onLoad={this.onLoadField}
                />
            );
        }
        */
    }
    render() {
        const { onClick } = this.props;

        return (
            <PanelFlotante
                onClick={onClick}
                onClosePanel={this.onClosePanel}
            >
                {this.renderContenido()}
            </PanelFlotante>
        );
    }
}

export default FiltroTabla;
