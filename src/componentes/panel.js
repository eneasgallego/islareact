import React from 'react';

class Panel extends React.Component {
    componentWillMount() {
        this.onClick = this.onClick.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
    }
    dimensionar(alto) {
        typeof this.props.dimensionar === 'function' && this.props.dimensionar(alto, this);
    }
    onClick(e) {
        this.props.onClick && this.props.onClick.call(this, e, this);
    }
    onMouseOut(e) {
        this.props.onMouseOut && this.props.onMouseOut.call(this, e, this);
    }
    onMouseOver(e) {
        this.props.onMouseOver && this.props.onMouseOver.call(this, e, this);
    }
    renderContenido() {
        return typeof this.props.contenido === 'function' ?
            this.props.contenido.call(this, this) :
            this.props.contenido;
    }
    render() {
        return (
            <div
                className={this.props.className}
                onClick={this.onClick}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
            >
                {this.renderContenido()}
            </div>);
    }
}
Panel.defaultProps = {
    contenido: undefined,
    className: '',
    onClick() { /* do nothing */ },
    onMouseOver() { /* do nothing */ },
    onMouseOut() { /* do nothing */ }
};

export default Panel;

