import React from 'react';

import ListaField from './listafield';
import { ajax } from './base';

import { POS_TO_DELETE_SPLICE, FIRST_INDEX } from '../constantes';

class ListaFieldObj extends React.Component {
    componentWillMount() {
        this.onChange = this.onChange.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getTitulo = this.getTitulo.bind(this);
        this.filtrar = this.filtrar.bind(this);
        this.cargarLista = this.cargarLista.bind(this);
    }
    componentDidMount() {
        if (!this.state.cargado) {
            if (this.props.dataset) {
                this.cargarDataset(this.props.dataset);
            } else {
                this.setState({cargado: true});
            }
        }
    }
    componentWillReceiveProps(props) {
        this.setState({
            valor: this.getValorLimpio(props.valor),
            lista: this.props.lista ?
                this.cargarLista(this.props.lista) :
                this.getValorLimpio(),
            cargado: !!this.props.lista
        });
    }
    cargarDataset(dataset, params, callback) {
        if (!this.state.cargado) {
            ajax({
                metodo:  'get',
                params,
                url:     dataset,
                success: res => {
                    const lista = this.cargarLista(res);

                    this.setState({
                        lista,
                        cargado: true
                    }, callback);
                }
            }, this);
        }
    }
    cargarLista(lista) {
        const ret = this.getValorLimpio();
        const _crearItemLista = (texto, valor) => ({texto, tag: valor, valor});

        for (let i = FIRST_INDEX; i < lista.length; i++) {
            ret.push(_crearItemLista(lista[i][this.props.campo_texto], lista[i][this.props.campo_valor]));
        }

        return ret;
    }
    getValorLimpio(array) {
        const ret = array instanceof Array ?
            array :
            [];

        ret.getTitulo = this.getTitulo;
        ret.filtrar = this.filtrar;

        return ret;
    }
    onChange(seleccionado, field, listaItem, lista) {
        const { tag } = listaItem.props;
        let valor = this.getValorLimpio({
            ...this.state.valor
        });

        const modificarValor = (itemLista, itemValor, insertar) => {
            let _itemValor = itemValor;

            if (insertar) {
                if (!_itemValor) {
                    _itemValor = {};
                    valor.push(_itemValor);
                }
                _itemValor.titulo = itemLista.texto;
                _itemValor.tag = itemLista.tag;
                _itemValor.valor = itemLista.valor;
            } else if (_itemValor) {
                valor.splice(valor.indexOf(_itemValor), POS_TO_DELETE_SPLICE);
            }

            return _itemValor;
        };

        if (seleccionado && (tag === 'todos' || tag === 'ninguno')) {
            if (tag === 'todos') {
                for (let i = FIRST_INDEX; i < this.state.lista.length; i++) {
                    modificarValor(this.state.lista[i], valor.buscar('tag', this.state.lista[i].tag), true);
                }
            } else {
                valor = this.getValorLimpio();
            }
        } else {
            const TODOS_INDEX = 0, NINGUNO_INDEX = 1;

            modificarValor(this.state.lista[TODOS_INDEX], valor.buscar('tag', 'todos'), false);
            modificarValor(this.state.lista[NINGUNO_INDEX], valor.buscar('tag', 'ninguno'), false);
            modificarValor(this.state.lista.buscar('tag', tag), valor.buscar('tag', tag), seleccionado);
        }

/*        this.setState({valor: valor},()=>{ */
        this.props.onChange.call(this, valor, this);
/*        }); */
    }
    onMouseOver(e, listafield) {
        e.persist();
        e.solo_mostrar = true;

        return this.props.onMouseOver.call(this, e, listafield, this);
    }
    onClick(e, listafield) {
        return this.props.onClick.call(this, e, listafield, this);
    }
    getTitulo() {
        const ret = [];

        for (let i = FIRST_INDEX; i < this.state.valor.length; i++) {
            const item = this.state.valor[i];

            ret.push(item.titulo);
        }

        return ret.join(';');
    }
    filtrar(valor) {
        for (let i = FIRST_INDEX; i < this.state.valor.length; i++) {
            const item = this.state.valor[i];

            if (valor === item.valor) {
                return true;
            }
        }

        return false;
    }
    renderLista() {
        const ret = [{
            tag:       'todos',
            contenido: 'TODOS'
        },{
            tag:       'ninguno',
            contenido: 'NINGUNO'
        }];

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
                onMouseOver={this.onMouseOver}
            />
        );
    }
}
ListaFieldObj.defaultProps = {
    valor:       [],
    dataset:     '',
    campo_texto: '',
    campo_valor: '',
    onClick() { /* do nothing */ },
    onBlur() { /* do nothing */ },
    onKeyPress() { /* do nothing */ },
    onChange() { /* do nothing */ },
    onMouseOver() { /* do nothing */ }
};

export default ListaFieldObj;

