import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { emptyFunction } from '../../utils/utils';

/* Private functions */
const _getDefaultProps = () => ({
    onKeyPress: emptyFunction,
    disabled:   false
});

class TextField extends Component {
    /* Properties */
    static propTypes = {
        valor:      PropTypes.any.isRequired,
        onBlur:     PropTypes.func,
        onKeyPress: PropTypes.func,
        disabled:   PropTypes.bool
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerFocus = this.handlerFocus.bind(this);
        this.handlerBlur = this.handlerBlur.bind(this);
        this.handlerKeyPress = this.handlerKeyPress.bind(this);
    }
    componentDidMount() {
        this.refs.input.focus();
    }
    componentWillReceiveProps(nextProps) {
        const { valor } = this.props;

        if (valor !== nextProps.valor) {
            this.refs.input.value = nextProps.valor;
        }
    }

    /* Handlers */
    handlerFocus() {
        this.refs.input.select();
    }
    handlerBlur(e) {
        const { onBlur } = this.props;

        e.preventDefault();

        onBlur && onBlur(e.currentTarget.value);
    }
    handlerKeyPress(e) {
        const { onKeyPress } = this.props;

        onKeyPress(e.currentTarget.value, typeof e.which === 'number' ?
                e.which :
                e.keyCode);
    }

    /* Render */
    render() {
        const { valor, disabled } = this.props;

        return (
            <input
                ref="input"
                defaultValue={valor}
                onFocus={this.handlerFocus}
                onBlur={this.handlerBlur}
                onKeyDown={this.handlerKeyPress}
                disabled={disabled}
//                onChange={this.handlerChange}
//                onClick={this.onClick}
            />
        );
    }
}

export default TextField;
