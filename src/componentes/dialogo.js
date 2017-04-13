import React from 'react';
import ReactDOM from 'react-dom';

import Menu from './menu';

const HALF = 2;

class Dialogo extends React.Component {
    componentWillMount() {
        this.cerrarDialogo = this.cerrarDialogo.bind(this);
        this.accionMenu = this.accionMenu.bind(this);

        this.setState({
            top:  undefined,
            left: undefined
        });
    }
    componentDidMount() {
        const dom = ReactDOM.findDOMNode(this);

        dom.addEventListener('resize', () => {
            this.dimensionar();
        });
        this.dimensionar();
    }
    dimensionar() {
        const dom = ReactDOM.findDOMNode(this);
        const contenedor = ReactDOM.findDOMNode(this.refs.contenedor);
        const ancho = (dom.offsetWidth - contenedor.offsetWidth) / HALF;
        const alto = (dom.offsetHeight - contenedor.offsetHeight) / HALF;

        this.setState({
            left: ancho,
            top:  alto
        });
    }
    accionMenu(tag) {
        this.props.accionMenu(tag, this);
    }
    cerrarDialogo() {
        this.props.cerrarDialogo();
    }
    renderMenu() {
        let ret;

        if (this.props.menu.length) {
            ret = <Menu ref="menu" children={this.props.menu} accion={this.accionMenu}/>;
        }

        return ret;
    }
    renderStyleContenedor() {
        const ret = {};

        if (this.state.left) {
            ret.left = this.state.left;
        }
        if (this.state.top) {
            ret.top = this.state.top;
        }

        return ret;
    }
    renderCerrar() {
        let ret;

        if (this.props.puedeCerrar) {
            ret = <i className="icon icon-cancel" onClick={this.cerrarDialogo}></i>;
        }

        return ret;
    }
    render() {
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
}
Dialogo.defaultProps = {
    titulo:      'Diálogo',
    puedeCerrar: true,
    contenido:   'Inserte el contenido',
    menu:        [],
    accionMenu() { /* do nothing */ },
    cerrarDialogo() { /* do nothing */ }
};

export default Dialogo;

