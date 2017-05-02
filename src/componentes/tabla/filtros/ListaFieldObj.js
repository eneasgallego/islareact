import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import ListaField from './ListaField';

/* Private functions */
const _getDefaultProps = () => ({
});

class ListaFieldObj extends Component {
    /* Properties */
    static propTypes = {
        lista:    PropTypes.array.isRequired,
        valor:    PropTypes.array,
        onChange: PropTypes.func.isRequired
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
            />
        );
    }
}

export default ListaFieldObj;
