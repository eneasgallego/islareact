import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

/* Private functions */
const _getDefaultProps = () => ({
});

class Panel extends Component {
    /* Properties */
    static propTypes = {
        className: PropTypes.string
    }
    getDefaultProps: _getDefaultProps

    /* Render */
    render() {
        const { className, children } = this.props;

        return (
            <div
                className={className}
                onClick={this.onClick}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
            >
                {children}
            </div>
        );
    }
}

export default Panel;
