import React from 'react';

import PanelFlotante from './panelflotante';
import TextField from './textfield';
import ListaFieldNum from './listafieldnum';
import ListaFieldBool from './listafieldbool';
import ListaFieldObj from './listafieldobj';

import { parseTipo } from './base';
import { ENTER_KEY, ESCAPE_KEY } from '../constantes';

const _onLoadField = field => { field.focus() };

class FiltroTabla extends React.Component {
    componentWillMount() {
        this.onClick = this.onClick.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onClosePanel = this.onClosePanel.bind(this);
        this.onBlurTextField = this.onBlurTextField.bind(this);
        this.onKeyPressText = this.onKeyPressText.bind(this);
        this.onClickField = this.onClickField.bind(this);
        this.onChangeLista = this.onChangeLista.bind(this);
    }
    componentWillReceiveProps(props) {
        this.setState({
            tipo:         parseTipo(props.tipo),
            onClick:      props.onClick,
            onMouseOver:  props.onMouseOver,
            onMouseOut:   props.onMouseOut,
            onClosePanel: props.onClosePanel,
            valor:        props.valor
        });
    }
    onClick(e, panel, panelflotante) {
        if (this.state.onClick) {
            this.state.onClick.call(this, e, panel, panelflotante, this);
        }
    }
    onClosePanel(e, panel, panelflotante) {
        if (this.state.onClosePanel) {
            this.state.onClosePanel.call(this, e, panel, panelflotante, this);
        }
    }
    onMouseOut(e, panel, panelflotante) {
        if (this.state.onMouseOut) {
            this.state.onMouseOut.call(this, e, panel, panelflotante, this);
        }
    }
    onMouseOver(e, panel, panelflotante) {
        if (this.state.onMouseOver) {
            this.state.onMouseOver.call(this, e, panel, panelflotante, this);
        }
    }
    onClickField(e) {
        e.stopPropagation();
        this.onClick.apply(this, arguments);
    }
    onBlurTextField(e, textfield) {
        return this.filtrar(e.currentTarget.value, textfield);
    }
    onKeyPressText(e, textfield) {
        if (e.keyCode === ESCAPE_KEY || e.charCode === ESCAPE_KEY) {
            this.cerrar();
        } else if (e.keyCode === ENTER_KEY || e.charCode === ENTER_KEY) {
            this.filtrar(e.currentTarget.value, textfield);
        }
    }
    onChangeLista(valor, listafieldnum) {
        this.filtrar(valor, listafieldnum);
    }
    cerrar() {
        if (this.state.onClosePanel) {
            this.state.onClosePanel.call(this, this);
        }
    }
    filtrar(valor, field) {
        this.setState({valor}, () => {
            this.cerrar();
            this.props.onFiltrado.call(this, valor, field, this);
        });
    }
    renderContenido() {
        let ret;

        if (this.state.tipo.tipo === 'object') {
            ret = <ListaFieldObj
                valor={this.state.valor || []}
                campo_texto={this.props.filtro.texto}
                campo_valor={this.props.filtro.id}
                lista={this.props.filtro.lista}
                onChange={this.onChangeLista}
                onMouseOver={this.onClick}
            />;
        } else if (this.state.tipo.tipo === 'bool') {
            ret = 	<ListaFieldBool
                valor={this.state.valor || []}
                onChange={this.onChangeLista}
            />;
        } else if (this.state.tipo.tipo === 'int') {
            ret = 	<ListaFieldNum
                        valor={this.state.valor || []}
                        onChange={this.onChangeLista}
                    />;
        } else {
            ret = 	<TextField
                valor={this.state.valor}
                onClick={this.onClickField}
                onBlur={this.onBlurTextField}
                onKeyPress={this.onKeyPressText}
                onLoad={_onLoadField}
            />;
        }

        return ret;
    }
    render() {
        return (
            <PanelFlotante
                contenido={this.renderContenido()}
                onClick={this.onClick}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                onClosePanel={this.onClosePanel}
            />
        );
    }
}
FiltroTabla.defaultProps = {
    tipo:   'string',
    valor:  undefined,
    filtro: {},
    onClick() { /* do nothing */ },
    onClosePanel() { /* do nothing */ },
    onMouseOver() { /* do nothing */ },
    onMouseOut() { /* do nothing */ },
    onFiltrado() { /* do nothing */ }
};

export default FiltroTabla;

