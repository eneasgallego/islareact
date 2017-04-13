import React from 'react';
import ReactDOM from 'react-dom';

class TextField extends React.Component {
    componentWillMount() {
        this.focus = this.focus.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount() {
        this.props.onLoad.call(this, this);
    }
    componentWillReceiveProps(props) {
        this.setState({
            valor: props.valor
        });
    }
    focus() {
        ReactDOM.findDOMNode(this).focus();
    }
    onFocus() {
        ReactDOM.findDOMNode(this).select();
    }
    onClick(e) {
        return this.props.onClick.call(this, e, this);
    }
    onBlur(e) {
        return this.props.onBlur.call(this, e, this);
    }
    onKeyPress(e) {
        return this.props.onKeyPress.call(this, e, this);
    }
    onChange(e) {
        this.setState({
            valor: e.currentTarget.value
        });

        return this.props.onChange.call(this, e.currentTarget.value, this);
    }
    getValor() {
        return this.state.valor;
    }
    render() {
        return (
			<input
				defaultValue={this.state.valor}
				onClick={this.onClick}
				onBlur={this.onBlur}
				onKeyDown={this.onKeyPress}
				onFocus={this.onFocus}
				onChange={this.onChange}
			/>
        );
    }
}
TextField.defaultProps = {
    valor: '',
    onClick() { /* do nothing */ },
    onBlur() { /* do nothing */ },
    onKeyPress() { /* do nothing */ },
    onLoad() { /* do nothing */ },
    onChange() { /* do nothing */ }
};

export default TextField;

