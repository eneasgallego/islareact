import { FIRST_INDEX, NUMERO_DEFECTO } from '../constantes';

export const getMapa = (mapa, id, mapas, lista) => {
    let ret = mapas[mapa];

    if (!ret) {
        ret = lista.crearMapa(id);
    }

    return ret;
};
const calcularTotal = par => {
    let ret = par.defecto;

    for (let i = FIRST_INDEX; i < par.lista.length; i++) {
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
