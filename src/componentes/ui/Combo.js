import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { emptyFunction } from '../../utils/utils';

import { INIT_INDEX } from '../../utils/constantes';

/* Private functions */
const _getDefaultProps = () => ({
    onChange:   emptyFunction,
    dataset:    [],
    campoId:    '',
    campoTexto: ''
});

class Combo extends Component {
    /* Properties */
    static propTypes = {
        valor:      PropTypes.any,
        onChange:   PropTypes.func.isRequired,
        dataset:    PropTypes.array.isRequired,
        campoId:    PropTypes.string.isRequired,
        campoTexto: PropTypes.string.isRequired
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerChange = this.handlerChange.bind(this);
    }

    /* Handlers */
    handlerChange(e) {
        const { onChange } = this.props;

        e.preventDefault();

        onChange && onChange(e.currentTarget.value);
    }

    /* Render */
    renderOptions() {
        const ret = [],
            {
                dataset,
                campoId,
                campoTexto
            } = this.props;

        ret.push(
            <option key={-1}></option>
        );
        for (let i = INIT_INDEX; i < dataset.length; i++) {
            const item = dataset[i];

            ret.push(
                <option key={i} value={item[campoId]}>{item[campoTexto]}</option>
            );
        }

        return ret;
    }
    render() {
        const { valor } = this.props;

        return (
            <select
                ref="combo"
                defaultValue={valor}
                onClick={this.onClick}
                onBlur={this.onBlur}
                onChange={this.handlerChange}
            >
			{this.renderOptions()}
            </select>
        );
    }
}

export default Combo;
