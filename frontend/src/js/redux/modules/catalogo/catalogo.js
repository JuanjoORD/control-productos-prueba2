import { handleActions } from 'redux-actions';
import { push } from "react-router-redux";
import { initialize as initializeForm } from 'redux-form';
import { NotificationManager } from "react-notifications";
import { api } from "api";
import { flatMap } from 'lodash';

const LIST_VENDEDORES = 'LIST_VENDEDORES'
const PRODUCTOS_LIST = 'PRODUCTOS_LIST'
const CARRITO_SET = 'CARRITO_SET'
const CLIENTE_SET = 'CLIENTE_SET'

const principalEndPoint = '/venta'

export const readLote = (id) => (dispatch) => {
    api.get(`${principalEndPoint}/${id}`).then(response => {
        console.log('response redux readLote:', response)        
        dispatch(initializeForm('lote_form', response))
    })
    .catch(error => {
        console.log('error redux readLote:', error)
        NotificationManager.error('Error al leer el lote', 'ERROR', 0);
    })
}

export const listVendedores = () => (dispatch, getStore) => {
    const user = getStore().login.me
    let isSeller = false
    if(user.username){
        isSeller = true
    }

    api.post(`${principalEndPoint}/listVendedores`, {isSeller, user}).then(response => {
        console.log('response redux listVendedores', response.vendedores)
        dispatch({type: LIST_VENDEDORES, vendedoresList: response.vendedores})
    })
    .catch(error => {
        console.log('error redux listVendedores:', error)
        NotificationManager.error('Error al listar a los vendedores', 'ERROR', 0);
    })
}

export const listProductBySeller = (profileId) => (dispatch) => {
    api.post(`${principalEndPoint}/listProductBySeller`, {profileId}).then(response => {
        console.log('response redux listProductBySeller', response)
        dispatch({type: PRODUCTOS_LIST, productosList: response})
    })
    .catch(error => {
        console.log('error redux listProductBySeller:', error)
        NotificationManager.error('Error al listar a los productos', 'ERROR', 0);
    })
}

export const setElCarrito = (elCarrito) => (dispatch) => {
    dispatch({type: CARRITO_SET, elCarrito})
}

export const getCliente = () => (dispatch, getStore) => {
    const user = getStore().login.me
    let cliente = {
        nombreCliente: '',
        direccionCliente: '',
        correoCliente: '',
        nit: ''
    }
    if(user.username){
        cliente = {
            nombreCliente: `${user.first_name} ${user.last_name}`,
            direccionCliente: user.profile.address,
            correoCliente: user.email,
            nit: user.profile.nit
        }
    }

    dispatch(initializeForm('cliente_form', cliente))
    dispatch({type: CLIENTE_SET, cliente})
}

export const confirmarCompra = (data={}) => (dispatch) => {
    return api.post(`${principalEndPoint}/confirmarCompra`, data).then(response => {
        console.log('response redux confirmarCompra', response.vendedores)
        dispatch({type: CARRITO_SET, elCarrito: []})        
        NotificationManager.success('Compra realizada correctamente', 'ERROR', 0);
        return true
    })
    .catch(error => {
        console.log('error redux confirmarCompra:', error)
        NotificationManager.error('Error al listar al Confirmar la compra', 'ERROR', 0);
        return false
    })
}



export const actions = {
    listVendedores,
    listProductBySeller,
    setElCarrito,
    getCliente,
    confirmarCompra
};

export const initialState = {
    loader: false,
    vendedoresList: null,
    productosList: null,
    elCarrito: [],
    cliente: {}
};

export const reducers = { 
    [PRODUCTOS_LIST]: (state, { productosList }) => {
        return {
            ...state,
            productosList,
        };
    },      
    [LIST_VENDEDORES]: (state, { vendedoresList }) => {
        return {
            ...state,
            vendedoresList,
        };
    },
    [CARRITO_SET]: (state, { elCarrito }) => {
        return {
            ...state,
            elCarrito,
        };
    },
    [CLIENTE_SET]: (state, { cliente }) => {
        return {
            ...state,
            cliente,
        };
    }    
};

export default handleActions(reducers, initialState);