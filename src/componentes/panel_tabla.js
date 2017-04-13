import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { getMapStateToProps } from './base';

import {
	dimensionarPanelTabla
} from '../actions/panelTabla';

import Tabla from './tabla';

class PanelTabla extends React.Component {
    static propTypes = {
        id:        React.PropTypes.string.isRequired,
        titulo:    React.PropTypes.string.isRequired,
        idCampo:   React.PropTypes.string.isRequired,
        url:       React.PropTypes.string.isRequired,
        params:    React.PropTypes.object,
        orden:     React.PropTypes.array.isRequired,
        filtros:   React.PropTypes.bool,
        claseFila: React.PropTypes.func.isRequired,
        cols:      React.PropTypes.array.isRequired,
        acciones:  React.PropTypes.array.isRequired,
        alto:      React.PropTypes.number
    }
    componentWillReceiveProps(nextProps) {
        const { alto } = this.props;

        alto !== nextProps.alto && this.dimensionar(nextProps.alto);
    }

    dimensionar(alto) {
        const { dispatch, id } = this.props;

        dispatch(dimensionarPanelTabla(id, alto, ReactDOM.findDOMNode(this.refs.titulo)));
    }
    refrescar() {
        this.refs.tabla.refrescar();
    }

    renderStyleTabla() {
        const
            ret = {},
            { alto } = this.props;

        if (alto) {
            ret.height = `${alto}px`;
        }

        return ret;
    }
    renderTabla() {
        const {
			id,
			idCampo,
			url,
			parseData,
			claseFila,
			params,
			orden,
			filtros,
			cols,
			acciones,
			onClickAcciones,
			alto
		} = this.props;

        return <Tabla
			ref="tabla"
			id={id}
			style={this.renderStyleTabla()}
			idCampo={idCampo}
			url={url}
			parseData={parseData}
			params={params || {}}
			orden={orden}
			filtros={filtros}
			claseFila={claseFila}
			cols={cols}
			acciones={acciones}
			onClickAcciones={onClickAcciones}
			alto={alto}
		/>;
    }
    render() {
        const { id, titulo } = this.props;

        return (
			<section id={id} className="panel">
				<h2 ref="titulo">{titulo}</h2>
				{this.renderTabla()}
			</section>
        );
    }
}

export default connect(getMapStateToProps('panelTabla'))(PanelTabla);
