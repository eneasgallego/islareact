window.TextField = React.createClass({
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
			onKeyPress: function(){},
			onLoad: function(){}
		};
	},
	componentDidMount: function() {
		this.props.onLoad(this);
	},
	focus: function () {
		ReactDOM.findDOMNode(this).focus();
	},
	onFocus: function () {
		ReactDOM.findDOMNode(this).select();
	},
	onBlur: function (e) {
		return this.props.onBlur(e, this);
	},
	onKeyPress: function (e) {
		return this.props.onKeyPress(e, this);
	},
	render: function() {
		return (
			<input 
				defaultValue={this.state.valor}
				onClick={this.props.onClick}
				onBlur={this.onBlur}
				onKeyDown={this.onKeyPress}
				onFocus={this.onFocus}
			/>
		);
    }
});
