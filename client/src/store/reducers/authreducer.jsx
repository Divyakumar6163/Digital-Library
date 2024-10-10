// authreducer.jsx

import * as authactions from '../actions/authactions';

const initialState = {
    islogin: false,       
    accessToken: null,     
    refreshToken: null,
};

const authreducer = (state = initialState, action) => {
    switch (action.type) {
        case authactions.SET_ACCESS_TOKEN:
            return {
                ...state,
                islogin: true,
                accessToken: action.authData.accessToken,
            };
        case authactions.LOGOUT:
            return {
                ...state,
                islogin: false,
                accessToken: null,
                refreshToken: null,
            };
        case authactions.SET_REFRESH_TOKEN:
            return {
               ...state,
                islogin: true,
                refreshToken: action.refreshToken
            };
        default:
            return state;
    }
};

export default authreducer;
