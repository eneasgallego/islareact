import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import ListaField from './ListaField';
import ListaItemFieldNum from './ListaItemFieldNum';

/* Private functions */
const _getDefaultProps = () => ({
});
const _getValor = (valor, tag) => valor && valor.buscar('tag', tag);
const _estaSeleccionado = (valor, tag) => ~valor.indice('tag', tag);

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
                disabled={!_estaSeleccionado(valor, item.tag)}
//                onClick={this.onClick}
//                onBlur={this.onBlur}
//                onKeyPress={this.onKeyPress}
        />
        )
}));

class ListaFieldNum extends Component {
    /* Properties */
    static propTypes = {
        valor:    PropTypes.array.isRequired,
        lista:    PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired
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
            onChange
        } = this.props;

        onChange({ seleccionado, tag, nuevoValor });
    }
    handlerChangeNum(nuevoValor, tag) {
        this.handlerChange(true, tag, nuevoValor);
    }

    /* Render */
    render() {
        const { valor, lista } = this.props;

        return (
            <ListaField
//                ref="listafield"
                valor={valor || []}
                lista={_renderLista(lista, valor, this.handlerChangeNum)}
                onChange={this.handlerChange}
            />
        );
    }
}

export default ListaFieldNum;
