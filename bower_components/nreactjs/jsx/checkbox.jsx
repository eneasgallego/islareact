window.CheckBox = React.createClass({
	getInitialState: function() {
    	return {
			valor: this.props.valor,
    	};
  	},
	getDefaultProps: function() {
		return {
			valor: '',
			onClick: function(){},
			onBlur: function(){},
			onLoad: function(){}
		};
	},
	componentDidMount: function() {
		this.props.onLoad(this);
	},
	focus: function () {
		ReactDOM.findDOMNode(this).focus();
	},
	onBlur: function (e) {
		return this.props.onBlur(e, this);
	},
	onClick: function (e) {
		e.stopPropagation();
		return this.props.onClick(e, this);
	},
	render: function() {
		return (
			<input 
				type="checkbox"
				defaultChecked={this.state.valor != '0'}
				onClick={this.onClick}
				onBlur={this.onBlur}
			/>
		);
    }
});
