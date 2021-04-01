import { handleActions } from 'redux-actions';
import { push } from "react-router-redux";
import { initialize as initializeForm } from 'redux-form';
import { NotificationManager } from "react-notifications";
import { api } from "api";

const LIST_PRODUCTO = 'LIST_PRODUCTO'
const READ_PRODUCTO = 'READ_PRODUCTO'

const principalEndPoint = '/producto'

export const readProducto = (id) => (dispatch) => {
    api.get(`${principalEndPoint}/${id}`).then(response => {
        console.log('response redux readProducto:', response)
        dispatch({type: READ_PRODUCTO, oneData: response})
        dispatch(initializeForm('producto_form', response))
    })
    .catch(error => {
        console.log('error redux readProducto:', error)
        NotificationManager.error('Error al leer el producto', 'ERROR', 0);
    })
}

export const listProducto = () => (dispatch) => {
    api.post(`${principalEndPoint}/listMyProducts`).then(response => {
        console.log('response redux listProducto', response.productos)
        dispatch({type: LIST_PRODUCTO, data: response.productos})
        dispatch({type: READ_PRODUCTO, oneData: null})
    })
    .catch(error => {
        console.log('error redux listProducto:', error)
        NotificationManager.error('Error al listar los productos', 'ERROR', 0);
    })
}

export const registerProducto = (data={}, attachments=[]) => (dispatch, getStore) => {    
    console.log("data redux registerProducto:", data)
    console.log("attachments redux registerProducto:", attachments)

    api.postAttachments(principalEndPoint, data, attachments).then(response => {
        NotificationManager.success('Producto creado correctamente', 'Éxito', 3000);
        dispatch(push(principalEndPoint))
    })
    .catch(error => {
        console.log('error redux registerProducto :', error)
        NotificationManager.error('Error al registrar el producto', 'ERROR', 0);
    })
}

export const updateProducto = (data={}, attachments=[]) => (dispatch, getStore) => {  
    console.log("data redux updateProducto:", data)
    console.log("attachments redux updateProducto:", attachments)
    const id = data.id

    api.putAttachments(`${principalEndPoint}/${id}`, data, attachments).then(response => {
        NotificationManager.success('Producto actualizado correctamente', 'Éxito', 3000);
        dispatch(push(principalEndPoint))
    })
    .catch(error => {
        console.log('error redux updateProducto:', error)
        NotificationManager.error('Error al actualizar producto', 'ERROR', 0);
    })
}

export const deleteProducto = (id) => (dispatch) => {
    console.log('redux deleteProducto id:', id)
    
    api.eliminar(`${principalEndPoint}/${id}`).then(response => {
        NotificationManager.success('Producto eliminado correctamente', 'Éxito', 3000);
        dispatch(listProducto())
    })
    .catch(error => {
        console.log('error redux deleteProducto:', error)
        NotificationManager.error('Error al eliminar el producto', 'ERROR', 0);
    })
}




export const actions = {
    readProducto,
    listProducto,
    registerProducto,
    updateProducto,
    deleteProducto
};

export const initialState = {
    loader: false,
    data: null,
    oneData: null,    
};

export const reducers = {    
    [LIST_PRODUCTO]: (state, { data }) => {
        return {
            ...state,
            data,
        };
    },
    [READ_PRODUCTO]: (state, { oneData }) => {
        return {
            ...state,
            oneData,
        };
    },
};

export default handleActions(reducers, initialState);