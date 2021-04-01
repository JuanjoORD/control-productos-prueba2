import React, { Component } from 'react'
import ProductoForm from './ProductoForm'

class ProductoCreate extends Component{
    state = {
        crear: true,
        foto: null
    }

    componentDidMount = () => {
        const {readProducto, match} = this.props
        const id = match.params.id
        if(id){
            this.setState({crear: false})
            readProducto(id)
        }        
    }

    setFoto = (foto) => {
        this.setState({foto})
    }

    createProducto = (data) => {
        const { registerProducto } = this.props
        registerProducto({...data, foto:null}, [{"file": this.state.foto, "name": "foto"}])
    }

    updateProducto = (data) => {
        const { updateProducto } = this.props
        updateProducto({...data, foto: null}, [{"file": this.state.foto, "name": "foto"}])
    }

    render(){
        console.log('props ProductoCreate:', this.props)

        const { oneData } = this.props
        const { crear } = this.state

        const actionProducto = crear ? this.createProducto : this.updateProducto;

        return(
            <React.Fragment>
                <h3>PRODUCTO</h3>
                <ProductoForm
                    onSubmit={actionProducto}
                    crear={crear}
                    oneData={oneData}
                    setFoto={this.setFoto}
                />
            </React.Fragment>
        )
    }
}

export default ProductoCreate