import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import {
    ID_INICIO_MATERIALES,
    cambiarOrdenTabla,
    cargarFilasTabla
} from '../actions/Tabla';

import PanelTabla from '../componentes/panel/PanelTabla';
import { parseCols } from '../utils/utils';

import getVistaNecesita from '../datos/VistaNecesita';

import { ORDER_UP, ORDER_DOWN } from '../utils/constantes';

/* Constanst */
const _ID = ID_INICIO_MATERIALES;

/* Private functions */
const _getDefaultProps = () => ({
    filas:    [],
    filtros:  [],
    orden:    [],
    cargando: false
});
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
        return item.stockmateriales < item.cantidadpedidos &&
            item.stockmateriales + item.haciendomateriales < item.cantidadpedidos &&
//            item.maximofabricas !== maximoFabricas &&
            item.haciendofabricas < item.maximofabricas &&
            item.faltanecesita ?
            ORDER_UP :
            ORDER_DOWN;
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
    /* Properties */
    static propTypes = {
        filas:    PropTypes.array.isRequired,
        filtros:  PropTypes.array.isRequired,
        orden:    PropTypes.array.isRequired,
        alto:     PropTypes.number,
        cargando: PropTypes.bool
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        const { dispatch } = this.props;

        dispatch(cambiarOrdenTabla(_ID, _getOrden()));
        dispatch(cargarFilasTabla(_ID, 'http://localhost:3000/db', {}, _parseData));
    }

    /* Handlers */
    handlerClickAcciones(tag) {
        if (typeof this[tag] === 'function') {
            this[tag].apply(this, arguments);
        }
    }
    accionHacerMaterial(tag, fila, tabla, panel) {
        const HACER_MATERIAL = 1;

        this.accion(this.hacerMaterial, [fila.props.datos.materialpedidos, HACER_MATERIAL], tabla);
    }

    /* Render */
    render() {
        const {
            filas,
            filtros,
            orden,
            alto,
            cargando
        } = this.props;

        return (
            <PanelTabla
                id={_ID}
                ref={_ID}
                titulo="Materiales"
                cols={_getCols()}
                filas={filas}
                filtros={filtros}
                orden={orden}
                claseFila={_getClaseFila}
                onClickAcciones={this.handlerClickAcciones}
                alto={alto}
                velo={cargando}
                acciones={_getAcciones()}
//                idCampo="materialpedidos"
            >
            </PanelTabla>
        );

    }
}

const mapStateToProps = state => ({
    ...state.panelTablaInicioMateriales
});

export default connect(mapStateToProps)(PanelTablaInicioMateriales);
