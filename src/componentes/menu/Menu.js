import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { INIT_INDEX } from '../../utils/constantes';
import { emptyFunction } from '../../utils/utils';

import MenuItem from './MenuItem';

/* Private functions */
const _getDefaultProps = () => ({
    menu:   [],
    accion: emptyFunction
});
const _renderItemMenu = (item, accion) => {
    const { tag, texto, menu } = item;

    return (
        <MenuItem
            key={tag}
            texto={texto}
            tag={tag}
            onClick={accion}
            menu={menu}
        />
    );
};
const _renderMenu = (menu, accion) => {
    const ret = [];

    for (let i = INIT_INDEX; i < menu.length; i++) {
        ret.push(_renderItemMenu(menu[i], accion));
    }

    return ret;
};

class Menu extends Component {
    /* Properties */
    static propTypes = {
        menu:      PropTypes.array.isRequired,
        accion:    PropTypes.func.isRequired,
        className: PropTypes.string
    }
    getDefaultProps: _getDefaultProps

    /* Render */
    render() {
        const { className, menu, accion } = this.props;

        return (
            <nav className={className}>
                <ul className="menu">
					{_renderMenu(menu, accion)}
                </ul>
            </nav>
        );
    }
}

export default Menu;