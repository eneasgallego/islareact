import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

import { renderStyleAlto, emptyFunction } from '../../utils/utils';

import Tabla from '../tabla/Tabla';

/* Private functions */
const _getDefaultProps = () => ({
    id:              '',
    titulo:          '',
    cols:            [],
    filas:           [],
    filtros:         [],
    orden:           [],
    claseFila:       emptyFunction,
    onClickAcciones: emptyFunction,
    velo:            false,
    puedeFiltrar:    false
});
const _getInitialState = () => ({
    altoTabla: undefined
});

class PanelTabla extends Component {
    /* Properties */
    static propTypes = {
        id:              PropTypes.string.isRequired,
        titulo:          PropTypes.string.isRequired,
        cols:            PropTypes.array.isRequired,
        filas:           PropTypes.array.isRequired,
        filtros:         PropTypes.array.isRequired,
        orden:           PropTypes.array.isRequired,
        claseFila:       PropTypes.func.isRequired,
        onClickAcciones: PropTypes.func.isRequired,
        alto:            PropTypes.number,
        velo:            PropTypes.bool,
        acciones:        PropTypes.array,
        onCambiaOrden:   PropTypes.func,
        puedeFiltrar:    PropTypes.bool,
        onFiltrado:      PropTypes.func,
        onLimpiarFiltro: PropTypes.func
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        this.setState(_getInitialState());
    }
    componentDidMount() {
        this.dimensionar();
        window.onresize = () => {
            this.dimensionar();
        };
    }
    componentWillReceiveProps(nextProps) {
        const { alto } = this.props;

        alto !== nextProps.alto && this.dimensionar();
    }

    /* Methods */
    dimensionar() {
        const dom = ReactDOM.findDOMNode(this);
        const domT = ReactDOM.findDOMNode(this.refs.titulo);

        this.setState({altoTabla: dom.offsetHeight - domT.offsetHeight});
    }

    /* Render */
    render() {
        const {
            id,
            titulo,
            cols,
            filas,
            filtros,
            orden,
            claseFila,
            onClickAcciones,
            velo,
            acciones,
            onCambiaOrden,
            puedeFiltrar,
            onFiltrado,
                onLimpiarFiltro
        } = this.props,
            { altoTabla } = this.state;

        return (
            <section id={id} className="panel">
                <h2 ref="titulo">{titulo}</h2>
                <Tabla
                    ref="tabla"
                    style={renderStyleAlto(altoTabla)}
                    alto={altoTabla}
                    cols={cols}
                    filas={filas}
                    filtros={filtros}
                    orden={orden}
                    claseFila={claseFila}
                    onClickAcciones={onClickAcciones}
                    velo={velo}
                    acciones={acciones}
                    onCambiaOrden={onCambiaOrden}
                    puedeFiltrar={puedeFiltrar}
                    onFiltrado={onFiltrado}
                    onLimpiarFiltro={onLimpiarFiltro}
//        id_campo={this.props.id_campo}
//        url={this.props.url}
//        parseData={this.parseData}
//        params={this.props.params}
//        onResize={this.onResizeTabla}
                />
            </section>
        );
    }
}

export default PanelTabla;
