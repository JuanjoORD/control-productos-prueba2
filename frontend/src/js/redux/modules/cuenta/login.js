import { handleActions } from 'redux-actions';
import { push } from "react-router-redux";
import { initialize as initializeForm } from 'redux-form';
import { NotificationManager } from "react-notifications";
import { api } from "api";

const SUBMIT = 'LOGIN_SUBMIT';
const LOADER = 'LOGIN_LOADER';
const ME = 'LOGIN_ME';

const GENDER_OPTIONS = [
    'Masculino',
    'Femenino'
]

export const constants = {
    SUBMIT,
};

// ------------------------------------
// Pure Actions
// ------------------------------------

export const setLoader = loader => ({
    type: LOADER,
    loader,
});

export const setMe = me => ({
    type: ME,
    me,
});

// ------------------------------------
// Actions
// ------------------------------------

export const onSubmit = (data = {}) => (dispatch, getStore) => {
    dispatch(setLoader(true));
    api.post('user/token', data).then((response) => {
        localStorage.setItem('token', response.token);
        dispatch(initializeForm('profile', response.user));
        dispatch(setMe(response.user));
        dispatch(push("/"));
    }).catch(() => {
        NotificationManager.error('Credenciales incorrectas, vuelva a intentar', 'ERROR', 0);
    }).finally(() => {
        dispatch(setLoader(false));
    });
};

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

export const getMe = () => (dispatch) => {
    api.get('/user/me').then(me => {                
        //dispatch(initializeForm('profile', me));        
        dispatch(setMe(me));
    })
        .catch(() => {
    }).finally(() => {});
};

export const logOut = () => (dispatch) => {
    api.post('/user/logout').then(() => {
    }).catch(() => {
    }).finally(() => {});
    localStorage.removeItem('token');
};


export const actions = {
    onSubmit,
    logOut,
};

export const reducers = {
    [LOADER]: (state, { loader }) => {
        return {
            ...state,
            loader,
        };
    },
    [ME]: (state, { me }) => {
        return {
            ...state,
            me,
        };
    },
};

export const initialState = {
    loader: false,
    me: {},
};

export default handleActions(reducers, initialState);
