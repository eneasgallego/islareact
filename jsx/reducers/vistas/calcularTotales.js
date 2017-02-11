const calcularTotal = par => {
    let ret = par.defecto;

    for (let i = 0 ; i < par.lista.length ; i++) {
        let item = par.lista[i];

        let valor;
        if (typeof(par.valor) === 'string') {
            valor = item[par.valor];
        } else if (typeof(par.valor) === 'function') {
            valor = par.valor(item);
        }

        if (typeof(par.tipo) === 'function') {
            ret = par.tipo(ret, valor);
        } else if (par.tipo == 'MIN') {
            if (typeof(ret) === 'undefined' || ret > valor) {
                ret = valor;
            }
        } else if (par.tipo == 'MAX') {
            if (typeof(ret) === 'undefined' || ret < valor) {
                ret = valor;
            }
        } else if (par.tipo == 'SUM') {
            if (!ret) {
                ret = 0
            }

            ret += valor;
        }
    }

    return ret;
}

export default par => {
    let ret = {};

    for (let i in par) {
        ret[i] = calcularTotal(par[i]);
        if (par.item) {
            par.item[i] = ret[i];
        }
    }

    return ret;
}
