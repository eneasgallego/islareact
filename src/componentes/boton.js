import React from 'react';

class Boton extends React.Component {
    render() {
        return (
			<a 	href="#!"
				onClick={this.props.accion}
			>
				{this.props.texto}
			</a>
        );
    }
}
Boton.defaultProps = {
    texto: '',
    accion() { return true }
};

export default Boton;
