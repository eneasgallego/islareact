import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import Panel from './Panel';

/* Private functions */
const _getDefaultProps = () => ({
});

class PanelFlotante extends Component {
    /* Properties */
    static propTypes = {
        onClick:     PropTypes.func,
        onMouseOver: PropTypes.func,
        onMouseOut:  PropTypes.func
    }
    getDefaultProps: _getDefaultProps

    /* Render */
    render() {
        const {
            children,
            onClick,
            onMouseOver,
            onMouseOut
        } = this.props;

        return (
            <Panel
                className="flotante"
                onClick={onClick}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
            >
				{children}
            </Panel>
        );
    }
}

export default PanelFlotante;
