import React from 'react';
import ReactDOM from 'react-dom';

class CheckBox extends React.Component {
    componentWillMount() {
        this.focus = this.focus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getSeleccionado = this.getSeleccionado.bind(this);
        this.setSeleccionado = this.setSeleccionado.bind(this);
        this.toggleSeleccionado = this.toggleSeleccionado.bind(this);
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
    onBlur(e) {
        this.props.onBlur.call(this, this.getSeleccionado(), this);
    }
    onChange(e) {
        this.props.onChange.call(this, this.getSeleccionado(), this);
    }
    onClick(e) {
        e.stopPropagation();
        this.props.onClick.call(this, this.getSeleccionado(), this);
    }
    getSeleccionado() {
        return this.refs.checkbox.checked;
    }
    setSeleccionado(seleccionado) {
        if (this.refs.checkbox.checked !== seleccionado) {
            this.refs.checkbox.checked = seleccionado;
            this.props.onChange.call(this, seleccionado, this);
        }
    }
    toggleSeleccionado() {
        this.setSeleccionado(!this.getSeleccionado());
    }
    render() {
        return (
			<input
				ref="checkbox"
				type="checkbox"
				defaultChecked={this.state.valor}
				onClick={this.onClick}
				onBlur={this.onBlur}
				onChange={this.onChange}
			/>
        );
    }
}
CheckBox.defaultProps = {
    valor: false,
    onClick() { /* DO NOTHING */ },
    onBlur() { /* DO NOTHING */ },
    onLoad() { /* DO NOTHING */ },
    onChange() { /* DO NOTHING */ }
};

export default CheckBox;

