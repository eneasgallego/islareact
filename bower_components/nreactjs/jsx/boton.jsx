window.Boton = React.createClass({
	getDefaultProps: function() {
		return {
			texto: '',
			accion: function(){}
		};
	},
	render: function() {
		return (
			<a 	href="#!" 
				onClick={this.props.accion}
			>
				{this.props.texto}
			</a> 
		);
    }
});
