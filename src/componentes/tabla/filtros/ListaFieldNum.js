import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { emptyFunction } from '../../../utils/utils';
import { NUMERO_DEFECTO, INIT_INDEX, POS_TO_DELETE_SPLICE } from '../../../utils/constantes';

import ListaField from './ListaField';
import ListaItemFieldNum from './ListaItemFieldNum';

const _lista = [{
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
}];

/* Private functions */
const _getDefaultProps = () => ({
    valor:    [],
    onChange: emptyFunction
});
const _getValor = (valor, tag) => valor && valor.buscar('tag', tag);

const _filtrar = (valor, item) => valor.every(itemValor => _lista.buscar('tag', itemValor.tag).filtrar(item, itemValor.valor));
const _insertarValor = (valor, tag, item) => {
    const valorActual = valor.buscar('tag', tag);

    if (valorActual) {
        valorActual.valor = item;
    } else {
        valor.push({
            tag,
            valor: item
        });
    }
};
const _quitarValor = (valor, item) => {
    const _valor = typeof item === 'string' ?
        valor.buscar('tag', item) :
        item;

    _valor && valor.splice(valor.indexOf(_valor), POS_TO_DELETE_SPLICE);
};
const _renderLista = (lista, valor, onChangeNum) => lista.map((item, index) => ({
    tag:       item.tag,
    contenido: (
            <ListaItemFieldNum
                texto={item.texto}
                key={item.tag}
                tag={item.tag}
                indice={index}
                valor={_getValor(valor, item.tag) || {}}
                onChange={onChangeNum}
//                onClick={this.onClick}
//                onBlur={this.onBlur}
//                onKeyPress={this.onKeyPress}
            />
        )
}));

class ListaFieldNum extends Component {
    /* Properties */
    static propTypes = {
        valor:    PropTypes.array,
        onChange: PropTypes.func
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerChange = this.handlerChange.bind(this);
        this.handlerChangeNum = this.handlerChangeNum.bind(this);
    }

    /* Handlers */
    handlerChange(seleccionado, tag, nuevoValor) {
        const {
            valor,
            onChange
        } = this.props,
            _valor = valor || [],
            valorActual = _valor.buscar('tag', tag);

        if (seleccionado) {
            const itemLista = _lista.buscar('tag', tag);

            for (let i = INIT_INDEX; i < _valor.length; i++) {
                if (_valor[i].tag !== tag && (!itemLista.compatible || (itemLista.compatible && !~itemLista.compatible.indexOf(_valor[i].tag)))) {
                    _quitarValor(_valor, _valor[i].tag);
                    i--;
                }
            }
            if (valorActual) {
                if (typeof nuevoValor !== 'undefined') {
                    valorActual.valor = nuevoValor;
                }
            } else {
                _insertarValor(_valor, tag, nuevoValor || NUMERO_DEFECTO);
            }
        } else {
            _quitarValor(_valor, tag);
        }

        _valor.filtrar = _filtrar.bind(this, _valor);

        onChange(_valor);
    }
    handlerChangeNum(nuevoValor, tag) {
        this.handlerChange(true, tag, nuevoValor);
    }

    /* Render */
    render() {
        const { valor } = this.props;

        return (
            <ListaField
//                ref="listafield"
                valor={valor || []}
                lista={_renderLista(_lista, valor, this.handlerChangeNum)}
                onChange={this.handlerChange}
            />
        );
    }
}

export default ListaFieldNum;
