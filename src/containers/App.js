import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import {
    cambiarContenido,
    dimensionar,
    setDialogo
} from '../actions/App';

import { cargarBD } from '../actions/BD';

import {
    ID_INICIO_MATERIALES,
    ID_INICIO_PEDIDOS,
    ID_INICIO_NECESITA,
    ID_INICIO_PEDIDO
//    ID_EXCEDENTE
} from '../actions/Tabla';

import PanelTablaInicioMateriales from './PanelTablaInicioMateriales';
import PanelTablaInicioPedidos from './PanelTablaInicioPedidos';
import PanelTablaInicioNecesita from './PanelTablaInicioNecesita';
import PanelTablaInicioPedido from './PanelTablaInicioPedido';
import PanelNuevoPedido from './PanelNuevoPedido';
import PanelExcedente from './PanelExcedente';
import ListaTablaFabricas from './ListaTablaFabricas';

import Menu from '../componentes/menu/Menu';
import Dialogo from '../componentes/ui/Dialogo';

/* Private functions */
const _getDefaultProps = () => ({
    menu: []
});
const _renderStyle = alto => alto ?
    {height: `${alto}px`} :
    {};
const _renderInicio = (alto, verPedido) => [
    <PanelTablaInicioMateriales key={ID_INICIO_MATERIALES} alto={alto} />,
    <PanelTablaInicioNecesita key={ID_INICIO_NECESITA} alto={alto} />,
    <PanelTablaInicioPedidos key={ID_INICIO_PEDIDOS} alto={alto} />
].concatenar(verPedido ?
[<PanelTablaInicioPedido
            key={ID_INICIO_PEDIDO}
            alto={alto}
            params={{ idTiposPedido: verPedido.idtipos_pedido }}
            titulo={verPedido.nombretipos_pedido}
        />] :
        []);
const _renderExcedente = alto => (
        <PanelExcedente
//            key={ID_EXCEDENTE}
            alto={alto}
        />
    );
const _renderNuevoPedido = () => (
        <PanelNuevoPedido
            ref="panel_nuevo_pedido"
        />
    );
const _renderListaTabla = contenido => contenido === 'fabricas' ?
    (
        <ListaTablaFabricas
            ref="panel_nuevo_pedido"
        />
    ) :
    null;
const _renderContenido = (contenido, alto, verPedido) => contenido === 'inicio' ?
    _renderInicio(alto, verPedido) :
    contenido === 'excedente' ?
        _renderExcedente(alto) :
        contenido === 'nuevo_pedido' ?
            _renderNuevoPedido() :
    _renderListaTabla(contenido);
    /* (
     <ListaTabla	id_campo={this.props.config[contenido].id_campo}
     url_editar={this.props.config[contenido].url_editar}
     url_crear={this.props.config[contenido].url_crear}
     url={this.props.config[contenido].url}
     cols={this.props.config[contenido].cols}
     eliminar={this.props.config[contenido].eliminar}
     key={contenido}
     ref={contenido}
     setDialogo={this.setDialogo}
     />
     ); */
const _renderDialogo = (dialogo, handlerDialogo) => dialogo ?
        <Dialogo
            titulo={dialogo.titulo}
            puedeCerrar={dialogo.puedeCerrar}
            contenido={dialogo.contenido}
            menu={dialogo.menu}
            accionMenu={dialogo.accionMenu}
            onClickCerrar={handlerDialogo}
        /> :
        null;


class App extends Component {
    /* Properties */
    static propTypes = {
        menu:      PropTypes.array.isRequired,
        alto:      PropTypes.number,
        verPedido: PropTypes.object,
        dialogo:   PropTypes.object
    }
    getDefaultProps: _getDefaultProps

    /* Lifecycle */
    componentWillMount() {
        const { dispatch } = this.props;

        dispatch(cargarBD());

        this.handlerAccionMenu = this.handlerAccionMenu.bind(this);
        this.handlerDialogo = this.handlerDialogo.bind(this);
    }
    componentDidMount() {
        this.dimensionar();
        window.onresize = () => {
            this.dimensionar();
        };
    }

    /* Handlers */
    handlerAccionMenu(tag) {
        const { dispatch } = this.props;

        dispatch(cambiarContenido(tag));
    }
    handlerDialogo(dialogo) {
        const { dispatch } = this.props;

        dispatch(setDialogo(dialogo || null));
    }

    /* Methods */
    dimensionar() {
        const { dispatch } = this.props;

        dispatch(dimensionar(ReactDOM.findDOMNode(this.refs.menu)));
    }

    /* Render */
    render() {
        const {
            menu,
            alto,
            contenido,
            verPedido,
            dialogo
        } = this.props;

        return (
        <div>
          <header>
            <Menu ref="menu" menu={menu} accion={this.handlerAccionMenu}/>
          </header>

         <main style={_renderStyle(alto)}>
            { _renderContenido(contenido, alto, verPedido) }
          </main>
          { _renderDialogo(dialogo, this.handlerDialogo) }

        </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state.app
});

export default connect(mapStateToProps)(App);
