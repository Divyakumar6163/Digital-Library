export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
export const SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN';
export const LOGOUT = 'LOGOUT';
export const setAccessToken = (accessToken) => {
    return {
        type: SET_ACCESS_TOKEN,
        authData: {
            accessToken
        }
    };
};
export const setRefreshToken = (refreshToken) => {
    return {
        type: SET_REFRESH_TOKEN,
        refreshToken
    };
};
export const logout = () => {
    return {
        type: LOGOUT
    };
};
