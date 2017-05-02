import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import CheckBox from '../../ui/CheckBox';

/* Private functions */
const _getDefaultProps = () => ({
    seleccionado: false
});
const _renderContenido = contenido => typeof contenido === 'function' ?
        contenido() :
        contenido;

class ListaItemField extends Component {
    /* Properties */
    static propTypes = {
        seleccionado: PropTypes.bool,
        tag:          PropTypes.string.isRequired,
        contenido:    PropTypes.any.isRequired,
        onChange:     PropTypes.func.isRequired
    }
    static defaultProps = _getDefaultProps()

    /* Lifecycle */
    componentWillMount() {
        this.handlerChange = this.handlerChange.bind(this);
    }

    /* Handlers */
    handlerChange(seleccionado) {
        const { onChange, tag } = this.props;

        onChange(seleccionado, tag);
    }

    /* Render */
    render() {
        const {
            seleccionado,
            contenido
        } = this.props;

        return (
            <li>
                <CheckBox
                    ref="checkbox"
                    valor={seleccionado}
                    onChange={this.handlerChange}
                />
                <div className="contenido" >
                    {_renderContenido(contenido)}
                </div>
            </li>
        );
    }
}

export default ListaItemField;
