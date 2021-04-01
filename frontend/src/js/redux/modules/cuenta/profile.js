import { handleActions } from 'redux-actions';
import { push } from "react-router-redux";
import { NotificationManager } from "react-notifications";
import { initialize as initializeForm } from 'redux-form';
import { api } from "api";
import {setMe} from "./login";

const LOADER = 'LOGIN_LOADER';

const GENDER_OPTIONS = [
    'Masculino',
    'Femenino'
]

const formatMe = (user) => {
    const me = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.label,
        is_superuser: user.is_superuser,
        is_staff: user.is_staff,
        username: user.username,
        profile: {
            id: user.profile.id,
            avatar: user.profile.avatar,
            phone: user.profile.phone,
            address: user.profile.address,
            gender: {label: GENDER_OPTIONS[user.profile.gender], value: user.profile.gender },
            nit: user.profile.activo,
            creado: user.profile.creado,
            modificado: user.profile.modificado,
            user: user.profile.user
        }
    }
    return me
}

export const constants = {
};

// ------------------------------------
// Pure Actions
// ------------------------------------

export const setLoader = loader => ({
    type: LOADER,
    loader,
});
// ------------------------------------
// Actions
// ------------------------------------

export const update = (data = {}, attachments=[]) => (dispatch, getStore) => {
    console.log("data profile xd:", data)
    dispatch(setLoader(true));
    api.putAttachments('user/update_me', data, attachments).then((response) => {
        dispatch(setMe(response));
        console.log("data respnse xd:", response)
        NotificationManager.success('Datos actualizados exitosamente, puede continuar navegando en el sitio', 'Que bien', 4000);
    }).catch(() => {
        NotificationManager.error('Credenciales incorrectas, vuelva a intentar', 'ERROR', 0);
    }).finally(() => {
        dispatch(setLoader(false));
    });
};

export const initialProfile = () => (dispatch, getStore) => {
    let me = getStore().login.me    
    dispatch(initializeForm('profile', me));
};

export const actions = {
    update,
    initialProfile
};

export const reducers = {
    [LOADER]: (state, { loader }) => {
        return {
            ...state,
            loader,
        };
    },
};

export const initialState = {
    loader: false,
};

export default handleActions(reducers, initialState);
