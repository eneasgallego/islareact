import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

/* Private functions */
const _getDefaultProps = () => ({
});

class Panel extends Component {
    /* Properties */
    static propTypes = {
        className: PropTypes.string,
        onClick:   PropTypes.func
    }
    getDefaultProps: _getDefaultProps

    /* Render */
    render() {
        const {
            className,
            children,
            onClick
        } = this.props;

        return (
            <div
                className={className}
                onClick={onClick}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
            >
                {children}
            </div>
        );
    }
}

export default Panel;
