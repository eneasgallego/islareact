import { PropTypes } from 'prop-types';

import { INIT_INDEX, NUMERO_DEFECTO } from './constantes';

const FIELD_CAMPO = 0, FIELD_VALOR = 1, NOT_FOUND = -1, STATE_COMPLETE = 4, STATUS_SUCCESS = 200, STATUS_CACHED = 304, STATUS_CREATED = 201;

/* eslint-disable no-extend-native */
Array.prototype.concatenar = function concatenar(nuevo) {
    /* eslint-enable no-extend-native */
    this.push.apply(this, nuevo);

    return this;
};
/* eslint-disable no-extend-native */
Array.prototype.promesas = function promesas(fn, success, error, ref) {
/* eslint-enable no-extend-native */
    const array = this;
    const crearPromesa = (item, index) => new Promise(
			(resolve, reject) => {
    fn.call(ref, item, index, () => {
        let _index = index;

        _index++;
        if (_index < array.length) {
            resolve(_index);
        } else {
            success.call(ref);
        }
    }, reject);
})
			.then(
				_index => {
    crearPromesa(array[_index], _index);
},
				err => {
    error.call(ref,err);
});

    if (array.length) {
        const PRIMER_ELEMENTO = 0;

        crearPromesa(array[PRIMER_ELEMENTO], PRIMER_ELEMENTO);
    } else {
        success.call(ref);
    }
};
/* eslint-disable no-extend-native */
Array.prototype.buscar = function buscar() {
/* eslint-enable no-extend-native */
    let valor, campo;

    if (arguments.length === FIELD_VALOR) {
        valor = arguments[FIELD_CAMPO];
    } else if (arguments.length > FIELD_VALOR) {
        campo = arguments[FIELD_CAMPO];
        valor = arguments[FIELD_VALOR];
    }

    for (let i = INIT_INDEX; i < this.length; i++) {
        const item = this[i];

        if 	((campo && item[campo] === valor) ||
			(!campo && ((typeof valor === 'function' && valor(item, i)) ||
			(typeof valor !== 'function' && valor === item)))) {
            return item;
        }
    }

    return undefined;
};
/* eslint-disable no-extend-native */
Array.prototype.indice = function indice() {
/* eslint-enable no-extend-native */
    let valor, campo;

    if (arguments.length === FIELD_VALOR) {
        valor = arguments[FIELD_CAMPO];
    } else if (arguments.length > FIELD_VALOR) {
        campo = arguments[FIELD_CAMPO];
        valor = arguments[FIELD_VALOR];
    }

    for (let i = INIT_INDEX; i < this.length; i++) {
        const item = this[i];

        if 	((campo && item[campo] === valor) ||
			(!campo && ((typeof valor === 'function' && valor(item, i)) ||
			(typeof valor !== 'function' && valor === item)))) {
            return i;
        }
    }

    return NOT_FOUND;
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

window.clonar = function clonar() {
    return JSON.parse(JSON.stringify(this));
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
        if (xhttp.readyState === STATE_COMPLETE) {
            const fn = () => {
                if ((xhttp.status === STATUS_SUCCESS) ||
						(xhttp.status === STATUS_CACHED) ||
						(par.metodo.toLowerCase() === 'post' && xhttp.status === STATUS_CREATED)) {
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
export const parseTipo = tipo => {
    if (typeof tipo === 'string') {
        return {
            tipo
        };
    }

    return tipo;
};
export const parseFiltro = (filtro, tipo) => {
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
        ret.tipo = parseTipo(ret.tipo);
    }

    return ret;
};
export const parseCols = cols => {
    for (let i = INIT_INDEX; i < cols.length; i++) {
        cols[i].tipo = parseTipo(cols[i].tipo ?
            cols[i].tipo :
            'string');
        cols[i].filtro = parseFiltro(cols[i].filtro, cols[i].tipo);
    }

    return cols;
};
export const parseCampo = campo => {
    let ret = {};

    if (typeof campo === 'string') {
        ret.campo = campo;
    } else {
        ret = {
            ...campo
        };
    }
    ret.tipo = parseTipo(ret.tipo || 'string');

    return ret;
};
export const parseCampos = campos => {
    const ret = [];

    for (let i = INIT_INDEX; i < campos.length; i++) {
        ret.push(parseCampo(campos[i]));
    }

    return ret;
};
export const getState = (state, id, initState, newState) => {
    const ret = {};
    const base = state[id] || initState();

    ret[id] = {
        ...base,
        ...typeof newState === 'function' ?
        newState(base) :
        newState
    };

    return ret;
};
export const getMapStateToProps = componente => (state, props) => ({
    ...state[componente][props.id]
});
export const emptyFunction = () => { /* Empty Function */ };
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
    filas:    PropTypes.array.isRequired,
    filtros:  PropTypes.array.isRequired,
    orden:    PropTypes.array.isRequired,
    alto:     PropTypes.number,
    cargando: PropTypes.bool,
    params:   PropTypes.object
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
