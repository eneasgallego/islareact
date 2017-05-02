import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import Boton from '../ui/Boton';
import Menu from './Menu';

/* Private functions */
const _getInitialState = () => ({
    mostrarChildren: false
});
const _renderClassHidden = mostrarHidden => mostrarHidden ?
    'hidden' :
    '';
const _renderClassChild = mostrarChildren => `child ${_renderClassHidden(!mostrarChildren)}`;
const _renderMenu = (menu, accion, mostrarChildren) => menu instanceof Array && menu.length ?
        <Menu
            className={_renderClassChild(mostrarChildren)}
            menu={menu}
            accion={accion}
        /> :
        null;

class MenuItem extends Component {

    /* Properties */
    static propTypes = {
        texto:   PropTypes.string.isRequired,
        tag:     PropTypes.string.isRequired,
        menu:    PropTypes.array,
        onClick: PropTypes.func.isRequired
    }

    /* Lifecycle */
    componentWillMount() {
        this.handlerClick = this.handlerClick.bind(this);
        this.handlerMouseOver = this.handlerMouseOver.bind(this);
        this.handlerMouseOut = this.handlerMouseOut.bind(this);

        this.setState(_getInitialState());
    }

    /* Handlers */
    handlerClick(e) {
        const { onClick, tag } = this.props;

        e.stopPropagation();

        onClick(tag);
    }
    handlerMouseOver(e, boton) {
        this.setState({mostrarChildren: true});
    }
    handlerMouseOut(e, boton) {
        this.setState({mostrarChildren: false});
    }

    /* Render */
    render() {
        const
            { texto, menu, onClick } = this.props,
            { mostrarChildren } = this.state;

        return (
            <li
                className="menu-item"
                onMouseOver={this.handlerMouseOver}
                onMouseOut={this.handlerMouseOut}
                onClick={this.handlerClick}
            >
                <Boton texto={texto} />
				{_renderMenu(menu, onClick, mostrarChildren)}
            </li>
        );
    }
}

export default MenuItem;
