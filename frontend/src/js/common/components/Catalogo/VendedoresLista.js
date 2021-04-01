import React, { Component } from 'react'
import Grid from "../Utils/Grid";
import {standardActions} from "../Utils/Grid/StandardActions";
import LoadMask from "../Utils/LoadMask/LoadMask";

import AvatarMale from '../../../../assets/img/AvatarMale.svg'
import AvatarFemale from '../../../../assets/img/AvatarFemale.svg'

import './css/VendedoresLista.css'

class VendedoresLista extends Component{
    componentDidMount = () => {
       
    }

    render(){            
        const { vendedoresList, verCatalogo } = this.props

        if(vendedoresList === null){
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
                <center><h3>Vendedores</h3></center>                                

                <div className="container">
                    <div className="row">
                        {
                            (vendedoresList && vendedoresList.length > 0) ?
                            vendedoresList.map(vendedor => {
                                if(vendedor.profile){
                                    return(
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={vendedor.profile.id}>
                                            <div className="our-team">
                                                <div className="picture">
                                                    <img 
                                                        className="img-fluid" 
                                                        src={
                                                            vendedor.profile.avatar 
                                                            ? 
                                                                vendedor.profile.avatar 
                                                            : 
                                                                vendedor.profile.gender == 0
                                                                ?
                                                                    AvatarMale
                                                                :
                                                                    AvatarFemale
                                                        }
                                                    />
                                                </div>
                                                <div className="team-content">
                                                    <h3 className="name">{`${vendedor.first_name} ${vendedor.last_name}`}</h3>
                                                    <h4 className="title">{vendedor.email}</h4>
                                                </div>
                                                <ul className="social">                                                                                    
                                                    <li>
                                                        <a className="btn btn-sm btn-primary" 
                                                            data-toggle="tooltip" data-placement="top" title="Ver productos" 
                                                            onClick={() => verCatalogo(vendedor.profile.id)}
                                                        >
                                                            <i className="material-icons">store</i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                            :
                            <h2>No hay vendedores</h2>
                        }        
                    </div>
                </div>
                              
            </React.Fragment>
        )
    }
}

export default VendedoresLista