import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
    INIT_INDEX,
    ORDER_EQUAL, ORDER_UP, ORDER_DOWN
} from '../../utils/constantes';

class Combo extends Component {
    /* Properties */
    static propTypes = {
        valor:      PropTypes.any,
        onChange:   PropTypes.func.isRequired,
        dataset:    PropTypes.array.isRequired,
        campoId:    PropTypes.string.isRequired,
        campoTexto: PropTypes.string.isRequired,
        onBlur:     PropTypes.func
    }

    /* Lifecycle */
    componentWillMount() {
        this.handlerChange = this.handlerChange.bind(this);
        this.handlerBlur = this.handlerBlur.bind(this);
    }
    componentDidMount() {
        this.refs.combo.focus();
    }

    /* Handlers */
    handlerChange(e) {
        const { onChange } = this.props;

        e.preventDefault();

        onChange && onChange(e.currentTarget.value);
    }
    handlerBlur(e) {
        const { onBlur } = this.props;

        e.preventDefault();

        onBlur && onBlur(e.currentTarget.value);
    }

    /* Render */
    renderOptions() {
        const ret = [],
            {
                dataset,
                campoId,
                campoTexto
            } = this.props,
            datasetOrdenado = dataset.sort((a, b) => a[campoTexto] === b[campoTexto] ?
        ORDER_EQUAL :
        a[campoTexto] > b[campoTexto] ?
        ORDER_UP :
        ORDER_DOWN);

        ret.push(
            <option key={-1}></option>
        );
        for (let i = INIT_INDEX; i < datasetOrdenado.length; i++) {
            const item = datasetOrdenado[i];

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
                onBlur={this.handlerBlur}
                onChange={this.handlerChange}
            >
                {this.renderOptions()}
            </select>
        );
    }
}

export default Combo;
