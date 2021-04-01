import React, { Component } from 'react'
import Grid from "../Utils/Grid";
import {standardActions} from "../Utils/Grid/StandardActions";
import LoadMask from "../Utils/LoadMask/LoadMask";
import Factory from "../../../../assets/img/Factory.svg"

class LoteList extends Component{
    state = {
        idProducto: null
    }
    componentDidMount = () => {
        const { listLote, match } = this.props
        const idProducto = match.params.id
        listLote(idProducto)
        this.setState({idProducto})
    }

    formatDate = (fechaHora) => {
        let fechaUs = fechaHora.slice(0, 10)
        let fechaArray = fechaUs.split("-")
        const fecha = `${fechaArray[2]}-${fechaArray[1]}-${fechaArray[0]}`
        return fecha
    }

    render(){            
        const {data, loader, deleteLote, productData} = this.props

        if(data === null || data === undefined || productData === null){
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
                <div className="card mt-2">
                    <div className="card-header">
                        Producto: &nbsp; {productData.nombre}
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-4">
                                <img src={productData.foto ? productData.foto : Factory} alt="Portada" className="w-50" />
                            </div>
                            <div className="col-lg-8">
                                <h5 className="card-title">Se compró en: Q.{productData.precioCompra} --- Se vende en: Q.{productData.precioVenta}</h5>
                                <p className="card-text">{productData.descripcion}</p>
                                <a href="/#/producto" className="btn btn-secondary">Regresar</a>
                            </div>
                        </div>
                    </div>
                </div>

                <center><h3>Lotes</h3></center>
                <a 
                    className="btn btn-primary mb-2"
                    href={`/#/producto/${productData.id}/lotes/register`}
                >
                    Nuevo lote
                </a>
                <Grid hover striped data={data} loading={loader} >
                    <TableHeaderColumn                                              
                        dataSort
                        dataField="numeroLote"
                    >
                        No. Lote
                    </TableHeaderColumn>

                    <TableHeaderColumn                                              
                        dataSort
                        dataField="cantidad"
                    >
                        Cantidad
                    </TableHeaderColumn>

                    <TableHeaderColumn                                              
                        dataSort
                        dataFormat={(cell, row)=>{
                            return this.formatDate(row.fechaVencimiento)
                        }}
                    >
                        Fecha de vencimiento
                    </TableHeaderColumn>
                   
                    <TableHeaderColumn
                        isKey
                        dataField="id"
                        dataAlign="center"
                        dataSort
                        dataFormat={standardActions({ editar: "lotes", ver: "lotes", idProducto: productData.id, eliminar: deleteLote })}
                    >
                    Acciones
                    </TableHeaderColumn>
                </Grid>                
            </React.Fragment>
        )
    }
}

export default LoteList