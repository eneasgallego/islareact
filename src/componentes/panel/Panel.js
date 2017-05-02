import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class Panel extends Component {
    /* Properties */
    static propTypes = {
        className:   PropTypes.string,
        onClick:     PropTypes.func,
        onMouseOver: PropTypes.func,
        onMouseOut:  PropTypes.func
    }

    /* Render */
    render() {
        const {
            className,
            children,
            onClick,
            onMouseOver,
            onMouseOut
        } = this.props;

        return (
            <div
                className={className}
                onClick={onClick}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
            >
                {children}
            </div>
        );
    }
}

export default Panel;
