import React, { Component } from 'react'
//import LoteForm from './LoteForm'
import Mello from '../../../../assets/img/Mello.svg'

class ResultadosLista extends Component{

    render(){

        const { productos } = this.props        

        return(
            <React.Fragment>                
                {
                    productos.map(product => {
                        return(
                            <div className="card col-lg-6 col-md-12 col-sm-12" key={product.id}>
                                <img 
                                    className="card-img-top mt-2 w-25" 
                                    src={(product && product.foto) ? product.foto : Mello} 
                                    alt="Portada del curso" 
                                    width="500px"
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{`${product.nombre}`}</h5>
                                    <p className="card-text">{product.descripcion}</p>
                                    
                                    <span class="badge bg-primary"><h5>Precio:  Q{product.precioVenta}</h5></span> &nbsp;
                                    <span class="badge bg-primary"><h5>Vendido: Q{product.vendido}</h5></span>
                                </div>
                            </div>
                        )
                    })
                }
            </React.Fragment>
        )
    }
}

export default ResultadosLista