window.ListaTabla = React.createClass({
	getInitialState: function() {
    	return {
    		cols: parseCols(this.props.cols)
    	};
  	},
	getDefaultProps: function() {
		return {
			id_campo: '',
			url: '',
			cols: [],
			eliminar: false,
			setDialogo: function(){}
		};
	},
	acciones: function () {
		if (this.props.eliminar) {
			return [{
				texto: 'Eliminar',
				tag: 'eliminar'
			}];
		}
		return [];
	},
	onClickAcciones: function (tag) {
		var fn = this[tag];

		if (typeof(fn) === 'function') {
			fn.apply(this, arguments);
		}
	},
	eliminar: function(tag, fila, tabla) {

		var id = fila.getIdFila();
		if (id) {
			this.props.setDialogo({
				titulo: 'Eliminar',
				puedeCerrar: false,
				contenido: '¿Seguro de querer eliminar la fila?',
				menu: [{
					texto: 'Aceptar',
					tag: 'aceptar'
				},{
					texto: 'Cancelar',
					tag: 'cancelar'
				}],
				accionMenu: function (tag) {
					if (tag == 'aceptar') {
						ajax({
							metodo: 'delete',
							url: this.props.url + '/' + id,
							success: function (response) {
								var filas = tabla.state.filas.slice();
								var indice = filas.indice(function (item) {
									return (item[this.props.id_campo] == id);
								}.bind(this));
								if (!!~indice) {
									filas.splice(indice, 1);
									tabla.setState({filas: filas});
								}
								this.props.setDialogo();
							}.bind(this)
						}, tabla);
					} else if (tag == 'cancelar') {
						this.props.setDialogo();
					}
				}.bind(this)
			});
		}
	},
	guardar: function (valor, field, celda, fila, tabla) {
		var id = fila.getIdFila();
		var campo = celda.props.campo;
		var params = {};
		params[campo] = valor;
		var url = this.props.url;
		var metodo = 'post';

		var fn = function (response) {
			var filas = tabla.state.filas.slice();
			var indice = filas.indice(function (item) {
				return (item[this.props.id_campo] == id);
			}.bind(this));
			if (!!~indice) {
				var datos = filas[indice];
				if (metodo == 'post') {
					datos[this.props.id_campo] = response[this.props.id_campo];
				};
				datos[campo] = valor;
				filas[indice] = datos;
				tabla.setState({filas: filas});
			}
		}.bind(this);

		if (id) {
			for (var i = 0 ; i < this.state.cols.length ; i++) {
				var col = this.state.cols[i];

				if (col.campo && col.campo != campo) {
					params[col.campo] = fila.props.datos[col.campo];
				}
			}
			url += '/' + id;
			metodo = 'put';
		}

		ajax({
			metodo: metodo,
			url: url,
			params: params,
			success: fn
		}, tabla);
	},
	render: function() {
		return (
			<Tabla
				id_campo={this.props.id_campo}
				guardar={this.guardar}
				url={this.props.url}
				cols={this.state.cols}
				acciones={this.acciones()}
				onClickAcciones={this.onClickAcciones}
			/>
		);
    }
});
