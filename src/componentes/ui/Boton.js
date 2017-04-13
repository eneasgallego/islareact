import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class Boton extends Component {
    static propTypes = {
        texto:   PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
    }

    handlerClick(e) {
        const { onClick } = this.props;

        e.preventDefault();

        onClick();
    }

    render() {
        const { texto } = this.props;

        return (
            <a
                href="#!"
                onClick={this.handlerClick}
            >
				{texto}
            </a>
        );
    }
}

export default Boton;
