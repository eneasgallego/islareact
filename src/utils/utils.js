import { PropTypes } from 'prop-types';

import { INIT_INDEX, NUMERO_DEFECTO } from './constantes';

const
    _FIELD_CAMPO = 0,
    _FIELD_VALOR = 1,
    _NOT_FOUND = -1,
    _STATE_COMPLETE = 4,
    _STATUS_SUCCESS = 200,
    _STATUS_CACHED = 304,
    _STATUS_CREATED = 201;

/* eslint-disable no-extend-native */
Array.prototype.concatenar = function concatenar(nuevo) {
    /* eslint-enable no-extend-native */
    this.push.apply(this, nuevo);

    return this;
};

const _parseArgs = function *_parseArgs(args) {
    if (args.length === _FIELD_VALOR) {
        yield args[_FIELD_CAMPO];
        yield undefined;
    } else if (args.length > _FIELD_VALOR) {
        yield args[_FIELD_VALOR];
        yield args[_FIELD_CAMPO];
    }
};

/* eslint-disable no-extend-native */
Array.prototype.buscar = function buscar() {
/* eslint-enable no-extend-native */
    const
        parseArgs = _parseArgs(arguments),
        valor = parseArgs.next().value,
        campo = parseArgs.next().value;

    return this.find((item, index) => ((campo && item[campo] === valor) ||
            (!campo && ((typeof valor === 'function' && valor(item, index)) ||
            (typeof valor !== 'function' && valor === item)))) &&
            item
    );
};
/* eslint-disable no-extend-native */
Array.prototype.indice = function indice() {
/* eslint-enable no-extend-native */
    const
        parseArgs = _parseArgs(arguments),
        valor = parseArgs.next().value,
        campo = parseArgs.next().value;

    return this.findIndex((item, index) => ((campo && item[campo] === valor) ||
        (!campo && ((typeof valor === 'function' && valor(item, index)) ||
        (typeof valor !== 'function' && valor === item)))) &&
        item
    );
};
/* eslint-disable no-extend-native */
Array.prototype.crearMapa = function crearMapa(id) {
/* eslint-enable no-extend-native */
    const ret = {};

    for (let i = INIT_INDEX; i < this.length; i++) {
        const item = this[i];

        ret[item[id]] = item;
    }

    return ret;
};
/* eslint-disable no-extend-native */
Array.prototype.calcular = function calcular(a, b) {
/* eslint-enable no-extend-native */
    let ret = NUMERO_DEFECTO;

    for (let i = INIT_INDEX; i < this.length; i++) {
        const item = this[i];

        const val = typeof a === 'undefined' ?
            item :
            typeof a === 'function' ?
                a.call(item, item, ret) :
                item[a];

        if (b) {
            ret = val;
        } else {
            ret += val;
        }
    }

    return ret;
};

export const ajax = par => new Promise((resolve, reject) => {
    let params = '';
    const arr = [];

    for (const key in par.params) {
        if (typeof par.params[key] !== 'function') {
            arr.push(`${key}=${par.params[key]}`);
        }
    }
    params = arr.join('&');

    let { url } = par;

    if (params && (par.metodo.toLowerCase() === 'get')) {
        url += `?${params}`;
    }
    const xhttp = new XMLHttpRequest();

    xhttp.open(par.metodo, url, true);

    if (par.metodo.toLowerCase() === 'post' || par.metodo.toLowerCase() === 'put') {
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === _STATE_COMPLETE) {
            const fn = () => {
                if ((xhttp.status === _STATUS_SUCCESS) ||
						(xhttp.status === _STATUS_CACHED) ||
						(par.metodo.toLowerCase() === 'post' && xhttp.status === _STATUS_CREATED)) {
                    const obj = JSON.parse(xhttp.responseText);

                    resolve(obj);
                } else {
                    reject(xhttp);
                }
            };

            fn();
        }
    };

    xhttp.send(params);
});
export const insertar = (tabla, par) => ajax({
    metodo: 'POST',
    url:    `http://localhost:3000/${tabla}`,
    params: par
});
export const editar = (tabla, par, id) => ajax({
    metodo: 'PUT',
    url:    `http://localhost:3000/${tabla}/${id}`,
    params: par
});
export const eliminar = (tabla, id) => ajax({
    metodo: 'DELETE',
    url:    `http://localhost:3000/${tabla}/${id}`
});
const _parseTipo = tipo => {
    if (typeof tipo === 'string') {
        return {
            tipo
        };
    }

    return tipo;
};
const _parseFiltro = (filtro, tipo) => {
    let ret = typeof filtro === 'undefined' ?
        true :
        filtro;

    if (ret) {
        if (ret === true) {
            ret = {...tipo};
        } else if (typeof ret === 'string') {
            const tipoFiltro = ret;

            ret = {
                ...tipo,
                tipo: tipoFiltro
            };
        }
        ret.tipo = _parseTipo(ret.tipo);
    }

    return ret;
};

export const parseCols = cols => {
    for (let i = INIT_INDEX; i < cols.length; i++) {
        cols[i].tipo = _parseTipo(cols[i].tipo ?
            cols[i].tipo :
            'string');
        cols[i].filtro = _parseFiltro(cols[i].filtro, cols[i].tipo);
    }

    return cols;
};
const _parseCampo = campo => {
    let ret = {};

    if (typeof campo === 'string') {
        ret.campo = campo;
    } else {
        ret = {
            ...campo
        };
    }
    ret.tipo = _parseTipo(ret.tipo || 'string');

    return ret;
};

export const renderStyleAlto = alto => alto ?
    {height: `${alto}px`} :
    {};
export const getClaseFilaMateriales = datos => datos.stockmateriales >= datos.cantidadpedidos ?
        'bueno' :
    datos.stockmateriales + datos.haciendomateriales >= datos.cantidadpedidos ?
        'medio' :
    datos.haciendofabricas < datos.maximofabricas ?
        datos.faltanecesita ?
            'malo' :
            'nulo' :
        '';
export const getPropTypesTabla = () => ({
    filas:         PropTypes.array.isRequired,
    filtros:       PropTypes.array.isRequired,
    orden:         PropTypes.array.isRequired,
    alto:          PropTypes.number,
    cargando:      PropTypes.bool,
    params:        PropTypes.object,
    combosDataset: PropTypes.object
});
const _getValorDefecto = tipo => tipo === 'string' ?
    '' :
    tipo === 'int' || tipo === 'float' || tipo === 'object' ?
    NUMERO_DEFECTO :
    tipo === 'bool' ?
        false :
        undefined;

export const createDefaultRow = cols => {
    const obj = {};

    for (let i = INIT_INDEX; i < cols.length; i++) {
        const col = cols[i];

        obj[col.campo] = _getValorDefecto(col.tipo.tipo);
    }

    return obj;
};
