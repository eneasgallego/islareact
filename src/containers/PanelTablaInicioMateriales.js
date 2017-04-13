import React, { Component } from 'react';
// import { PropTypes } from 'prop-types';
// import { connect } from 'react-redux'

/*
import {
    limpiarDatasetTipopedidosError,
    } from './actions/app'
*/
import PanelTabla from './componentes/panel_tabla';
import { parseCols } from './componentes/base';

import getVistaNecesita from './datos/vistaNecesita';

const _parseData = data => {
    const vistaNecesita = getVistaNecesita(data,item => item.stockmateriales + item.haciendomateriales < item.cantidadpedidos);

    const ret = vistaNecesita.filter(item => (item.procesadopedidos && !!~item.maximofabricas) && item.stockmateriales + item.haciendomateriales < item.cantidadpedidos);

    return ret;
};
const _getCols = () => parseCols([{
    texto: 'PROF',
    campo: 'profundidadpedidos'
}, {
    texto: 'MATERIAL',
    campo: 'nombremateriales'
}, {
    texto: 'FALTA',
    campo: 'faltamateriales'
}, {
    texto: 'FABRICA',
    campo: 'nombrefabricas'
}]);
const _getOrden = () => [{
    campo(item) {
        const maximoFabricas = -1,
            ordenArr = 1,
            ordenAba = 0;

        return item.stockmateriales < item.cantidadpedidos &&
            item.stockmateriales + item.haciendomateriales < item.cantidadpedidos &&
            item.maximofabricas !== maximoFabricas &&
            item.haciendofabricas < item.maximofabricas &&
            item.faltanecesita ?
                ordenArr :
                ordenAba;
    },
    desc: true
},{
    campo: 'profundidadpedidos',
    desc:  true
},{
    campo: 'faltamateriales',
    desc:  true
}];
const _getAcciones = () => [{
    texto: 'hacer',
    tag:   'accionHacerMaterial'
}];
const _getClaseFila = datos => {
    let clase;

    if (datos.stockmateriales >= datos.cantidadpedidos) {
        clase = 'bueno';
    } else if (datos.stockmateriales + datos.haciendomateriales >= datos.cantidadpedidos) {
        clase = 'medio';
    } else if (datos.haciendofabricas < datos.maximofabricas) {
        clase = 'malo';
    }

    if (clase === 'malo') {
        if (!datos.faltanecesita) {
            clase = 'nulo';
        }
    }

    return clase;
};

class PanelTablaInicioMateriales extends Component {
    static propTypes = {
        alto: React.PropTypes.number
    }
    handlerClickAcciones(tag) {
        if (typeof this[tag] === 'function') {
            this[tag].apply(this, arguments);
        }
    }
    accionHacerMaterial(tag, fila, tabla, panel) {
        const HACER_MATERIAL = 1;

        this.accion(this.hacerMaterial, [fila.props.datos.materialpedidos, HACER_MATERIAL], tabla);
    }

    render() {
        const { alto } = this.props;

        return (
            <PanelTabla
                ref="materiales"
                id="materiales"
                titulo="Materiales"
                url="http://localhost:3000/db"
                orden={_getOrden()}
                idCampo="materialpedidos"
                cols={_getCols()}
                acciones={_getAcciones()}
                claseFila={_getClaseFila}
                parseData={_parseData}
                onClickAcciones={this.handlerClickAcciones}
                filtros={false}
                alto={alto}
            />
        );
    }
}
/*
const mapStateToProps = state => {
    return {
        ...state.panelTablaInicio
    }
}
*/
// export default connect(mapStateToProps)(PanelTablaInicioMateriales)
export default PanelTablaInicioMateriales;
