import React, { Component } from 'react'
import VendedoresLista from './VendedoresLista'
import CatalogoLista from './CatalogoLista'
import Carrito from './Carrito'
import Swal from 'sweetalert2'

import './css/Catalogo.css'

class Catalogo extends Component{
    state = {
        crear: true,
        verVendedores: true,
        verCatalogo: false,
        verCarrito: false,
        carrito: [],
        comprador: {}
    }

    componentDidMount = () => {
        const {listVendedores, elCarrito, getCliente } = this.props        
        listVendedores()
        getCliente()
        this.setState({carrito: elCarrito})
    }

    componentDidUpdate = (prevProps) => {        
        if(this.props.vendedoresList != prevProps.vendedoresList){

        }
    }

    componentWillUnmount = () => {
        const { setElCarrito } = this.props
        setElCarrito(this.state.carrito)
    }

    setCatalogo = (profileId) => {        
        const { listProductBySeller } = this.props
        listProductBySeller(profileId)
        this.setState({verVendedores: false, verCarrito: false, verCatalogo: true})
    }

    setVendedores = () => {      
        const {listVendedores } = this.props        
        listVendedores()  
        this.setState({verVendedores: true, verCarrito: false, verCatalogo: false})
    }

    setCarrito = () => {      
        this.setState({verVendedores: false, verCarrito: true, verCatalogo: false})
    }

    addToCarrito = (producto) => {
        if(this.state.carrito.length>0){            
            const isInCarrito = this.state.carrito.find(p => p.id === producto.id)
            let miCarrito = []

            if(isInCarrito == undefined){
                producto.inCarrito = 1               
                miCarrito = [...this.state.carrito, producto]
            }
            else{
                console.log("ESTA EN CARRITO")
                miCarrito = this.state.carrito.map(p => {
                    if(p.id === producto.id){                        
                        let nextValue = Number(p.inCarrito) + 1
                        if(nextValue <= producto.total){
                            p = {...p, inCarrito: nextValue}
                        }
                        else{
                            Swal.fire({
                                title: 'Lo siento',
                                text: 'El producto que escoge ya no tiene suficiente cantidad, para cubrir su pedido',
                                type: 'info',                                
                                confirmButtonText: 'Ok, gracias',
                                allowOutsideClick: false
                            })
                        }
                    }
                    return p
                })                
            }
            this.setState({carrito: miCarrito})
        }
        else{            
            producto.inCarrito = 1
            this.setState({carrito: [producto]})
        }
    }

    substractFromCarrito = (producto) => {
        const isInCarrito = this.state.carrito.find(p => p.id === producto.id)
        let miCarrito = []
        miCarrito = this.state.carrito.map(p => {
            if(p.id === producto.id){                        
                let nextValue = Number(p.inCarrito) - 1
                if(nextValue >= 0){
                    p = {...p, inCarrito: nextValue}
                }
            }
            return p
        })        
        
        this.setState({carrito: miCarrito})
    }

    removeFromCarrito = (productoId) => {
        let miCarrito = this.state.carrito.filter(p => {
            return p.id != productoId
        })
        this.setState({carrito: miCarrito})
    }

    confirmarCompra = (cliente) => {
        console.log("confirmar compra front", cliente)
        const { confirmarCompra } = this.props
        const data = {
            cliente,
            detalle: this.state.carrito
        }
        confirmarCompra(data).then(x => {
            if(x){
                this.setVendedores()
                this.setState({carrito: []})
            }
        })
    }

    render(){
        console.log('props Catalogo:', this.props)
        const token = localStorage.getItem("token");
        const { vendedoresList, productosList } = this.props
        const { verCarrito, verCatalogo, verVendedores } = this.state        

        console.log('token Catalogo:', token)

        return(
            <div className="blue-gradient-bg" >                
                {
                    token == null ?
                        <React.Fragment>
                            <nav className="navbar navbar-dark bg-dark">
                                <a className="navbar-brand" href="/#/login">Login</a>                            
                                <div>                               
                                    <span className="navbar-text">
                                        CATALOGO
                                    </span>
                                </div>
                            </nav>
                            <center>
                                <button
                                    className="btn btn-success"
                                    onClick={() => this.setCarrito()}
                                >
                                    Ver el carrito
                                </button>
                            </center>
                        </React.Fragment>                        
                    :
                        <React.Fragment>
                            <center><h2 className="mt-2">Catálogo</h2></center>
                            <center>
                                <button
                                    className="btn btn-success"
                                    onClick={() => this.setCarrito()}
                                >
                                    Ver el carrito
                                </button>
                            </center>
                        </React.Fragment>
                }                                
                {
                    verVendedores &&
                    <VendedoresLista
                        vendedoresList={vendedoresList}
                        verCatalogo={this.setCatalogo}
                    />
                }
                {
                    verCatalogo &&
                    <CatalogoLista
                        verVendedores={this.setVendedores}
                        addToCarrito={this.addToCarrito}
                        substractFromCarrito={this.substractFromCarrito}
                        productosList={productosList}
                        carrito={this.state.carrito}
                    />
                }
                {
                    verCarrito && 
                    <React.Fragment>
                        <Carrito
                            verVendedores={this.setVendedores}
                            addToCarrito={this.addToCarrito}
                            substractFromCarrito={this.substractFromCarrito}
                            removeFromCarrito={this.removeFromCarrito}
                            onSubmit={this.confirmarCompra}
                            carrito={this.state.carrito}
                        />
                        
                    </React.Fragment>
                }

            </div>
        )
    }
}

export default Catalogo