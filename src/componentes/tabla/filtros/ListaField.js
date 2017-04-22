import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { emptyFunction } from '../../../utils/utils';

import ListaItemField from './ListaItemField';

/* Private functions */
const _getDefaultProps = () => ({
    lista:    [],
    valor:    null,
    onChange: emptyFunction
});
const _estaSeleccionado = (valor, tag) => !!~valor.indice('tag', tag);
const _renderListaItems = (lista, valor, onChange) => lista.map((item, index) => (
        <ListaItemField
            key={item.tag}
            tag={item.tag}
            seleccionado={_estaSeleccionado(valor, item.tag)}
            contenido={item.contenido}
            onChange={onChange}
//                indice={index}
//                ref={ref => this.listaitemfield.push(ref)}
    />
    ));
const _renderLista = (lista, valor, onChange) => {
    if (lista.length) {
        const _lista = _renderListaItems(lista, valor, onChange);

        return (
            <ul>
                {_lista}
            </ul>
        );
    }

    return null;
};

class ListaField extends Component {
    /* Properties */
    static propTypes = {
        lista:    PropTypes.array.isRequired,
        valor:    PropTypes.any.isRequired,
        onChange: PropTypes.func.isRequired
    }
    getDefaultProps: _getDefaultProps

    /* Render */
    render() {
        const {
            lista,
            valor,
            onChange
        } = this.props;

        return (
            <div
                className="filtro"
//                onMouseOver={this.onMouseOver}
//                onClick={this.onClick}
            >
                {_renderLista(lista, valor, onChange)}
            </div>
        );
    }
}

export default ListaField;
