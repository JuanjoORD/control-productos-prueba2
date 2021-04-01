import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import LoadMask from "../Utils/LoadMask/LoadMask";
import { validate, validatorFromFunction, validators, combine } from 'validate-redux-form';
import {    
    renderField,
    renderNumber,
    renderDatePicker,
    renderDayPicker,
    renderFilePicker,
    renderTextArea
} from "../Utils/renderField/renderField";

class LoteForm extends Component{
    render(){
        const { handleSubmit, crear, oneData, idProducto } = this.props

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
                        <div className="border-bottom card-header"><h6 className="m-0">{`${titleForm} lote`}</h6></div>                                               

                        <div className="p-0 pt-3 d-flex flex-column flex-md-row">
                            <div className="form-group has-feedback flex-1 mx-3">
                                <div className="form-group has-feedback">
                                    <label>No. Lote</label>
                                    <Field name="numeroLote" component={renderNumber} 
                                        disabled={disabled} 
                                        numberFormat="###############"
                                    />
                                </div>
                            </div>

                            <div className="form-group has-feedback flex-1 mx-3">
                                <div className="form-group has-feedback">
                                    <label>Cantidad</label>
                                    <Field name="cantidad" component={renderNumber} disabled={disabled} />
                                </div>                               
                            </div>    

                            <div className="form-group has-feedback flex-1 mx-3">
                                <div className="form-group has-feedback">
                                    <label>Fecha de vencimiento</label>
                                    <Field name="fechaVencimiento" component={renderDayPicker} disabled={disabled} />
                                </div>                               
                            </div>                        
                        </div>
                        
                        <div className="d-flex justify-content-center mb-3">                            
                            <a
                                href={`/#/producto/${idProducto}/lotes`}
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
    form: 'lote_form',
    validate: (data) => {        
        return validate(data, {
            numeroLote: validators.exists()('Este campo es requerido'),
            cantidad: validators.exists()('Este campo es requerido'),
            fechaVencimiento: validators.exists()('Este campo es requerido'),
        }); 
    },
})(LoteForm)