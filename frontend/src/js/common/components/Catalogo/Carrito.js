import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import LoadMask from "../Utils/LoadMask/LoadMask";
import { validate, validatorFromFunction, validators, combine } from 'validate-redux-form';
import {    
    renderField,
    renderNumber,
    renderDatePicker,
    renderDayPicker,
    renderFilePicker,
    renderTextArea
} from "../Utils/renderField/renderField";

import './css/CatalogoLista.css'
import Mello from '../../../../assets/img/Mello.svg'

class Carrito extends Component{
    componentDidMount = () => {
       
    }

    render(){            
        const { verVendedores, carrito, addToCarrito, substractFromCarrito, removeFromCarrito, handleSubmit } = this.props
        let elTotal = 0
        let cargando = true
        carrito.map(p => {
            elTotal += (p.inCarrito * p.precioVenta)
        })

        cargando = false
        
        if(cargando){
            return(
                <div className="col-12">
                    <LoadMask light loading={true} type={"Grid"}>
                        <div style={{ height: "200px", width:"100%"}}>Grid</div>
                    </LoadMask>
                </div>
            )
        }

        return(
            <React.Fragment>
                <center><h3>Su carrito</h3></center>
                <center>
                    <a 
                        className="btn btn-success mb-2 ml-3"
                        style={{color: 'white'}}
                        onClick={() => verVendedores()}
                    >
                        Ver vendedores
                    </a>                    
                </center>
                

                <div className="container">
                    <h1>Total: Q {elTotal}</h1>
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Imagen</th>
                                <th scope="col">Producto</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Sub Total</th>
                                <th scope="col">Existencia</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                carrito.length > 0
                                ?
                                    carrito.map(p =>{
                                        return(
                                            <tr key={p.id}>
                                                <td>
                                                    <img
                                                        src={p.foto ? p.foto : Mello}
                                                        alt="Imagen"
                                                        width="100px"
                                                    />
                                                </td>
                                                <td>{p.nombre}</td>
                                                <td>Q {p.precioVenta}</td>
                                                <td>
                                                    {
                                                        p.inCarrito > 1 &&
                                                        <span 
                                                            className="badge badge-secondary" 
                                                            onClick={() => substractFromCarrito(p)}
                                                            style={{cursor: "pointer"}}
                                                        >-</span>
                                                    }
                                                        &nbsp; {p.inCarrito} &nbsp;
                                                    <span 
                                                        className="badge badge-secondary" 
                                                        onClick={() => addToCarrito(p)}
                                                        style={{cursor: "pointer"}}
                                                    >+</span>
                                                </td>
                                                <td>Q {p.precioVenta * p.inCarrito}</td>
                                                <td>{p.total}</td>
                                                <td>
                                                    <a className="px-2" style={{cursor: "pointer", color: "#c4183c"}} onClick={() => removeFromCarrito(p.id)}>
                                                        <i className="material-icons">delete</i>
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    })
                                :
                                    <tr>
                                        <th colSpan="7">
                                            <center>No tiene productos en el carrito</center>
                                        </th>                                        
                                    </tr>
                            }
                        </tbody>
                    </table>

                    {
                        carrito.length > 0 &&
                        <form onSubmit={handleSubmit} className="col-12" >                
                            <div className="mb-4 card card-small">
                                <div className="border-bottom card-header"><h6 className="m-0">{`Datos del cliente`}</h6></div>                                               

                                <div className="p-0 pt-3 d-flex flex-column flex-md-row">
                                    <div className="form-group has-feedback flex-1 mx-3">
                                        <div className="form-group has-feedback">
                                            <label>Nombre</label>
                                            <Field name="nombreCliente" component={renderField} />
                                        </div>                               
                                    </div>

                                    <div className="form-group has-feedback flex-1 mx-3">
                                        <div className="form-group has-feedback">
                                            <label>NIT</label>
                                            <Field name="nit" component={renderField} />
                                        </div>                               
                                    </div>
                                </div>

                                <div className="p-0 pt-3 d-flex flex-column flex-md-row">
                                    <div className="form-group has-feedback flex-1 mx-3">
                                        <div className="form-group has-feedback">
                                            <label>Dirección</label>
                                            <Field name="direccionCliente" component={renderField} />
                                        </div>                               
                                    </div>

                                    <div className="form-group has-feedback flex-1 mx-3">
                                        <div className="form-group has-feedback">
                                            <label>Correo electronico</label>
                                            <Field name="correoCliente" component={renderField} />
                                        </div>                               
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-center mb-3">                            
                                    <button
                                        className={`btn btn-sm btn-primary`}
                                        type="submit"
                                    >
                                        Confirmar compra
                                    </button>
                                </div>                        
                            </div>
                        </form>
                    }                   
                </div>
                              
            </React.Fragment>
        )
    }
}

export default reduxForm({
    form: 'cliente_form',
    validate: (data) => {        
        return validate(data, {
            nombreCliente: validators.exists()('Este campo es requerido'),
            correoCliente: validators.exists()('Este campo es requerido'),
            direccionCliente: validators.exists()('Este campo es requerido'),
            nit: validators.exists()('Este campo es requerido'),
        }); 
    },
})(Carrito)