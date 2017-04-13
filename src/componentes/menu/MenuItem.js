import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import Boton from '../ui/Boton';
import Menu from './Menu';

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
    static propTypes = {
        texto:   PropTypes.string.isRequired,
        tag:     PropTypes.string.isRequired,
        menu:    PropTypes.array,
        onClick: PropTypes.func.isRequired
    }

    handlerClick() {
        const { onClick, tag } = this.props;

        onClick(tag);
    }

    render() {
        const { texto, menu, onClick } = this.props;

        return (
            <li
                className="menu-item"
//                onMouseOver={this.onMouseOver}
//                onMouseOut={this.onMouseOut}
//                onClick={this.accion.bind(this)}
            >
                <Boton
                    texto={texto}
                    onClick={this.handlerClick}
                />
				{_renderMenu(menu, onClick)}
            </li>
        );
    }
}

export default MenuItem;
