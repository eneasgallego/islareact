import React from 'react';

import Tabla from './tabla';
import { parseCols, ajax } from './base';

import { POS_TO_DELETE_SPLICE, FIRST_INDEX, INIT_ID } from '../constantes';

class ListaTabla extends React.Component {
    componentWillMount() {
        this.guardar = this.guardar.bind(this);
        this.onClickAcciones = this.onClickAcciones.bind(this);
        this.dimensionar = this.dimensionar.bind(this);

        this.setState({
            filas: []
        });
    }
    componentDidMount() {
        this.props.onLoad(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            cols: parseCols(nextProps.cols)
        });
    }
    dimensionar(alto) {
        this.refs.tabla.dimensionar(alto);
    }
    acciones() {
        if (this.props.eliminar) {
            return [{
                texto: 'Eliminar',
                tag:   'eliminar'
            }];
        }

        return [];
    }
    onClickAcciones(tag) {
        const fn = this[tag];

        if (typeof fn === 'function') {
            fn.apply(this, arguments);
        }
    }
    getValor() {
        return this.refs.tabla.getValor();
    }
    eliminar(_tag, fila, tabla) {
        const id = fila.getIdFila();

        if (id) {
            this.props.setDialogo({
                titulo:      'Eliminar',
                puedeCerrar: false,
                contenido:   '¿Seguro de querer eliminar la fila?',
                menu:        [{
                    texto: 'Aceptar',
                    tag:   'aceptar'
                }, {
                    texto: 'Cancelar',
                    tag:   'cancelar'
                }],
                accionMenu: tag => {
                    if (tag === 'aceptar') {
                        const eliminar = () => {
                            const filas = tabla.state.filas.slice();
                            const indice = filas.indice(item => item[this.props.id_campo] === id);

                            if (~indice) {
                                filas.splice(indice, POS_TO_DELETE_SPLICE);
                                tabla.setState({filas});
                            }
                            this.props.setDialogo();
                        };

                        if (this.props.persistir) {
                            ajax({
                                metodo:  'delete',
                                url:     `${this.props.url}/${id}`,
                                success: eliminar
                            }, tabla);
                        } else {
                            eliminar();
                        }
                    } else if (tag === 'cancelar') {
                        this.props.setDialogo();
                    }
                }
            });
        }
    }
    guardar(valor, field, celda, fila, tabla) {
        if (this.props.persistir) {
            const id = fila.getIdFila();
            const { campo } = celda.props;
            const { params } = fila.props;

            params[campo] = valor;
            let { url } = this.props;
            let metodo = 'post';

            const fn = response => {
                const filas = tabla.state.filas.slice();
                const indice = filas.indice(item => item[this.props.id_campo] === id);

                if (~indice) {
                    const datos = filas[indice];

                    if (metodo === 'post') {
                        datos[this.props.id_campo] = response[this.props.id_campo];
                    }
                    datos[campo] = valor;
                    filas[indice] = datos;
                    tabla.setState({filas});
                }
            };

            if (id) {
                for (let i = FIRST_INDEX; i < this.state.cols.length; i++) {
                    const col = this.state.cols[i];

                    if (col.campo && col.campo !== campo) {
                        params[col.campo] = fila.props.datos[col.campo];
                    }
                }
                url += `/${id}`;
                metodo = 'put';
            }

            ajax({
                metodo,
                url,
                params,
                success: fn
            }, tabla);
        } else {
            const id = fila.getIdFila();
            const { campo } = celda.props;
            const params = fila.props.datos;

            params[campo] = valor;
            if (id) {
                for (let i = FIRST_INDEX; i < this.state.cols.length; i++) {
                    const col = this.state.cols[i];

                    if (col.campo && col.campo !== campo) {
                        params[col.campo] = fila.props.datos[col.campo];
                    }
                }
            }

            const filas = tabla.state.filas.slice();
            const indice = filas.indice(item => item[this.props.id_campo] === id);

            if (~indice) {
                const datos = filas[indice];

                if (!id) {
                    const generarId = () => {
                        let nuevoId = INIT_ID;

                        while (~filas.indice('id', nuevoId)) {
                            nuevoId++;
                        }

                        return nuevoId;
                    };

                    datos[this.props.id_campo] = generarId();
                }
                datos[campo] = valor;
                filas[indice] = datos;
                tabla.setState({filas});
            }
        }
    }
    render() {
        return (
			<Tabla
				ref="tabla"
				id_campo={this.props.id_campo}
				guardar={this.guardar}
				url={this.props.url}
				cols={this.state.cols}
				acciones={this.acciones()}
				onClickAcciones={this.onClickAcciones}
			/>
        );
    }
}
ListaTabla.defaultProps = {
    cols:      [],
    id_campo:  '',
    url:       '',
    eliminar:  false,
    persistir: true,
    onLoad() { /* do nothing */ },
    setDialogo() { /* do nothing */ }
};

export default ListaTabla;

