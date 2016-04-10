//import "babelify/polyfill";
import React from 'react'

class Sandbox extends React.Component {
    render() {
        return (
            <p>
                {this.props.texto}
            </p>
        )
    }
}

export default Sandbox
