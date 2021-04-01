import { handleActions } from 'redux-actions';
import { push } from "react-router-redux";
import { initialize as initializeForm } from 'redux-form';
import { NotificationManager } from "react-notifications";
import { api } from "api";

const SET_RESULTADOS = 'SET_RESULTADOS'

const principalEndPoint = '/venta'

export const misResultados = () => (dispatch, getStore) => {    

    api.post(`${principalEndPoint}/resultados`).then(response => {
        console.log('response redux misResultados', response)
        dispatch({type: SET_RESULTADOS, resultados: response})
    })
    .catch(error => {
        console.log('error redux misResultados:', error)
        NotificationManager.error('Error al obtener resultados', 'ERROR', 0);
    })
}


export const actions = {
    misResultados
};

export const initialState = {
    loader: false,
    resultados: []
};

export const reducers = { 
    [SET_RESULTADOS]: (state, { resultados }) => {
        return {
            ...state,
            resultados,
        };
    }    
};

export default handleActions(reducers, initialState);