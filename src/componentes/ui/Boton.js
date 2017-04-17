import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class Boton extends Component {
    /* Properties */
    static propTypes = {
        texto:   PropTypes.string.isRequired,
        onClick: PropTypes.func
    }

    /* Lifecycle */
    componentWillMount() {
        this.handlerClick = this.handlerClick.bind(this);
    }

    /* Handlers */
    handlerClick(e) {
        const { onClick } = this.props;

        e.preventDefault();
        if (onClick) {
            e.stopPropagation();
            onClick();
        }
    }

    /* Render */
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
