import { combineReducers } from 'redux';

import app from './App';
import bd from './BD';
import panelTablaInicioMateriales from './PanelTablaInicioMateriales';
import panelTablaInicioPedidos from './PanelTablaInicioPedidos';
import panelTablaInicioNecesita from './PanelTablaInicioNecesita';
import panelTablaInicioPedido from './PanelTablaInicioPedido';
import panelNuevoPedido from './PanelNuevoPedido';

const rootReducer = combineReducers({
    app,
    bd,
    panelTablaInicioMateriales,
    panelTablaInicioPedidos,
    panelTablaInicioNecesita,
    panelTablaInicioPedido,
    panelNuevoPedido
});

export default rootReducer;
