import React from 'react';
import ReactDOM from 'react-dom';

import { FIRST_INDEX } from '../constantes';

class Combo extends React.Component {
    componentWillMount() {
        this.onChange = this.onChange.bind(this);
        this.focus = this.focus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }
    componentDidMount() {
        this.props.onLoad(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            valor: nextProps.valor
        });
    }
    focus() {
        ReactDOM.findDOMNode(this).focus();
    }
    onBlur(e) {
        return this.props.onBlur(e, this);
    }
    onChange(e) {
        this.setState({
            valor: e.currentTarget.value
        });

        return this.props.onChange(e, this);
    }
    getValor() {
        return this.state.valor;
    }
    getValorItem() {
        return this.props.dataset.buscar(this.props.combo.id, this.getValor());
    }
    renderOptions() {
        const ret = [];

        ret.push(
			<option key={-1}></option>
		);
        for (let i = FIRST_INDEX; i < this.props.dataset.length; i++) {
            const item = this.props.dataset[i];

            ret.push(
				<option key={i} value={item[this.props.combo.id]}>{item[this.props.combo.texto]}</option>
			);
        }

        return ret;
    }
    render() {
        return (
			<select
				ref="combo"
				defaultValue={parseInt(this.state.valor, 10)}
				onClick={this.props.onClick}
				onBlur={this.onBlur}
				onChange={this.onChange}
			>
			{this.renderOptions()}
			</select>
        );
    }
}
Combo.defaultProps = {
    valor:   '',
    combo:   {},
    dataset: [],
    onClick() { /* do nothing */ },
    onBlur() { /* do nothing */ },
    onChange() { /* do nothing */ },
    onLoad() { /* do nothing */ }
};

export default Combo;

