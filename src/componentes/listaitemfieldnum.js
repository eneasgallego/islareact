import React from 'react';

import TextField from './textfield';

import { ENTER_KEY } from '../constantes';

class ListaItemFieldNum extends React.Component {
    componentWillMount() {
        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }
    onClick(e, textfield) {
        return this.props.onClick.call(this, e, textfield, this);
    }
    onBlur(e, textfield) {
        this.props.onBlur.call(this, e, textfield, this);
        this.props.onChange.call(this, e.currentTarget.value, this.props.indice, textfield, this);
    }
    onKeyPress(e, textfield) {
        (e.keyCode === ENTER_KEY || e.charCode === ENTER_KEY) && this.props.onChange.call(this, e.currentTarget.value, this.props.indice, textfield, this);
        this.props.onKeyPress.call(this, e, textfield, this);
    }
    render() {
        return (
            <div className="contenido-numerico">
                <span className="texto">{this.props.texto}</span>
                <TextField
                    valor={this.props.valor.valor}
                    onClick={this.onClick}
                    onBlur={this.onBlur}
                    onKeyPress={this.onKeyPress}
                />
            </div>
        );
    }
}
ListaItemFieldNum.defaultProps = {
    indice: undefined,
    tag:    '',
    texto:  '',
    valor:  '',
    onClick() { /* do nothing */ },
    onBlur() { /* do nothing */ },
    onKeyPress() { /* do nothing */ },
    onChange() { /* do nothing */ }
};

export default ListaItemFieldNum;
