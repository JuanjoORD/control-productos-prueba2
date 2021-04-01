import React, { Component } from 'react'
import Grid from "../Utils/Grid";
import {standardActions} from "../Utils/Grid/StandardActions";
import LoadMask from "../Utils/LoadMask/LoadMask";

class ProductoList extends Component{
    componentDidMount = () => {
        const { listProducto } = this.props
        listProducto()
    }

    render(){            
        const {data, loader, deleteProducto} = this.props
        console.log("LOS PROPSITOS", this.props)
        if(data == null){
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
                <center><h3>Mis productos</h3></center>
                <a 
                    className="btn btn-primary mb-2"
                    href="/#/producto/register"
                >
                    Crear producto
                </a>
                <Grid hover striped data={data} loading={loader} >
                    <TableHeaderColumn                                              
                        dataSort
                        dataField="nombre"
                    >
                        Nombre
                    </TableHeaderColumn>

                    <TableHeaderColumn                                              
                        dataSort
                        dataField="descripcion"
                    >
                        Descripción
                    </TableHeaderColumn>

                    <TableHeaderColumn                                              
                        dataSort
                        dataField="total"
                    >
                        Cantidad total
                    </TableHeaderColumn>

                    <TableHeaderColumn                                              
                        dataSort
                        dataFormat={(cell, row)=>{
                            return `Q. ${row.precioCompra}`
                        }}
                    >
                        Costo de compra
                    </TableHeaderColumn>

                    <TableHeaderColumn                                              
                        dataSort
                        dataFormat={(cell, row)=>{
                            return `Q. ${row.precioVenta}`
                        }}
                    >
                        Precio a la venta
                    </TableHeaderColumn>
                   
                    <TableHeaderColumn
                        isKey
                        dataField="id"
                        dataAlign="center"
                        dataSort
                        dataFormat={standardActions({ editar: "producto", ver: "producto", lote: "producto", eliminar: deleteProducto })}
                    >
                    Acciones
                    </TableHeaderColumn>
                </Grid>                
            </React.Fragment>
        )
    }
}

export default ProductoList