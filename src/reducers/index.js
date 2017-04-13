import { combineReducers } from 'redux';
import app from './app';
import panelTabla from './panelTabla';
import tabla from './tabla';
import fila from './fila';
import celda from './celda';

const rootReducer = combineReducers({
    app,
    panelTabla,
    tabla,
    fila,
    celda
});

export default rootReducer;
