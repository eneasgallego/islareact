import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

/* Private functions */
const _getDefaultProps = () => ({
    valor: false
});

class CheckBox extends Component {
    /* Properties */
    static propTypes = {
        valor:    PropTypes.bool,
        onChange: PropTypes.func.isRequired
    }
    static defaultProps = _getDefaultProps()

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
                type="checkbox"
                checked={valor}
                onChange={this.handlerChange}
            />
        );
    }
}

export default CheckBox;
