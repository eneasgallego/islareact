import React from 'react';

import ListaItemField from './listaitemfield';

import { FIRST_INDEX } from '../constantes';

class ListaField extends React.Component {
    componentWillMount() {
        this.onChange = this.onChange.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getSeleccionado = this.getSeleccionado.bind(this);
        this.setSeleccionado = this.setSeleccionado.bind(this);
        this.estaSeleccionado = this.estaSeleccionado.bind(this);
        this.listaitemfield = [];
    }
    componentWillReceiveProps(props) {
        this.setState({
            valor: props.valor,
            lista: props.lista
        });
    }
    onChange(seleccionado, check, listaItem) {
        this.props.onChange.call(this, seleccionado, check, listaItem, this);
    }
    onMouseOver(e) {
        return this.props.onMouseOver.call(this, e, this);
    }
    onClick(e) {
        return this.props.onClick.call(this, e, this);
    }
    getSeleccionado(index) {
        return this.listaitemfield[index].getSeleccionado();
    }
    setSeleccionado(index, seleccionado) {
        this.listaitemfield[index].setSeleccionado(seleccionado);
    }
    estaSeleccionado(item) {
        return !!~this.state.valor.indice('tag', item.tag);
    }
    renderListaItems() {
        const ret = [];

        for (let i = FIRST_INDEX; i < this.state.lista.length; i++) {
            const item = this.state.lista[i];

            ret.push(
                <ListaItemField
                    indice={i}
                    key={item.tag}
                    tag={item.tag}
                    ref={ref => this.listaitemfield.push(ref)}
                    seleccionado={this.estaSeleccionado(item)}
                    contenido={item.contenido}
                    onChange={this.onChange}
                />
            );
        }

        return ret;
    }
    renderLista() {
        return this.state.lista.length ?
            <ul>{this.renderListaItems()}</ul> :
            null;
    }
    render() {
        return (
            <div
                className="filtro"
                onMouseOver={this.onMouseOver}
                onClick={this.onClick}
            >
                {this.renderLista()}
            </div>
        );
    }
}
ListaField.defaultProps = {
    valor: [],
    lista: [],
    onChange() { /* do nothing */ },
    onClick() { /* do nothing */ },
    onMouseOver() { /* do nothing */ }
};

export default ListaField;

