import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import ListaField from './ListaField';

const _INDEX_TODOS = 0;
const _INDEX_NINGUNO = 1;

/* Private functions */
const _getDefaultProps = () => ({
});

class ListaFieldObj extends Component {
    /* Properties */
    static propTypes = {
        lista:      PropTypes.array.isRequired,
        valor:      PropTypes.array,
        campoId:    PropTypes.string.isRequired,
        campoTexto: PropTypes.string.isRequired,
        onChange:   PropTypes.func.isRequired
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerChange = this.handlerChange.bind(this);
    }

    /* Handlers */
    handlerChange(seleccionado, tag) {
        const { onChange } = this.props;

        onChange({ seleccionado, tag });
    }

    /* Render */
    render() {
        const {
            lista,
            valor
        } = this.props;

        return (
            <ListaField
                lista={lista}
                valor={valor || []}
                onChange={this.handlerChange}
//                ref="listafield"
//                onClick={this.onClick}
//                onMouseOver={this.onMouseOver}
            />
        );
    }
}

export default ListaFieldObj;
