export const SET_USERINFO = "SET_USERINFO";
export const USER_ISLOGIN = "USER_ISLOGIN";
export const setuserinfo = (userinfo) => {
    return {
        type: SET_USERINFO,
        userinfo
    }
}
export const setlogin = (islogin) => {
    return {
        type: USER_ISLOGIN,
        islogin
    }
}