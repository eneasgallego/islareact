import React, { Component } from 'react';
// import { PropTypes } from 'prop-types';

/* Private functions */
const _getDefaultProps = () => ({
});

class Componente extends Component {
    /* Properties */
    static propTypes = {
    }
    getDefaultProps: _getDefaultProps

    /* Render */
    render() {
//        const { guardar } = this.props;

        return (
            <div>
				{this.props.children}
            </div>
        );
    }
}

export default Componente;
