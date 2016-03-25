window.PanelTabla = React.createClass({
	getInitialState: function() {
    	return {
    	};
  	},
	getDefaultProps: function() {
		return {
			id: '',
			titulo: '',
			url: '',
			params: {},
			necesitaParametros: false,
			id_campo: '',
			cols: [],
			acciones: [],
			claseFila: function(){},
			onClickAcciones: function(){}
		};
	},
	componentWillUpdate: function() {
	},
	onClickAcciones: function (tag, fila, tabla) {
		this.props.onClickAcciones(tag, fila, tabla, this);
	},
	refrescar: function () {
		this.refs.tabla.refrescar();
	},
	renderTabla: function () {
		this.tabla = <Tabla
			ref="tabla"
			id_campo={this.props.id_campo}
			url={this.props.url}
			params={this.props.params}
			necesitaParametros={this.props.necesitaParametros}
			claseFila={this.props.claseFila}
			cols={this.props.cols}
			acciones={this.props.acciones}
			onClickAcciones={this.onClickAcciones}
		/>

		return this.tabla;
	},
	render: function() {
		return (
			<section id={this.props.id}>
				<h1>{this.props.titulo}</h1> 
				{this.renderTabla()}
			</section>
		);
    }
});
