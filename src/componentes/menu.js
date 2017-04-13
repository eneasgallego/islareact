import React from 'react';

import MenuItem from './menu_item';

import { FIRST_INDEX } from '../constantes';

class Menu extends React.Component {
    renderChildren() {
        const ret = [];

        for (let i = FIRST_INDEX; i < this.props.children.length; i++) {
            const child = this.props.children[i];

            ret.push(<MenuItem key={child.tag} texto={child.texto} accion={this.props.accion} menu={child.menu}/>);
        }

        return ret;
    }
    render() {
        return (
			<nav className={this.props.className}>
				<ul className="menu">
					{this.renderChildren()}
				</ul>
			</nav>
        );
    }
}
Menu.defaultProps = {
    className: '',
    children:  [],
    accion() { /* do nothing */ }
};

export default Menu;
