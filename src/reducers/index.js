import { combineReducers } from 'redux';

import app from './App';
import bd from './BD';
import panelTablaInicioMateriales from './PanelTablaInicioMateriales';
import panelTablaInicioPedidos from './PanelTablaInicioPedidos';
import panelTablaInicioNecesita from './PanelTablaInicioNecesita';
import panelTablaInicioPedido from './PanelTablaInicioPedido';
import panelExcedente from './PanelExcedente';
import panelNuevoPedido from './PanelNuevoPedido';
import listaFabricas from './ListaFabricas';
import listaMateriales from './ListaMateriales';
import listaMaterialesNecesita from './ListaMaterialesNecesita';
import listaPedidos from './ListaPedidos';
import listaTiposPedido from './ListaTiposPedido';

const rootReducer = combineReducers({
    app,
    bd,
    panelTablaInicioMateriales,
    panelTablaInicioPedidos,
    panelTablaInicioNecesita,
    panelTablaInicioPedido,
    panelExcedente,
    panelNuevoPedido,
    listaFabricas,
    listaMateriales,
    listaMaterialesNecesita,
    listaPedidos,
    listaTiposPedido
});

export default rootReducer;
