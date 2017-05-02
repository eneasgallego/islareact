import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

import Menu from '../menu/Menu';

const _HALF_DIVISION = 2;

/* Private functions */
const _getDefaultProps = () => ({
    contenido: 'Inserte el contenido'
});
const _renderCerrar = (puedeCerrar, onClickCerrar) => puedeCerrar ?
    <i className="icon icon-cancel" onClick={onClickCerrar}></i> :
    null;
const _renderStyleContenedor = (left, top) => ({left, top});
const _renderMenu = (menu, onClickMenu) => menu ?
    <Menu
        ref="menu"
        menu={menu}
        accion={onClickMenu}
    /> :
    null;

class Dialogo extends Component {
    /* Properties */
    static propTypes = {
        titulo:        PropTypes.string.isRequired,
        contenido:     PropTypes.any,
        puedeCerrar:   PropTypes.bool,
        onClickCerrar: PropTypes.func.isRequired,
        menu:          PropTypes.array,
        onClickMenu:   PropTypes.func
    }
    static defaultProps = _getDefaultProps()

    /* Lifecycle */
    componentWillMount() {
        this.setState({});

        this.handlerCerrar = this.handlerCerrar.bind(this);
    }
    componentDidMount() {
        window.addEventListener('resize', this.dimensionar);
        this.dimensionar();
    }

    /* Handlers */
    handlerCerrar(e) {
        const { onClickCerrar } = this.props;

        e.preventDefault();

        onClickCerrar();
    }

    /* Methods */
    dimensionar() {
        const
            dom = ReactDOM.findDOMNode(this),
            contenedor = ReactDOM.findDOMNode(this.refs.contenedor),
            left = (dom.offsetWidth - contenedor.offsetWidth) / _HALF_DIVISION,
            top = (dom.offsetHeight - contenedor.offsetHeight) / _HALF_DIVISION;

        this.setState({
            left,
            top
        });
    }

    /* Render */
    render() {
        const {
            titulo,
            contenido,
            puedeCerrar,
            menu,
            onClickMenu
        } = this.props,
            {
            left,
            top
        } = this.state;

        return (
            <div className="dialogo">
                <div ref="velo" className="dialogo-velo" onClick={this.handlerCerrar}></div>

                <div ref="contenedor" className="dialogo-contenedor" style={_renderStyleContenedor(left, top)}>
                    <header>
                        <h2>
							{titulo}
							{_renderCerrar(puedeCerrar, this.handlerCerrar)}
                        </h2>
                    </header>

                    <main ref="contenido" className="dialogo-contenido">
						{contenido}
                    </main>

					{_renderMenu(menu, onClickMenu)}
                </div>
            </div>
        );
    }
}

export default Dialogo;
