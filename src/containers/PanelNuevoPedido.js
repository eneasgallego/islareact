import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import { parseCols } from '../utils/utils';

import {
    initState,
    cambiarTipoNuevoPedido,
    nuevaFilaNuevoPedido,
    cambiarValorTablaNuevoPedido,
    eliminarFilaTablaNuevoPedido
} from '../actions/PanelNuevoPedido';

import { crearNuevoPedido } from '../actions/BD';

import Panel from '../componentes/panel/Panel';

import ListaTabla from '../componentes/tabla/ListaTabla';

import Combo from '../componentes/ui/Combo';
import Boton from '../componentes/ui/Boton';

/* Private functions */
const _getDefaultProps = () => ({
    ...initState(),
    combosDataset: {}
});
const _getIdTipoPedido = nuevoPedido => nuevoPedido && nuevoPedido.tipoPedido && nuevoPedido.tipoPedido.idTipoPedido;
const _getCols = () => parseCols([{
    texto: 'MATERIAL',
    campo: 'materialpedidos',
    tipo:  {
        tipo:    'object',
        dataset: 'materiales',
        id:      'id',
        texto:   'nombremateriales'
    }
},{
    texto: 'CANTIDAD',
    campo: 'cantidadpedidos',
    tipo:  'int'
}]);

class PanelNuevoPedido extends Component {
    /* Properties */
    static propTypes = {
        combosDataset: PropTypes.object.isRequired,
        nuevoPedido:   PropTypes.object.isRequired
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.handlerChangeCombo = this.handlerChangeCombo.bind(this);
        this.handlerNuevaFila = this.handlerNuevaFila.bind(this);
        this.handlerCambiaEditar = this.handlerCambiaEditar.bind(this);
        this.handlerEliminar = this.handlerEliminar.bind(this);
        this.handlerNuevoPedido = this.handlerNuevoPedido.bind(this);
    }

    /* Handlers */
    handlerChangeCombo(valor) {
        const { dispatch, combosDataset } = this.props;

        dispatch(cambiarTipoNuevoPedido(combosDataset.tipos_pedido.buscar('id', parseInt(valor, 10))));
    }
    handlerNuevaFila() {
        const { dispatch } = this.props;

        dispatch(nuevaFilaNuevoPedido(_getCols()));
    }
    handlerCambiaEditar(valor, campo, index) {
        const { dispatch } = this.props;

        dispatch(cambiarValorTablaNuevoPedido(valor, campo, index));
    }
    handlerEliminar(index) {
        const { dispatch } = this.props;

        dispatch(eliminarFilaTablaNuevoPedido(index));
    }
    handlerNuevoPedido() {
        const { dispatch, nuevoPedido } = this.props;

        dispatch(crearNuevoPedido(nuevoPedido));
    }

    /* Render */
    renderContenidoNuevoPedido() {
        const {
            nuevoPedido,
            combosDataset
        } = this.props;

        return combosDataset.tipos_pedido.length ?
        [
            <Combo
                key="tipopedido"
                ref="tipopedido"
                titulo="Tipo"
                valor={_getIdTipoPedido(nuevoPedido)}
                onChange={this.handlerChangeCombo}
                campoId="id"
                campoTexto="nombretipos_pedido"
                dataset={combosDataset.tipos_pedido}
                onLoad={this.dimensionar}
            />,
            <Boton
                key="aceptar"
                texto="ACEPTAR"
                onClick={this.handlerNuevoPedido}
            />,
            <ListaTabla
                key="tabla_nuevo_pedido"
                ref="tabla_nuevo_pedido"
                cols={_getCols()}
                filas={nuevoPedido.filas}
                onClickNuevo={this.handlerNuevaFila}
                combosDataset={combosDataset}
                eliminar
                onCambiaEditar={this.handlerCambiaEditar}
                onEliminar={this.handlerEliminar}
//                id_campo={this.props.config.nuevo_pedido.tabla.id_campo}
//                url={this.props.config.nuevo_pedido.tabla.url}
//                eliminar={this.props.config.nuevo_pedido.tabla.eliminar}
//                setDialogo={this.setDialogo}
//                onResizeFila={this.onResizeFilaNuevoPedido}
//                onLoad={this.dimensionar}
//                persistir={false}
            />
        ] :
            null;
    }
    render() {
        return (
            <Panel
                ref="panel_nuevo_pedido"
                className="panel_nuevo_pedido"
//                dimensionar={this.dimensionarNuevoPedido}
            >
                {this.renderContenidoNuevoPedido()}
            </Panel>
        );
    }
}

const mapStateToProps = state => ({
    ...state.panelNuevoPedido,
    combosDataset: state.bd
});

export default connect(mapStateToProps)(PanelNuevoPedido);
