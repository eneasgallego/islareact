import { INIT_INDEX, NUMERO_DEFECTO } from '../utils/constantes';

export const getMapa = (mapa, id, mapas, lista) => {
    let ret = mapas[mapa];

    if (!ret) {
        ret = lista.crearMapa(id);
    }

    return ret;
};

const calcularTotal = par => {
    let ret = par.defecto;

    for (let i = INIT_INDEX; i < par.lista.length; i++) {
        const item = par.lista[i];

        let valor;

        if (typeof par.valor === 'string') {
            valor = item[par.valor];
        } else if (typeof par.valor === 'function') {
            valor = par.valor(item);
        }

        if (typeof par.tipo === 'function') {
            ret = par.tipo(ret, valor);
        } else if (par.tipo === 'MIN') {
            if (typeof ret === 'undefined' || ret > valor) {
                ret = valor;
            }
        } else if (par.tipo === 'MAX') {
            if (typeof ret === 'undefined' || ret < valor) {
                ret = valor;
            }
        } else if (par.tipo === 'SUM') {
            if (!ret) {
                ret = NUMERO_DEFECTO;
            }

            ret += valor;
        }
    }

    return ret;
};

export const calcularTotales = par => {
    const ret = {};

    for (const i in par) {
        ret[i] = calcularTotal(par[i]);
        if (par.item) {
            par.item[i] = ret[i];
        }
    }

    return ret;
};

const _vistas = {
    pedidosDinamicos:        './PedidosDinamicos',
    vistaFabricas:           './VistaFabricas',
    vistaMaterialesNecesita: './VistaMaterialesNecesita',
    vistaMaterialesFalta:    './VistaMaterialesFalta',
    vistaNecesitaHacer:      './VistaNecesitaHacer',
    vistaNecesitaHaciendo:   './VistaNecesitaHaciendo',
    vistaPedido:             './VistaPedido',
    vistaPedidos:            './VistaPedidos',
    vistaExcedente:          './VistaExcedente'
};
const _getVista = vistaName => require.context('./', true, /^\.\/.*\.js$/)(`${_vistas[vistaName]}.js`).default;
const _getVistas = () => {
    const ret = {};

    for (const key in _vistas) {
        ret[key] = _getVista(key);
    }

    return ret;
};
const _addVistaBD = (bd, nameVista, fnVista) => {
    bd[nameVista] = fnVista(bd);

    return bd[nameVista];
};

export const getVistaBD = (bd, nameVista, force) => (!force && bd[nameVista]) || _addVistaBD(bd, nameVista, _getVista(nameVista));
export const generarVistasBD = (bd, force) => {
    for (const key in _vistas) {
        getVistaBD(bd, key, force);
    }

    return {
        ...bd
    };
};
export const initVistasBD = () => {
    const ret = {};

    for (const key in _vistas) {
        ret[key] = [];
    }

    return ret;
};
