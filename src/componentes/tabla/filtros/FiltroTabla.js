import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
    ESCAPE_KEY, ENTER_KEY
} from '../../../utils/constantes';

import PanelFlotante from '../../panel/PanelFlotante';
import TextField from '../../ui/TextField';

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
    }

    /* Handlers */
    handlerKeyPress(valor, key) {
        if (key === ESCAPE_KEY) {
            this.cerrar();
        } else if (key === ENTER_KEY) {
            this.filtrar(valor);
        }
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

        onClosePanel && onClosePanel();
    }

    /* Render */
    renderContenido() {
        const
            {
                valor
//                tipo:{tipo},
//                filtro
            } = this.props;

        return (
            <TextField
                valor={valor || ''}
//                onClick={this.onClickField}
//                onBlur={this.onBlurTextField}
                onKeyPress={this.handlerKeyPress}
//                onLoad={this.onLoadField}
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
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                onClosePanel={this.onClosePanel}
            >
                {this.renderContenido()}
            </PanelFlotante>
        );
    }
}

export default FiltroTabla;
