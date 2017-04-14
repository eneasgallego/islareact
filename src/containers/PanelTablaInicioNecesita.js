import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import {
    ID_INICIO_NECESITA,
    cambiarOrdenTabla,
    cargarFilasTabla
} from '../actions/Tabla';

import PanelTabla from '../componentes/panel/PanelTabla';
import { parseCols } from '../utils/utils';

import getVistaNecesita from '../datos/VistaNecesita';

import { NO_NECESITA } from '../utils/constantes';

/* Constanst */
const _ID = ID_INICIO_NECESITA;

/* Private functions */
const _getDefaultProps = () => ({
    filas:    [],
    filtros:  [],
    orden:    [],
    cargando: false
});
const _parseData = data => {
    const vistaNecesita = getVistaNecesita(data,item => item.stockmateriales < item.cantidadpedidos, true);

    const ret = vistaNecesita.filter(item => item.haciendomateriales > NO_NECESITA);

    return ret;
};
const _getCols = () => parseCols([{
    texto: 'PROF',
    campo: 'profundidadpedidos'
}, {
    texto: 'MATERIAL',
    campo: 'nombremateriales'
}, {
    texto: 'HACIENDO',
    campo: 'haciendomateriales'
}, {
    texto: 'FABRICA',
    campo: 'nombrefabricas'
}]);
const _getOrden = () => [{
    campo: 'profundidadpedidos',
    desc:  true
},{
    campo: 'haciendomateriales',
    desc:  true
}];
const _getAcciones = () => [{
    texto: 'recoger',
    tag:   'accionRecogerMaterial'
},{
    texto: 'todo',
    tag:   'accionRecogerTodoMaterial'
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

class PanelTablaInicioNecesita extends Component {
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
                titulo="Necesita"
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
    ...state.panelTablaInicioNecesita
});

export default connect(mapStateToProps)(PanelTablaInicioNecesita);
