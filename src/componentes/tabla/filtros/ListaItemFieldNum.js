import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { ENTER_KEY } from '../../../utils/constantes';

import TextField from '../../ui/TextField';

/* Private functions */
const _getDefaultProps = () => ({
    texto: '',
    valor: {}
});

class ListaItemFieldNum extends Component {
    /* Properties */
    static propTypes = {
        texto:    PropTypes.string.isRequired,
        valor:    PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerKeyPress = this.handlerKeyPress.bind(this);
    }

    /* Handlers */
    handlerKeyPress(valor, key) {
        const { onChange, tag } = this.props;

        if (key === ENTER_KEY) {
            onChange(valor, tag);
        }
    }

    /* Render */
    render() {
        const { texto, valor } = this.props;

        return (
            <div className="contenido-numerico">
                <span className="texto">{texto}</span>
                <TextField
                    valor={typeof valor.valor === 'undefined' ?
                        '' :
                        valor.valor}
                    onKeyPress={this.handlerKeyPress}
//                    onClick={this.onClick}
//                    onBlur={this.onBlur}
                />
            </div>
        );
    }
}

export default ListaItemFieldNum;
