import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import './acciones.css';
import Swal from 'sweetalert2';


class Acciones extends Component {
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
        const { id, ver, editar, eliminar, lote, data } = this.props;        
        const miPath = window.location.hash == "#/producto" ? true : false        

        return (
            <div className="d-flex justify-content-center">
                {(lote !== undefined) && (
                    <Link style={{cursor: "pointer", color: "#256428"}} to={`${lote}/${id}/lotes`} ><i className="material-icons">line_weight</i></Link>
                )}
                {(ver !== undefined) && (
                    <Link to={`${ver}/${id}/`} className="px-2" ><i className="material-icons">remove_red_eye</i></Link>
                )}
                {(editar !== undefined) && (
                    <Link className="text-warning" to={`${editar}/${id}/editar`} ><i className="material-icons">edit</i></Link>
                )}
                {
                    (miPath)
                    ?
                        (data.total === null) &&
                        (eliminar !== undefined) && (
                            <a className="px-2" style={{cursor: "pointer", color: "#c4183c"}} onClick={this.eliminar(id)}><i className="material-icons">delete</i></a>
                        )
                        
                    :
                    (eliminar !== undefined) && (
                        <a className="px-2" style={{cursor: "pointer", color: "#c4183c"}} onClick={this.eliminar(id)}><i className="material-icons">delete</i></a>
                    )
                }                
            </div>
        );
    }
}
Acciones.propTypes = {
};

export function standardActions(acciones) {
    return (cell, row) => {
        return ( <Acciones id={cell} data={row} {...acciones}/> )
    };
}
