import React from 'react';
import { connect } from 'react-redux';

import { getMapStateToProps } from './base';

import {
	fijarFiltroFila
} from '../actions/fila';

import Celda from './celda';
import Menu from './menu';

import { FIRST_INDEX } from '../constantes';

class Fila extends React.Component {
    static propTypes = {
        id:              React.PropTypes.string.isRequired,
        idCampo:         React.PropTypes.string.isRequired,
        filtroFijado:    React.PropTypes.string,
        datos:           React.PropTypes.object.isRequired,
        orden:           React.PropTypes.array,
        cols:            React.PropTypes.array.isRequired,
        acciones:        React.PropTypes.array.isRequired,
        anchos:          React.PropTypes.array.isRequired,
        guardar:         React.PropTypes.func,
        header:          React.PropTypes.bool,
        filtros:         React.PropTypes.bool,
        combosDataset:   React.PropTypes.object.isRequired,
        claseFila:       React.PropTypes.func,
        onResizeCelda:   React.PropTypes.func.isRequired,
        onChangeDesc:    React.PropTypes.func,
        onClickAcciones: React.PropTypes.func
    }
    handlerFiltroFijado(campo, celda) {
        const { dispatch, id } = this.props;

        dispatch(fijarFiltroFila(id, campo));
    }
    getIdFila() {
        const { datos, idCampo } = this.props;

        return datos[idCampo];
    }
    orden(campo) {
        const { orden } = this.props;

        if (orden) {
            const UP_CAMPO = 1;

            return orden.indice('campo', campo) + UP_CAMPO;
        }

        return undefined;
    }
    mostrarFiltro(campo) {
        const { header, filtroFijado } = this.props;

        return header && (!filtroFijado || campo === filtroFijado);
    }
    renderAcciones() {
        let ret;
        const {
			acciones,
			header,
			onClickAcciones,
			cols
		} = this.props;

        if (acciones.length) {
            if (header) {
                ret = <th key={cols.length}></th>;
            } else {
                ret = (
					<td key={cols.length}>
						<Menu children={acciones} accion={onClickAcciones}/>
					</td>);
            }
        }

        return ret;
    }
    renderCeldas() {
        const celdas = [];
        const {
			id,
			cols,
			header,
			datos,
			guardar,
			combosDataset,
			anchos,
			orden,
			filtros,
			onResizeCelda,
			onChangeDesc,
			onFiltrado,
			onClickCelda
		} = this.props;

        for (let i = FIRST_INDEX; i < cols.length; i++) {

            const col = cols[i];

            celdas.push(
				<Celda
					id={`${id}-${col.campo}`}
					key={i}
					datos={datos[col.campo]}
					campo={col.campo}
					guardar={guardar}
					onClick={onClickCelda}
					onChangeDesc={onChangeDesc}
					header={header}
					tipo={col.tipo}
					combosDataset={combosDataset}
					ancho={anchos[i]}
					orden={this.orden(col.campo)}
					ordenDesc={!!(this.orden(col.campo) && orden.desc)}
					filtro={filtros ?
                        col.filtro :
                        null}
					mostrarFiltro={this.mostrarFiltro}
					onFiltroFijado={this.handlerFiltroFijado}
					onFiltrado={onFiltrado}
					onResize={onResizeCelda}
				/>);
        }

        const acciones = this.renderAcciones();

        acciones && celdas.push(acciones);

        return celdas;
    }
    claseFila() {
        const { header, claseFila, datos } = this.props;

        let ret = header ?
            'header' :
            '';

        const newClaseFila = claseFila && claseFila(datos, this);

        if (newClaseFila) {
            ret += ` ${newClaseFila}`;
        }

        return ret;
    }
    render() {
        return (
			<tr className={this.claseFila()} >
				{this.renderCeldas()}
			</tr>
        );
    }
}

export default connect(getMapStateToProps('fila'))(Fila);
