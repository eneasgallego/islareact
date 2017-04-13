import React from 'react';

import Panel from './panel';

class PanelFlotante extends React.Component {
    componentWillMount() {
        this.onClick = this.onClick.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
    }
    componentWillReceiveProps(props) {
        this.setState({
            contenido:    props.contenido,
            onClick:      props.onClick,
            onMouseOver:  props.onMouseOver,
            onMouseOut:   props.onMouseOut,
            onClosePanel: props.onClosePanel
        });
    }
    onClick(e, panel) {
        if (this.state.onClick) {
            this.state.onClick.call(this, e, panel, this);
        }
    }
    onMouseOut(e, panel) {
        if (this.state.onMouseOut) {
            this.state.onMouseOut.call(this, e, panel, this);
        }
    }
    onMouseOver(e, panel) {
        if (this.state.onMouseOver) {
            this.state.onMouseOver.call(this, e, panel, this);
        }
    }
    render() {
        return (
            <Panel
                className="flotante"
                contenido={this.state.contenido}
                onClick={this.onClick}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
            />
        );
    }
}
PanelFlotante.defaultProps = {
    contenido: undefined,
    onClick() { /* do nothing */ },
    onMouseOver() { /* do nothing */ },
    onMouseOut() { /* do nothing */ },
    onClosePanel() { /* do nothing */ }
};

export default PanelFlotante;

