import * as userinfoaction from '../actions/userinfoactions.jsx'

const initialState = {
    userinfo: {},
    islogin: false,
}

const userinfoeeducer = (state = initialState, action) => {
    switch (action.type) {
        case userinfoaction.SET_USERINFO:
            return {
                ...state,
                userinfo: action.userinfo
            }
        case userinfoaction.USER_ISLOGIN:
            return {
                ...state,
                islogin: action.islogin
            }
        default:
            return state;
    }
}

export default userinfoeeducer;