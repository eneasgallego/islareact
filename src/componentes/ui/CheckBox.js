import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { emptyFunction } from '../../utils/utils';

/* Private functions */
const _getDefaultProps = () => ({
    valor:    false,
    onChange: emptyFunction
});

class CheckBox extends Component {
    /* Properties */
    static propTypes = {
        valor:    PropTypes.bool,
        onChange: PropTypes.func.isRequired
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerChange = this.handlerChange.bind(this);
    }

    /* Handlers */
    handlerChange(e) {
        const { onChange } = this.props;

        onChange(e.currentTarget.checked);
    }

    /* Render */
    render() {
        const { valor } = this.props;

        return (
            <input
//                ref="checkbox"
                type="checkbox"
                checked={valor}
                onChange={this.handlerChange}
//                onClick={this.onClick}
//                onBlur={this.onBlur}
            />
        );
    }
}

export default CheckBox;
