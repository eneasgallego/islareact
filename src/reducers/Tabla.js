import {
    CAMBIAR_ORDEN_TABLA,
    SET_ORDEN_TABLA,
    FILTRAR_TABLA,
    LIMPIAR_FILTRO_TABLA,
    INIT_FILTROS_TABLA
} from '../actions/Tabla';

import {
    POS_TO_DELETE_SPLICE, INIT_INDEX,
    ORDER_DOWN, ORDER_UP, ORDER_EQUAL,
    NUMERO_DEFECTO,
    RADIX
} from '../utils/constantes';

const
    _INDEX_TODOS = 0,
    _INDEX_NINGUNO = 1,
    _listaFiltroNum = [{
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
    }],
    _listaFiltroBool = [{
        contenido: 'Sí',
        tag:       'si',
        valor:     true
    },{
        contenido: 'No',
        tag:       'no',
        valor:     false
    }];

const _filtrarObj = (valor, valorFiltrar) => valor.some(item => valorFiltrar === item.valor);
const _filtrarNum = (valor, item) => valor.every(itemValor => _listaFiltroNum.buscar('tag', itemValor.tag).filtrar(item, itemValor.valor));

const _modificarValorFiltroObj = (valor, itemLista, itemValor, insertar) => {
    if (insertar) {
        const _itemValor = itemValor || {};

        if (!itemValor) {
            valor.push(_itemValor);
        }
        _itemValor.titulo = itemLista.texto;
        _itemValor.tag = itemLista.tag;
        _itemValor.valor = itemLista.valor;
    } else if (itemValor) {
        valor.splice(valor.indexOf(itemValor), POS_TO_DELETE_SPLICE);
    }
};

const _getInitialState = () => ({
    filtros:  [],
    orden:    [],
    cargando: false
});

const _checkTabla = (state, action, idTabla, fn) => action.idTabla === idTabla ?
{
    ...state,
    ...fn()
} :
state;

const _cambiarOrdenTabla = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => {
    const
        { orden } = state,
        { campo } = action,
        index = orden.indice('campo', campo);

    const item = ~index ?
    {
        ...orden[index],
        desc: !orden[index].desc
    } :
    {
        campo,
        desc: false
    };

    ~index && orden.splice(index, POS_TO_DELETE_SPLICE);

    orden.unshift({
        ...item
    });

    return orden.slice();
});
const _setOrdenTabla = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => ({orden: action.orden}));
const _crearItemValorFiltroObj = itemLista => ({
    texto: itemLista.contenido,
    tag:   itemLista.tag,
    valor: parseInt(itemLista.tag, RADIX)
});
const _crearItemValorFiltroBool = itemLista => ({
    texto: itemLista.contenido,
    tag:   itemLista.tag,
    valor: itemLista.valor
});
const _filtrarTablaObj = (filtro, newValor) => {
    const
        {
            valor,
            lista
        } = filtro,
        { seleccionado, tag } = newValor,
        _valor = valor || [];

    if (seleccionado && (tag === 'todos' || tag === 'ninguno')) {
        if (tag === 'todos') {
            for (let i = INIT_INDEX; i < lista.length; i++) {
                !isNaN(lista[i].tag) && _modificarValorFiltroObj(_valor, _crearItemValorFiltroObj(lista[i]), _valor.buscar('tag', lista[i].tag), true);
            }
        } else {
            _valor.splice(INIT_INDEX, _valor.length);
        }
    } else {
        const _itemLista = lista.buscar('tag', tag);

        _modificarValorFiltroObj(_valor, lista[_INDEX_TODOS], _valor.buscar('tag', 'todos'), false);
        _modificarValorFiltroObj(_valor, lista[_INDEX_NINGUNO], _valor.buscar('tag', 'ninguno'), false);
        _modificarValorFiltroObj(_valor, _crearItemValorFiltroObj(_itemLista), _valor.buscar('tag', tag), seleccionado);
    }

    _valor.filtrar = _filtrarObj.bind(_valor, _valor);

    return _valor;
};
const _filtrarTablaBool = (filtro, newValor) => {
    if (newValor instanceof Array) {
        for (let i = INIT_INDEX; i < newValor.length; i++) {
            filtro.valor = _filtrarTablaBool(filtro, newValor[i]);
        }

        return filtro.valor;
    }

    const
        {
            valor,
            lista
        } = filtro,
        { seleccionado, tag } = newValor,
        _valor = valor || [],
        _itemLista = lista.buscar('tag', tag);

    _modificarValorFiltroObj(_valor, _crearItemValorFiltroBool(_itemLista), _valor.buscar('tag', tag), seleccionado);

    _valor.filtrar = _filtrarObj.bind(_valor, _valor);

    return _valor;
};
const _insertarValorFiltroNum = (valor, tag, item) => {
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
const _quitarValorFiltroNum = (valor, item) => {
    const _valor = typeof item === 'string' ?
        valor.buscar('tag', item) :
        item;

    _valor && valor.splice(valor.indexOf(_valor), POS_TO_DELETE_SPLICE);
};

const _filtrarTablaNum = (filtro, newValor) => {
    const
        { valor } = filtro,
        _valor = valor || [],
        {
            seleccionado,
            tag,
            nuevoValor
        } = newValor,
        valorActual = _valor.buscar('tag', tag);

    if (seleccionado) {
        const itemLista = _listaFiltroNum.buscar('tag', tag);

        for (let i = INIT_INDEX; i < _valor.length; i++) {
            if (_valor[i].tag !== tag && (!itemLista.compatible || (itemLista.compatible && !~itemLista.compatible.indexOf(_valor[i].tag)))) {
                _quitarValorFiltroNum(_valor, _valor[i].tag);
                i--;
            }
        }
        if (valorActual) {
            if (typeof nuevoValor !== 'undefined') {
                valorActual.valor = nuevoValor;
            }
        } else {
            _insertarValorFiltroNum(_valor, tag, nuevoValor || NUMERO_DEFECTO);
        }
    } else {
        _quitarValorFiltroNum(_valor, tag);
    }

    _valor.filtrar = _filtrarNum.bind(_valor, _valor);

    return _valor;
};
const _filtrarTabla = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => {
    const
        { filtros } = state,
        index = filtros.indice('campo', action.campo),
        filtro = filtros[index],
        _filtro = {...filtro},
        { tipo } = filtro;

    if (tipo.tipo === 'string') {
        _filtro.valor = action.valor;
    } else if (tipo.tipo === 'object') {
        _filtro.valor = _filtrarTablaObj(_filtro, action.valor);
    } else if (tipo.tipo === 'int') {
        _filtro.valor = _filtrarTablaNum(_filtro, action.valor);
    } else if (tipo.tipo === 'bool') {
        _filtro.valor = _filtrarTablaBool(_filtro, action.valor);
    }

    filtros[index] = _filtro;

    return {
        filtros: filtros.slice()
    };
});
const _limpiarFiltroTabla = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => {
    const
        { filtros } = state,
        index = filtros.indice('campo', action.campo);

    ~index && filtros.splice(index, POS_TO_DELETE_SPLICE);

    return {
        filtros: filtros.slice()
    };
});
const _initFiltrosTabla = (state, action, idTabla) => _checkTabla(state, action, idTabla, () => {
    const
        { cols } = action;

    const _filtros = cols.map(col => {
        const
            { filtro, campo, filtro:{tipo:{tipo}} } = col,
            _filtro = {
                ...filtro,
                campo
            };

        if (tipo === 'string') {
            _filtro.valor = '';
        } else if (tipo === 'object') {
            const
                { combosDataset } = action,
                lista = combosDataset[_filtro.dataset],
                campoId = _filtro.id,
                campoTexto = _filtro.texto,
                _listaSort = lista.sort((a, b) => a[campoTexto] === b[campoTexto] ?
                    ORDER_EQUAL :
                    a[campoTexto] > b[campoTexto] ?
                        ORDER_UP :
                        ORDER_DOWN),
                _lista = _listaSort.map(item => ({
                    tag:       `${item[campoId]}`,
                    contenido: item[campoTexto]
                }));

            _filtro.lista = [{
                tag:       'todos',
                contenido: 'TODOS'
            },{
                tag:       'ninguno',
                contenido: 'NINGUNO'
            }].concatenar(_lista);

            _filtro.valor = _filtrarTablaObj(_filtro, {
                seleccionado: true,
                tag:          'todos'
            });
        } else if (tipo === 'int') {
            _filtro.lista = _listaFiltroNum;
            _filtro.valor = _filtrarTablaNum(_filtro, { seleccionado: false });
        } else if (tipo === 'bool') {
            _filtro.lista = _listaFiltroBool;
            _filtro.valor = _filtrarTablaBool(_filtro, _listaFiltroBool.map(({ tag }) => ({
                seleccionado: true,
                tag
            })));
        }

        return _filtro;
    });


    return {
        filtros: _filtros
    };
});

export default idTabla => (state = _getInitialState(), action = {}) => {
    switch (action.type) {
    case CAMBIAR_ORDEN_TABLA:
        return _cambiarOrdenTabla(state, action, idTabla);
    case SET_ORDEN_TABLA:
        return _setOrdenTabla(state, action, idTabla);
    case FILTRAR_TABLA:
        return _filtrarTabla(state, action, idTabla);
    case LIMPIAR_FILTRO_TABLA:
        return _limpiarFiltroTabla(state, action, idTabla);
    case INIT_FILTROS_TABLA:
        return _initFiltrosTabla(state, action, idTabla);
    default:
        return state;
    }
};
