window.Dialogo = React.createClass({
	getInitialState: function() {
    	return {
    		top: undefined,
    		left: undefined
    	};
  	},
	getDefaultProps: function() {
		return {
			titulo: 'Dialogo',
			puedeCerrar: true,
			contenido: 'Inserte el contenido.',
			menu: [],
			accionMenu: function(){},
			cerrarDialogo: function(){}
		};
	},
	componentDidMount: function() {
		var dom = ReactDOM.findDOMNode(this);
		dom.addEventListener('resize', function () {
			this.dimensionar();
		}.bind(this));
		this.dimensionar();
	},
	dimensionar: function () {
		var dom = ReactDOM.findDOMNode(this);
		var contenedor = ReactDOM.findDOMNode(this.refs.contenedor);
		var ancho = (dom.offsetWidth - contenedor.offsetWidth) / 2;
		var alto = (dom.offsetHeight - contenedor.offsetHeight) / 2;

		this.setState({
			left: ancho,
			top: alto
		});
	},
	accionMenu: function (tag) {
		this.props.accionMenu(tag, this);
	},
	cerrarDialogo: function () {
		this.props.cerrarDialogo();
	},
	renderMenu: function () {
		var ret = undefined;

		if (this.props.menu.length) {
			ret = <Menu ref="menu" children={this.props.menu} accion={this.accionMenu}/>
		}

		return ret;
	},
	renderStyleContenedor: function () {
		var ret = {};

		if (this.state.left) {
			ret.left = this.state.left;
		}
		if (this.state.top) {
			ret.top = this.state.top;
		}

		return ret;
	},
	renderCerrar: function () {
		var ret;

		if (this.props.puedeCerrar) {
			ret = <i className="icon icon-cancel" onClick={this.cerrarDialogo}></i>
		}

		return ret;
	},
	render: function() {
		return (
			<div className="dialogo">
				<div ref="velo" className="dialogo-velo" onClick={this.cerrarDialogo}></div>

				<div ref="contenedor" className="dialogo-contenedor" style={this.renderStyleContenedor()}>
					<header>
						<h2>
							{this.props.titulo}
							{this.renderCerrar()}
						</h2>
					</header>

					<main ref="contenido" className="dialogo-contenido">
						{this.props.contenido}
					</main>

					{this.renderMenu()}
				</div>
			</div>
		);
    }
});
