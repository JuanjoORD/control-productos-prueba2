import React, { Component } from 'react'
import Grid from "../Utils/Grid";
import {standardActions} from "../Utils/Grid/StandardActions";
import LoadMask from "../Utils/LoadMask/LoadMask";

import './css/CatalogoLista.css'
import Mello from '../../../../assets/img/Mello.svg'

class CatalogoLista extends Component{
    componentDidMount = () => {
       
    }

    render(){            
        const { verVendedores, productosList, addToCarrito, carrito, substractFromCarrito } = this.props

        if(productosList == null){
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
                <center><h3>Listado de Productos</h3></center>
                <a 
                    className="btn btn-success mb-2 ml-3"
                    style={{color: 'white'}}
                    onClick={() => verVendedores()}
                >
                    Ver vendedores
                </a>
                <center>
                    <h4>Vendedor: {`${productosList.vendedor.first_name} ${productosList.vendedor.last_name}`}</h4>
                    <h4>Contacto: {productosList.vendedor.email}</h4>
                </center>

                <div className="row">
                    {
                        productosList.productos.map(producto => {
                            let disponible = producto.total
                            let enCarrito = producto.inCarrito

                            if(carrito.length > 0){
                                const elProducto = carrito.find(p => p.id === producto.id)                                
                                if(elProducto != undefined){
                                    disponible = producto.total - elProducto.inCarrito
                                    enCarrito = elProducto.inCarrito
                                }
                                else{
                                    enCarrito = 0
                                }
                            }                            

                            return(
                                <div id="container" key={producto.id}>		                
                                    <div className="product-details">
                                        
                                        <h1>{producto.nombre}</h1>

                                        <p className="information">
                                            Precio: Q {producto.precioVenta}<br/>
                                            Disponible: {disponible} <br/>
                                            En carrito: {enCarrito}
                                        </p>

                                        <div className="control mt-3 mb-3">                            
                                            <div className="boton d-flex justify-content-center">
                                                <a className="btn btn-success" 
                                                    data-toggle="tooltip" data-placement="top" title="Agregar al carrito" 
                                                    onClick={() => addToCarrito(producto)}
                                                >
                                                    <i className="material-icons">add_shopping_cart</i>
                                                </a>
                                                {
                                                    enCarrito>1 && 
                                                    <a className="btn btn-danger" 
                                                        data-toggle="tooltip" data-placement="top" title="Quitar uno" 
                                                        onClick={() => substractFromCarrito(producto)}
                                                    >
                                                        <i className="material-icons">remove_shopping_cart</i>
                                                    </a>
                                                }

                                                
                                            </div>
                                        </div>  
                                    </div>

                                    <div className="product-image">
                                        
                                        <img src={producto.foto ? producto.foto : Mello} 
                                            alt="Omar Dsoky"
                                        />
                                        <div className="info">
                                            <h2>Descripción</h2>
                                            <ul>
                                                <li>
                                                    {producto.descripcion}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                              
            </React.Fragment>
        )
    }
}

export default CatalogoLista