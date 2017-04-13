import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class Boton extends Component {
    /* Properties */
    static propTypes = {
        texto: PropTypes.string.isRequired
    }

    /* Render */
    render() {
        const { texto } = this.props;

        return (
            <a
                href="#!"
            >
				{texto}
            </a>
        );
    }
}

export default Boton;
