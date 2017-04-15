import { combineReducers } from 'redux';

import app from './App';
import panelTablaInicioMateriales from './PanelTablaInicioMateriales';
import panelTablaInicioPedidos from './PanelTablaInicioPedidos';
import panelTablaInicioNecesita from './PanelTablaInicioNecesita';
import panelTablaInicioPedido from './PanelTablaInicioPedido';
// import tabla from './tabla';
// import fila from './fila';
// import celda from './celda';


const rootReducer = combineReducers({
    app,
    panelTablaInicioMateriales,
    panelTablaInicioPedidos,
    panelTablaInicioNecesita,
    panelTablaInicioPedido
});

export default rootReducer;
