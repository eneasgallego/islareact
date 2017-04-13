import React from 'react';

import ListaField from './listafield';
import ListaItemFieldNum from './listaitemfieldnum';

import { POS_TO_DELETE_SPLICE, NUMERO_DEFECTO, FIRST_INDEX } from '../constantes';

class ListaFieldNum extends React.Component {
    componentWillMount() {
        this.onChange = this.onChange.bind(this);
        this.onChangeNum = this.onChangeNum.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.getValor = this.getValor.bind(this);
        this.getTitulo = this.getTitulo.bind(this);
        this.filtrar = this.filtrar.bind(this);

        this.setState({
            lista: [{
                texto:      'mayor que',
                tag:        'mayor',
                titulo:     '>',
                compatible: ['menor'],
                filtrar(a, b) {
                    return a > b;
                }
            },{
                texto:      'menor que',
                tag:        'menor',
                titulo:     '<',
                compatible: ['mayor'],
                filtrar(a, b) {
                    return a < b;
                }
            },{
                texto:  'igual que',
                tag:    'igual',
                titulo: '=',
                filtrar(a, b) {
                    return a === b;
                }
            },{
                texto:  'distinto que',
                tag:    'distinto',
                titulo: '!=',
                filtrar(a, b) {
                    return a !== b;
                }
            }]
        });
    }
    componentWillReceiveProps(props) {
        this.setState({
            valor: props.valor
        },() => {
            this.setState({
                valor: {
                    ...this.state.valor,
                    getTitulo:     this.getTitulo,
                    filtrar:       this.filtrar,
                    quitarValor:   this.quitarValor,
                    insertarValor: this.insertarValor
                }
            });
        });
    }
    insertarValor(tag, valorActual, valor) {
        let _valorActual = valorActual;

        if (!_valorActual) {
            _valorActual = {
                tag
            };
            this.push(_valorActual);
        }
        _valorActual.valor = valor;
    }
    quitarValor(valor) {
        const newValor = typeof valor === 'string' ?
            this.buscar('tag', valor) :
            valor;

        newValor && this.splice(this.indexOf(newValor), POS_TO_DELETE_SPLICE);
    }
    onChange(seleccionado, check, listaItem, lista) {
        const { tag } = listaItem.props;
        const { valor } = this.state;
        const valorActual = valor.buscar('tag', tag);

        if (seleccionado) {
            const itemLista = this.state.lista.buscar('tag', tag);

            for (let i = FIRST_INDEX; i < valor.length; i++) {
                if (valor[i].tag !== tag && (!itemLista.compatible || (itemLista.compatible && !~itemLista.compatible.indexOf(valor[i].tag)))) {
                    valor.quitarValor(valor[i].tag);
                    i--;
                }
            }
            if (!valorActual) {
                valor.insertarValor(tag, valorActual, NUMERO_DEFECTO);
            }
        } else {
            valor.quitarValor(valorActual);
        }

        this.props.onChange.call(this, this.state.valor, this);
    }
    onChangeNum(valor, indice, textfield, listaitemfieldnum) {
        const { tag } = listaitemfieldnum.props;
        const valorEstado = this.state.valor;
        const valorActual = valorEstado.buscar('tag', tag);

        let seleccionado = false;

        if (isNaN(valor)) {
            valorEstado.quitarValor(valorActual);
        } else {
            valorEstado.insertarValor(tag, valorActual, valor);
            seleccionado = true;
        }

        this.refs.listafield.setSeleccionado(indice, seleccionado);
    }
    onClick(e, textfield, listaitemfieldnum) {
        return this.props.onClick.call(this, e, textfield, listaitemfieldnum, this);
    }
    onBlur(e, textfield, listaitemfieldnum) {
        return this.props.onBlur.call(this, e, textfield, listaitemfieldnum, this);
    }
    onKeyPress(e, textfield, listaitemfieldnum) {
        return this.props.onKeyPress.call(this, e, textfield, listaitemfieldnum, this);
    }
    getValor(tag) {
        return this.state.valor.buscar('tag', tag);
    }
    getTitulo() {
        const ret = [];

        for (let i = FIRST_INDEX; i < this.state.valor.length; i++) {
            const item = this.state.valor[i];
            const itemLista = this.state.lista.buscar('tag', item.tag);

            ret.push(itemLista.titulo + item.valor);
        }

        return ret.join(';');
    }
    filtrar(valor) {
        for (let i = FIRST_INDEX; i < this.state.valor.length; i++) {
            const item = this.state.valor[i];
            const itemLista = this.state.lista.buscar('tag', item.tag);

            if (!itemLista.filtrar(valor, item.valor)) {
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
                contenido: (
                    <ListaItemFieldNum
                        texto={item.texto}
                        key={item.tag}
                        tag={item.tag}
                        indice={i}
                        valor={this.getValor(item.tag)}
                        onClick={this.onClick}
                        onBlur={this.onBlur}
                        onKeyPress={this.onKeyPress}
                        onChange={this.onChangeNum}
                    />)
            }

            );
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
            />
        );
    }
}
ListaFieldNum.defaultProps = {
    valor: [],
    onClick() { /* do nothing */ },
    onBlur() { /* do nothing */ },
    onKeyPress() { /* do nothing */ },
    onChange() { /* do nothing */ }
};

export default ListaFieldNum;

