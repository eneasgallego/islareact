import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import Menu from '../componentes/menu/Menu';

class App extends Component {
    static propTypes = {
        menu: PropTypes.array.isRequired
    }

    handlerAccionMenu() {
        /* eneas */
        return this;
    }

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
