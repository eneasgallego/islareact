import React from 'react';

import ListaField from './listafield';

import { FIRST_INDEX } from '../constantes';

class ListaFieldBool extends React.Component {
    componentWillMount() {
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getTitulo = this.getTitulo.bind(this);
        this.filtrar = this.filtrar.bind(this);
    }
    componentWillReceiveProps(props) {
        this.setState({
            valor: this.getValorLimpio(props.valor),
            lista: this.getValorLimpio([{
                texto: 'Sí',
                tag:   'si',
                valor: true
            },{
                texto: 'No',
                tag:   'no',
                valor: false
            }])
        });
    }
    getValorLimpio(array) {
        const ret = array instanceof Array ?
            array :
            [];

        ret.getTitulo = this.getTitulo;
        ret.filtrar = this.filtrar;

        return ret;
    }
    onChange(seleccionado, check, listaItem, lista) {
        const { tag } = listaItem.props;
        const valor = this.getValorLimpio();

        if (seleccionado) {
            const itemLista = this.state.lista.buscar('tag', tag);

            valor.push({
                tag,
                valor: itemLista.valor
            });
        }

        this.setState({valor},() => {
            this.props.onChange.call(this, valor, this);
        });
    }
    onClick(e, listafield) {
        return this.props.onClick.call(this, e, listafield, this);
    }
    getTitulo() {
        const ret = [];

        for (let i = FIRST_INDEX; i < this.state.valor.length; i++) {
            const item = this.state.valor[i];

            ret.push(item.tag);
        }

        return ret.join(';');
    }
    filtrar(valor) {
        for (let i = FIRST_INDEX; i < this.state.valor.length; i++) {
            const item = this.state.valor[i];

            if (valor !== item.valor) {
                return false;
            }
        }

        return true;
    }
    renderLista() {
        const ret = [];

        for (let i = FIRST_INDEX; i < this.state.lista.length; i++) {
            const item = this.state.lista[i];

            ret.push({
                tag:       item.tag,
                contenido: item.texto
            });
        }

        return ret;
    }
    render() {
        return (
            <ListaField
                ref="listafield"
                valor={this.state.valor}
                lista={this.renderLista()}
                onChange={this.onChange}
                onClick={this.onClick}
            />
        );
    }
}
ListaFieldBool.defaultProps = {
    valor: [],
    onClick() { /* do nothing */ },
    onBlur() { /* do nothing */ },
    onKeyPress() { /* do nothing */ },
    onChange() { /* do nothing */ }
};

export default ListaFieldBool;

