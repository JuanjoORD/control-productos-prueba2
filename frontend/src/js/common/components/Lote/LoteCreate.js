import React, { Component } from 'react'
import LoteForm from './LoteForm'

class LoteCreate extends Component{
    state = {
        crear: true,
        idProducto: null
    }

    componentDidMount = () => {
        const {readLote, match} = this.props
        const idProducto = match.params.id
        const idLote = match.params.idLote
        if(idLote){
            this.setState({crear: false, idProducto})
            readLote(idLote)
        }
        else{
            this.setState({idProducto})
        }
    }

    setFoto = (foto) => {
        this.setState({foto})
    }

    createLote = (data) => {
        const { registerLote } = this.props
        registerLote({...data, producto: this.state.idProducto})
    }

    udpateLote = (data) => {
        const { updateLote } = this.props
        updateLote(data)        
    }

    render(){
        console.log('props LoteCreate:', this.props)

        const { oneData } = this.props
        const { crear } = this.state

        const actionLote = crear ? this.createLote : this.udpateLote;

        return(
            <React.Fragment>
                <h3>LOTE</h3>
                <LoteForm
                    onSubmit={actionLote}
                    oneData={oneData}
                    crear={this.state.crear}
                    idProducto={this.state.idProducto}
                />
            </React.Fragment>
        )
    }
}

export default LoteCreate