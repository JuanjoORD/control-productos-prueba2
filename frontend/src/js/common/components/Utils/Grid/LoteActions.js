import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import './acciones.css';
import Swal from 'sweetalert2';


class AccionesLote extends Component {
    constructor(props) {
        super(props);
    }

    eliminar = (id) => {
        return () => {
            Swal.fire({
                title: '¿Eliminar?',
                text: '¡No podrá revertir esta acción!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí, eliminar!',
                cancelButtonText: 'No, cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    this.props.eliminar(id);
                }
            });
        }
    };

    render() {
        const { id, ver, editar, eliminar, idProducto } = this.props;

        return (
            <div className="d-flex justify-content-center">
                {(ver !== undefined) && (
                    <Link to={`producto/${idProducto}/${ver}/${id}/`} className="px-2" ><i className="material-icons">remove_red_eye</i></Link>
                )}
                {(editar !== undefined) && (
                    <Link className="text-warning" to={`producto/${idProducto}/${editar}/${id}/editar`} ><i className="material-icons">edit</i></Link>
                )}
                {(eliminar !== undefined) && (
                    <a className="px-2" style={{cursor: "pointer", color: "#c4183c"}} onClick={this.eliminar(id)}><i className="material-icons">delete</i></a>
                )}
            </div>
        );
    }
}
AccionesLote.propTypes = {
};

export function loteActions(acciones) {
    return (cell, row) => {
        return ( <AccionesLote id={cell} {...acciones}/> )
    };
}
