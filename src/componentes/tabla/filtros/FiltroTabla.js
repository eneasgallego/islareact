import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
    ESCAPE_KEY, ENTER_KEY
} from '../../../utils/constantes';

import PanelFlotante from '../../panel/PanelFlotante';
import TextField from '../../ui/TextField';
import ListaFieldNum from './ListaFieldNum';
import ListaField from './ListaField';

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
        this.handlerChangeListaNum = this.handlerChangeListaNum.bind(this);
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
    handlerChangeListaNum(valor) {
        this.filtrar(valor);
    }
    handlerChangeLista(seleccionado, tag) {
        this.filtrar({seleccionado, tag});
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
                    onChange={this.handlerChangeListaNum}
                />
            );
        } else if (tipo === 'object' || tipo === 'bool') {
            return (
                <ListaField
                    lista={filtro.lista}
                    valor={valor || []}
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
    }
    render() {
        const { onClick } = this.props;

        return (
            <PanelFlotante onClick={onClick} >
                {this.renderContenido()}
            </PanelFlotante>
        );
    }
}

export default FiltroTabla;
