import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import { cambiarContenido } from '../actions/app';

import Menu from '../componentes/menu/Menu';

/* Private functions */
const _getDefaultProps = () => ({
    menu: []
});

class App extends Component {
    /* Properties */
    static propTypes = {
        menu: PropTypes.array.isRequired
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerAccionMenu = this.handlerAccionMenu.bind(this);
    }

    /* Handlers */
    handlerAccionMenu(tag) {
        const { dispatch } = this.props;

        dispatch(cambiarContenido(tag));
    }

    /* Render */
    render() {
        const { menu } = this.props;

        return (
        <div>
          <header>
            <Menu ref="menu" menu={menu} accion={this.handlerAccionMenu}/>
          </header>

        {/* <main style={this.renderStyle()}> */}
            <main>
            {/* this.renderContenido() */}
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
