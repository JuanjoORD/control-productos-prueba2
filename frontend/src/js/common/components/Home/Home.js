import React, { Component } from 'react'
import ResultadosLista from './ResultadosLista'

class Home extends Component{
    state = {
        crear: true,
        idProducto: null
    }

    componentDidMount = () => {
        const {misResultados} = this.props
        misResultados()
    }

    

    render(){
        console.log('props Home:', this.props)

        const { resultados } = this.props        

        return(
            <React.Fragment>
                <center><h3>Mis Resultados</h3></center>
                <div className="d-flex justify-content-center mt-2 mb-2">
                    <span class="badge bg-success"><h5>Total ventas:  Q{resultados.total}</h5></span> &nbsp;
                    <span class="badge bg-info"><h5>Precio promedio: Q{resultados.promedioPrecio}</h5></span>
                </div>
                <div className="card-deck">
                    <ResultadosLista
                        productos={resultados.porProducto}
                    />
                </div>
            </React.Fragment>
        )
    }
}

export default Home