window.Combo = React.createClass({
	getInitialState: function() {
    	return {
			valor: this.props.valor
    	};
  	},
	getDefaultProps: function() {
		return {
			valor: '',
			combo: {},
			dataset: [],
			onClick: function(){},
			onBlur: function(){},
			onChange: function(){},
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
	onChange: function (e) {
		return this.props.onChange(e, this);
	},
	renderOptions: function () {
		var ret = [];

		ret.push(
			<option key={-1}></option>
		);
		for (var i = 0 ; i < this.props.dataset.length ; i++) {
			var item = this.props.dataset[i];

			ret.push(
				<option key={i} value={item[this.props.combo.id]}>{item[this.props.combo.texto]}</option>
			);
		}

		return ret;
	},
	render: function() {
		return (
			<select 
				defaultValue={parseInt(this.state.valor)}
				onClick={this.props.onClick}
				onBlur={this.onBlur}
				onChange={this.onChange}
			>
			{this.renderOptions()}
			</select>
		);
    }
});
