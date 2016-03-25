window.Menu = React.createClass({
	getDefaultProps: function() {
		return {
			className: '',
			children: [],
			accion: function(){}
		};
	},
	renderChildren: function () {
		var ret = [];

		for (var i = 0 ; i < this.props.children.length ; i++) {
			var child = this.props.children[i];
			ret.push(<MenuItem key={child.tag} texto={child.texto} accion={this.props.accion} menu={child.menu}/>)
		}

		return ret;
	},
	render: function() {
		return (
			<nav className={this.props.className}>
				<ul className="menu">
					{this.renderChildren()}
				</ul>
			</nav>
		);
    }
});
