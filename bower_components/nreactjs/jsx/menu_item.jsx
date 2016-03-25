window.MenuItem = React.createClass({
	getInitialState: function() {
    	return {
    		mostrar_children: false
    	};
  	},
	getDefaultProps: function() {
		return {
			texto: '',
			accion: function(){},
			menu: []
		};
	},
	accion: function(key) {
		this.props.accion(key);
	},
	onMouseOver: function (e, boton) {
		this.setState({mostrar_children: true});
	},
	onMouseOut: function (e, boton) {
		this.setState({mostrar_children: false});
	},
	renderClassChild: function () {
		var ret = 'child';

		if (!this.state.mostrar_children) {
			ret += ' hidden';
		}

		return ret;
	},
	renderMenu: function () {
		var ret = '';
		if (this.props.menu.length) {
			ret = <Menu className={this.renderClassChild()} children={this.props.menu} accion={this.accion}/>
		}

		return ret;
	},
	render: function() {
		return (
			<li	className="menu-item"
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}
			>
				<Boton	texto={this.props.texto} 
						accion={this.accion.bind(this, this._reactInternalInstance._currentElement.key)}
				/>
				{this.renderMenu()}
			</li>
		);
    }
});
