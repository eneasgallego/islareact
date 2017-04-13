import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { getMapStateToProps } from './base';

import {
	dimensionarAnchosTabla,
	dimensionarTabla,
	nuevaFilaTabla,
	cargarFilasTabla,
	marcarCargadoTabla,
	cargarCombosTabla
} from '../actions/tabla';

import Fila from './fila';
import Menu from './menu';

import {
	ORDER_EQUAL,
	UP_PROFUNDIDAD, INIT_PROFUNDIDAD,
	POS_TO_INSERT_SPLICE,
	FIRST_INDEX
} from '../constantes';

const _handlerClickCeldaHeader = (e, celda) => { e.preventDefault(); celda.changeOrden() };

class Tabla extends React.Component {
    static propTypes = {
        id:              React.PropTypes.string.isRequired,
        anchos:          React.PropTypes.array,
        alto:            React.PropTypes.number,
        altoTabla:       React.PropTypes.number,
        altoBody:        React.PropTypes.number,
        filasCargadas:   React.PropTypes.bool,
        cargando:        React.PropTypes.bool,
        filas:           React.PropTypes.array,
        combosDataset:   React.PropTypes.object,
        valFiltros:      React.PropTypes.object,
        filtros:         React.PropTypes.bool,
        velo:            React.PropTypes.bool,
        orden:           React.PropTypes.array.isRequired,
        cols:            React.PropTypes.array.isRequired,
        guardar:         React.PropTypes.func,
        parseData:       React.PropTypes.func.isRequired,
        url:             React.PropTypes.string,
        params:          React.PropTypes.object.isRequired,
        idCampo:         React.PropTypes.string.isRequired,
        style:           React.PropTypes.object.isRequired,
        acciones:        React.PropTypes.array.isRequired,
        claseFila:       React.PropTypes.func.isRequired,
        onClickAcciones: React.PropTypes.func.isRequired
    }
    componentDidUpdate() {
        if (this.isCombosCompletos()) {
            this.cargarFilas();
        } else {
            this.cargarCombos();
        }
    }
    componentWillReceiveProps(nextProps) {
        const { alto } = this.props;

        nextProps.alto !== alto && this.dimensionar(alto);
    }
    handlerResizeCelda(offset) {
        const { dispatch, id } = this.props;

        dispatch(dimensionarAnchosTabla(id, offset));
    }
    getValor() {
        return this.getFilas();
    }
    dimensionar(alto) {
        const { dispatch, id } = this.props;

        dispatch(dimensionarTabla(id, alto, ReactDOM.findDOMNode(this)));
    }
    nuevaFila() {
        const { dispatch, id, cols } = this.props;

        dispatch(nuevaFilaTabla(id, cols));
    }
    cargarFilas() {
        const {
			dispatch,
			id,
			filasCargadas,
			cargando,
			url,
			params,
			parseData
		} = this.props;

        if (url) {
            if (filasCargadas === false && cargando === false) {
                dispatch(cargarFilasTabla(id, url, params, parseData));
            }
        } else if (filasCargadas === false || cargando) {
            dispatch(marcarCargadoTabla(id));
        }
    }
    isCombosCompletos() {
        const { cols, combosDataset } = this.props;

        for (let i = FIRST_INDEX; i < cols.length; i++) {
            const col = cols[i];

            if (col.tipo.tipo === 'object') {
                if (combosDataset && !combosDataset[col.campo]) {
                    return false;
                }
            }
        }

        return true;
    }
    cargarCombos() {
        const { dispatch, id, cols, combosDataset } = this.props;

        dispatch(cargarCombosTabla(id, cols, combosDataset));
    }
    handlerClickCelda(e, celda) {
        e.preventDefault();
        if (!celda.props.header && this.props.guardar) {
            celda.setState({editar: true});
        }
    }
    handlerFiltrado(valor, field, filtrotabla, celda, fila) {
        let valFiltros = this.getFiltros();

        if (!valFiltros) {
            valFiltros = {};
        }
        let filtro = valFiltros[celda.props.campo];

        if (!filtro) {
            filtro = {
                campo: celda.props.campo
            };
        }
        filtro.valor = valor;
        valFiltros[celda.props.campo] = filtro;
        this.setState({valFiltros});
    }
    handlerOrdenar(orden, celda, fila) {

        let state = this.props.orden;

        let elOrden = state.buscar('campo', celda.props.campo);

        if (elOrden) {
            state = state.slice(elOrden);
            elOrden.desc = !elOrden.desc;
        } else {
            elOrden = {
                campo: celda.props.campo,
                desc:  orden < ORDER_EQUAL
            };
        }

        state.unshift(elOrden);

        this.setState(state);
    }
	/*	refrescar() {

		this.setState({
			filasCargadas: false
		}, ()=>{
			this.cargarFilas();
		})

	} */

    filtrar(fila) {
        const { valFiltros } = this.props;

        for (const key in valFiltros) {
            const filtro = valFiltros[key];

            if (filtro.valor) {
                if (typeof filtro.valor === 'string') {
                    if (!~`${fila[key]}`.toUpperCase().indexOf(`${filtro.valor}`.toUpperCase())) {
                        return false;
                    }
                } else if (typeof filtro.valor === 'object' && !filtro.valor.filtrar(fila[key])) {
                    return false;
                }
            }
        }

        return true;
    }

    renderMenu() {
        const { guardar } = this.props;

        if (guardar) {
            const menu = [{
                texto: 'NUEVO',
                tag:   'nuevo'
            }];

            return <Menu ref="menu" className="menu-tabla" children={menu} accion={this.nuevaFila}></Menu>;
        }

        return null;
    }
    renderFilas() {
        const ret = [];
        const {
			id,
			filas,
			cols,
			guardar,
			idCampo,
			acciones,
			claseFila,
			onClickAcciones,
			combosDataset,
			anchos
		} = this.props;

        if (filas) {
            for (let i = FIRST_INDEX; i < filas.length; i++) {

                const fila = filas[i];

                if (this.filtrar(fila)) {
                    const objFila =
						<Fila
							id={`${id}-${i}`}
							key={i}
							cols={cols}
							datos={fila}
							guardar={guardar}
							idCampo={idCampo}
							acciones={acciones}
							claseFila={claseFila}
							onResizeCelda={this.handlerResizeCelda.bind(this)}
							onClickCelda={this.handlerClickCelda}
							onClickAcciones={onClickAcciones}
							combosDataset={combosDataset || {}}
							anchos={anchos || []}
							filtros={false}
						/>;

                    if (this.props.orden.length) {
                        const ordenar = (datos, prof) => {
                            const orden = this.props.orden[prof];

                            if (orden) {
                                const { campo, desc } = orden;

                                let valor1, valor2;

                                if (typeof campo === 'function') {
                                    valor1 = campo(datos);
                                    valor2 = campo(fila);
                                } else {
                                    valor1 = parseFloat(datos[campo]);
                                    valor2 = parseFloat(fila[campo]);
                                }

                                valor1 = isNaN(valor1) ?
                                    datos[campo] :
                                    valor1;
                                valor2 = isNaN(valor2) ?
                                    fila[campo] :
                                    valor2;

                                return (valor1 === valor2 && ordenar(datos, prof + UP_PROFUNDIDAD)) ||
								(desc && valor1 < valor2) ||
								(!desc && valor1 > valor2);
                            }

                            return false;
                        };
                        const index = ret.indice((v, k) => ordenar(v.props.datos, INIT_PROFUNDIDAD));

                        ~index ?
                            ret.splice(index, POS_TO_INSERT_SPLICE, objFila) :
                            ret.push(objFila);
                    } else {
                        ret.push(objFila);
                    }
                }
            }
        }

        return ret;
    }
    renderVelo() {
        const { velo } = this.props;

        if (velo) {
            return (
				<div className="velo">
					<div className="velo-fondo" />
					<div className="velo-imagen" />
				</div>
            );
        }

        return null;
    }
    renderStyleBody() {
        const ret = {};
        const { altoBody } = this.props;

        if (altoBody) {
            ret.height = `${altoBody}px`;
        }

        return ret;
    }
    renderStyleTabla() {
        const ret = {};
        const { altoTabla } = this.props;

        if (altoTabla) {
            ret.height = `${altoTabla}px`;
        }

        return ret;
    }
    renderTabla() {
        const datosHeader = {};
        const {
			id,
			idCampo,
			cols,
			acciones,
			combosDataset,
			anchos,
			orden,
			filtros
		} = this.props;

        for (let i = FIRST_INDEX; i < cols.length; i++) {
            const col = cols[i];

            datosHeader[col.campo] = col.texto;
        }

        return (
			<div className="tabla-div" style={this.renderStyleTabla()}>
				<table className="tabla">
					<thead>
						<Fila
							id={`${id}-header`}
							header={true}
							cols={cols}
							datos={datosHeader}
							idCampo={idCampo}
							onResizeCelda={this.handlerResizeCelda.bind(this)}
							onClickCelda={_handlerClickCeldaHeader}
							onChangeDesc={this.handlerOrdenar}
							acciones={acciones}
							combosDataset={combosDataset || {}}
							orden={orden}
							anchos={anchos || []}
							filtros={filtros}
							onFiltrado={this.handlerFiltrado}
						/>
					</thead>
					<tbody style={this.renderStyleBody()}>
						{this.renderFilas()}
					</tbody>
				</table>
			</div>
        );
    }
    renderStyle() {
        const { alto, style } = this.props;

        const newStyle = {
            ...style
        };

        if (alto) {
            newStyle.height = `${alto}px`;
        }

        return newStyle;
    }
    render() {
        return (
			<div className="tabla-cont" style={this.renderStyle()}>
				{this.renderMenu()}
				{this.renderTabla()}
				{this.renderVelo()}
			</div>
        );
    }
}

export default connect(getMapStateToProps('tabla'))(Tabla);
