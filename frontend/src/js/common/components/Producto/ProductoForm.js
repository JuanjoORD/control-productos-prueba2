import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import LoadMask from "../Utils/LoadMask/LoadMask";
import { validate, validatorFromFunction, validators, combine } from 'validate-redux-form';
import {    
    renderField,
    renderNumber,
    renderFilePicker,
    renderTextArea
} from "../Utils/renderField/renderField";

class ProductoForm extends Component{
    render(){
        const { handleSubmit, crear, oneData, setFoto } = this.props

        const editar = window.location.href.includes('editar')
        let disabled = false
        let titleForm = 'Crear'

        if(crear == false && editar == false){
            disabled = true
            titleForm = "Ver"
        }

        if(editar)titleForm = 'Editar'

        if(oneData == undefined && !crear){
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

            <form onSubmit={handleSubmit} className="col-12" >                
                    <div className="mb-4 card card-small">
                        <div className="border-bottom card-header"><h6 className="m-0">{`${titleForm} producto`}</h6></div>                                               

                        <div className="p-0 pt-3 d-flex flex-column flex-md-row">
                            <div className="form-group has-feedback flex-1 mx-3">
                                <label htmlFor="avatar">Foto</label>
                                <Field photo={(oneData && oneData.foto) ? oneData.foto : null} 
                                    setFile={setFoto} name="foto" disabled={disabled} component={renderFilePicker} 
                                />
                            </div>
                            <div className="form-group has-feedback flex-1 mx-3">                                                

                                <div className="form-group has-feedback">
                                    <label>Nombre</label>
                                    <Field name="nombre" component={renderField} disabled={disabled} />
                                </div>

                                <div className="form-group has-feedback">
                                    <label>Descripción</label>
                                    <Field name="descripcion" component={renderTextArea} disabled={disabled} />
                                </div>

                                <div className="form-group has-feedback">
                                    <label>Código de barras</label>
                                    <Field name="codigoBarras" component={renderField} disabled={disabled} />
                                </div>                               
                            </div>                           
                        </div>

                        <div className="p-0 pt-3 d-flex flex-column flex-md-row">
                            <div className="form-group has-feedback flex-1 mx-3">
                                <div className="form-group has-feedback">
                                    <label>Precio de compra</label>
                                    <Field 
                                        name="precioCompra" 
                                        placeholder="¿Cuánto le costo el producto?" 
                                        component={renderNumber} 
                                        decimalScale={2}
                                        prefix="Q "
                                        disabled={disabled} 
                                    />
                                </div>
                            </div>
                            <div className="form-group has-feedback flex-1 mx-3">
                                <div className="form-group has-feedback">
                                    <label>Precio de venta</label>
                                    <Field 
                                        name="precioVenta" 
                                        placeholder="¿A qué precio quiere venderlo?" 
                                        component={renderNumber} 
                                        decimalScale={2}
                                        prefix="Q "
                                        disabled={disabled} 
                                    />
                                </div>
                            </div>
                        </div>

                        
                        <div className="d-flex justify-content-center mb-3">                            
                            <a
                                href="/#/producto"
                                className="btn btn-secondary btn-sm mr-2"
                            >
                                Cancelar
                            </a>
                            {disabled == false &&
                                <button
                                    className={`btn btn-sm ${editar ? 'btn-success' : 'btn-primary'}`}
                                    type="submit"
                                >
                                    {editar ? 'Actualizar' : 'Registrar'}
                                </button>
                            }                                                
                        </div>                        
                    </div>
                </form>
            </React.Fragment>
        )
    }
}

export default reduxForm({
    form: 'producto_form',
    validate: (data) => {        
        return validate(data, {
            nombre: validators.exists()('Este campo es requerido'),
            descripcion: validators.exists()('Este campo es requerido'),
            precioCompra: validators.exists()('Este campo es requerido'),
            precioVenta: validators.exists()('Este campo es requerido'),
            codigoBarras: validators.exists()('Este campo es requerido'),
        }); 
    },
})(ProductoForm)