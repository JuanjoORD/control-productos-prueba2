import { handleActions } from 'redux-actions';
import { push } from "react-router-redux";
import { initialize as initializeForm } from 'redux-form';
import { NotificationManager } from "react-notifications";
import { api } from "api";

const LIST_LOTE = 'LIST_LOTE'
const READ_LOTE = 'READ_LOTE'
const CURRENT_PRODUCT = 'CURRENT_PRODUCT'

const principalEndPoint = '/lote'

export const readLote = (id) => (dispatch) => {
    api.get(`${principalEndPoint}/${id}`).then(response => {
        console.log('response redux readLote:', response)
        dispatch({type: READ_LOTE, oneData: response})
        dispatch(initializeForm('lote_form', response))
    })
    .catch(error => {
        console.log('error redux readLote:', error)
        NotificationManager.error('Error al leer el lote', 'ERROR', 0);
    })
}

export const listLote = (idProducto) => (dispatch) => {    
    api.post(`${principalEndPoint}/listByProduct`, {idProducto}).then(response => {
        console.log('response redux listLote', response)
        dispatch({type: LIST_LOTE, data: response.lotes})
        dispatch({type: CURRENT_PRODUCT, productData: response.producto})
        dispatch({type: READ_LOTE, oneData: null})
    })
    .catch(error => {
        console.log('error redux listLote:', error)
        NotificationManager.error('Error al listar los lotes', 'ERROR', 0);
    })
}

export const registerLote = (data={}) => (dispatch, getStore) => {    
    console.log("data redux registerLote:", data)

    api.post(principalEndPoint, data).then(response => {
        NotificationManager.success('Lote creado correctamente', 'Éxito', 3000);
        dispatch(push(`/producto/${data.producto}/lotes`))
    })
    .catch(error => {
        console.log('error redux registerLote :', error)
        if(error != null){
            if(error.detail)
                NotificationManager.error(error.detail, 'ERROR', 0);
        }
        else{
            NotificationManager.error('Error al registrar el lote', 'ERROR', 0);
        }
    })
}

export const updateLote = (data={}) => (dispatch, getStore) => {  
    console.log("data redux updateLote:", data)    
    const id = data.id

    api.put(`${principalEndPoint}/${id}`, data).then(response => {
        NotificationManager.success('Lote actualizado correctamente', 'Éxito', 3000);
        dispatch(push(`/producto/${data.producto}/lotes`))
    })
    .catch(error => {
        console.log('error redux updateLote:', error)
        if(error != null){
            if(error.detail)
                NotificationManager.error(error.detail, 'ERROR', 0);
        }
        else{
            NotificationManager.error('Error al actualizar Lote', 'ERROR', 0);
        }
    })
}

export const deleteLote = (id) => (dispatch) => {
    const elHash = window.location.hash.toString()
    const idProducto = elHash.slice(11, 12)    
    
    api.eliminar(`${principalEndPoint}/${id}`).then(response => {
        NotificationManager.success('Lote eliminado correctamente', 'Éxito', 3000);
        dispatch(listLote(idProducto))
    })
    .catch(error => {
        console.log('error redux deleteLote:', error)
        NotificationManager.error('Error al eliminar el Lote', 'ERROR', 0);
    })
}




export const actions = {
    readLote,
    listLote,
    registerLote,
    updateLote,
    deleteLote
};

export const initialState = {
    loader: false,
    data: null,
    oneData: null,
    productData: null
};

export const reducers = {    
    [LIST_LOTE]: (state, { data }) => {
        return {
            ...state,
            data,
        };
    },
    [READ_LOTE]: (state, { oneData }) => {
        return {
            ...state,
            oneData,
        };
    },
    [CURRENT_PRODUCT]: (state, { productData }) => {
        return {
            ...state,
            productData,
        };
    },
};

export default handleActions(reducers, initialState);