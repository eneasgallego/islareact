import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import { cambiarContenido, dimensionar } from '../actions/app';

import PanelTablaInicio from '../componentes/panel/PanelTablaInicio';

import Menu from '../componentes/menu/Menu';


/* Private functions */
const _getDefaultProps = () => ({
    menu: []
});
const _renderStyle = alto => alto ?
    {height: `${alto}px`} :
    {};

class App extends Component {
    /* Properties */
    static propTypes = {
        menu: PropTypes.array.isRequired,
        alto: PropTypes.number
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerAccionMenu = this.handlerAccionMenu.bind(this);
    }
    componentDidMount() {
        this.dimensionar();
        window.onresize = e => {
            this.dimensionar();
        };
    }

    /* Handlers */
    handlerAccionMenu(tag) {
        const { dispatch } = this.props;

        dispatch(cambiarContenido(tag));
    }

    /* Methods */
    dimensionar() {
        const { dispatch } = this.props;

        dispatch(dimensionar(ReactDOM.findDOMNode(this.refs.menu)));
    }

    /* Render */
    renderContenido() {
        const { contenido } = this.props;

        if (contenido === 'inicio') {
            return <PanelTablaInicio/>;
//        } else if (contenido == 'excedente') {
//            return this.renderExcedente();
//        } else if (contenido == 'nuevo_pedido') {
//            return this.renderNuevoPedido();
        }

        return null;/* (
                <ListaTabla	id_campo={this.props.config[contenido].id_campo}
                    url_editar={this.props.config[contenido].url_editar}
                    url_crear={this.props.config[contenido].url_crear}
                    url={this.props.config[contenido].url}
                    cols={this.props.config[contenido].cols}
                    eliminar={this.props.config[contenido].eliminar}
                    key={contenido}
                    ref={contenido}
                    setDialogo={this.setDialogo}
                />
        ); */

    }
    render() {
        const { menu, alto } = this.props;

        return (
        <div>
          <header>
            <Menu ref="menu" menu={menu} accion={this.handlerAccionMenu}/>
          </header>

         <main style={_renderStyle(alto)}>
            { this.renderContenido() }
          </main>
          {/* this.renderDialogo() */}

        </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state.app
});

export default connect(mapStateToProps)(App);
