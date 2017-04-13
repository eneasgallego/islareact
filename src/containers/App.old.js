import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import {
    cargarDatasetTipopedidos,
    limpiarDatasetTipopedidosError,
//    cambiarPedidoVer,
    cambiarContenido,
    dimensionar,
    acciones
} from './actions/app';

import Menu from './componentes/menu';
import PanelTablaInicio from './PanelTablaInicio';
// import PanelTabla from './componentes/panel_tabla'
// import Panel from './componentes/panel'
// import ListaTabla from './componentes/lista_tabla'
import Dialogo from './componentes/dialogo';
// import Combo from './componentes/combo'
// import Boton from './componentes/boton'
// import { ajax } from './componentes/base'


class App extends Component {
    static propTypes = {
        menu: PropTypes.array.isRequired
    }

    componentDidMount() {
        this.dimensionar();

        window.onresize = e => {
            this.dimensionar();
        };
    }
    componentWillReceiveProps(props) {
        const {
        pedidoVer,
        dispatch,
        config,
        cargandoDatasetTipopedidos,
        datasetTipopedidos,
        contenido,
        alto
      } = this.props;

        if (pedidoVer !== props.pedidoVer) {
            this.refs.pedido.refs.tabla.refrescar();
            this.refs.pedido.dimensionar();
        }

        if (contenido !== props.contenido) {
            if (contenido === 'nuevo_pedido') {
                if (!cargandoDatasetTipopedidos && !datasetTipopedidos.length) {
                    dispatch(cargarDatasetTipopedidos(config.nuevo_pedido.tipopedido.url, config.nuevo_pedido.tipopedido.texto));
                }
            } else if (datasetTipopedidos.length) {
                dispatch(limpiarDatasetTipopedidosError());
            }
            this.dimensionar();
        }

        if (alto !== props.alto) {
            for (const i in this.refs) {
                const ref = this.refs[i];

                if (typeof ref.dimensionar === 'function') {
                    ref.dimensionar(alto);
                }
            }
        }
    }

    handlerAccionMenu(tag) {
        const { dispatch } = this.props;

        dispatch(cambiarContenido(tag));
    }
    handlerClickAcciones(tag) {
        if (typeof acciones[tag] === 'function') {
            acciones[tag].apply(this, arguments);
        }
    }

    dimensionar() {
        const { dispatch } = this.props;

        dispatch(dimensionar(ReactDOM.findDOMNode(this.refs.menu)));
    }

    renderStyle() {
        const ret = {};
        const { alto } = this.props;

        if (alto) {
            ret.height = `${alto}px`;
        }

        return ret;
    }
    renderContenido() {
        const { contenido, alto } = this.props;

        if (contenido === 'inicio') {
            return (
          <PanelTablaInicio
              ref="inicio"
              onClickAcciones={this.handlerClickAcciones}
              alto={alto}
          />);
        } else if (contenido === 'excedente') {

      // ret = this.renderExcedente();
        } else if (contenido === 'nuevo_pedido') {
      // ret = this.renderNuevoPedido();
        } else {
      /*
      ret = <ListaTabla	id_campo={this.props.config[this.state.contenido].id_campo}
          url_editar={this.props.config[this.state.contenido].url_editar}
          url_crear={this.props.config[this.state.contenido].url_crear}
          url={this.props.config[this.state.contenido].url}
          cols={this.props.config[this.state.contenido].cols}
          eliminar={this.props.config[this.state.contenido].eliminar}
          key={this.state.contenido}
          ref={this.state.contenido}
          setDialogo={this.setDialogo}
      />;
      */
        }

        return null;
    }
    renderDialogo() {
        const { dialogo } = this.props;

        if (dialogo) {
            return (
          <Dialogo
              titulo={dialogo.titulo}
              puedeCerrar={dialogo.puedeCerrar}
              contenido={dialogo.contenido}
              menu={dialogo.menu}
              accionMenu={dialogo.accionMenu}
              cerrarDialogo={this.setDialogo}
          />
            );
        }

        return null;
    }
    render() {
        const { menu } = this.props;

        return (
        <div>
          <header>
            <Menu ref="menu" children={menu} accion={this.handlerAccionMenu}/>
          </header>

          <main style={this.renderStyle()}>
            {this.renderContenido()}
          </main>
          {this.renderDialogo()}

        </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state.app
});

export default connect(mapStateToProps)(App);
