import * as actionTypes from '../actionTypes';
import {updateObject} from '../../utility';

const initialState = {
    userId: '',
    userLogged: false,
    users: [],
    user: {},
    picture: '',
    loading: false
}

const fetchUsersStart = (state, action) => updateObject(state, {loading: true});

const fetchUsersSuccess = (state, action) => updateObject(state, {
    users: action.users,
    loading:false
})

const newUserStart = (state, action) => updateObject(state, {loading: true});
const newUserSuccess = (state, action) => updateObject(state, {
    loading: false
})

const loginUserStart = (state, action) => updateObject(state, {loading: true});
const loginUserSuccess = (state, action) => updateObject(state, {
    user: action.data,
    loading: false
})

const loginUserFail = (state, action) => updateObject(state, {
    user: action.data,
    loading: false
})

const setUserLogin = (state, action) => updateObject(state, {
    userLogged: true
})

const setUserLogoff = (state, action) => updateObject(state, {
    userLogged: false
})
//const upload pic

const uploadPicStart = (state, action) => updateObject(state, {
    loading:true
})

const uploadPicSuccess = (state, action) => updateObject(state, {
    loading:false

})

const uploadPicFail = (state, action) => updateObject(state, {
    loading:false
})


const users = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_USERS_START: return fetchUsersStart(state, action);
        case actionTypes.FETCH_USERS_SUCCESS: return fetchUsersSuccess(state, action);
        case actionTypes.NEW_USER_START: return newUserStart(state, action);
        case actionTypes.NEW_USER_SUCCESS: return newUserSuccess(state, action);
        case actionTypes.LOGIN_USER_START: return loginUserStart(state, action);
        case actionTypes.LOGIN_USER_SUCCESS: return loginUserSuccess(state, action);
        case actionTypes.LOGIN_USER_FAIL: return loginUserFail(state, action);
        case actionTypes.SET_USER_LOGIN: return setUserLogin(state, action);
        case actionTypes.SET_USER_LOGOFF: return setUserLogoff(state, action);
        default: return state;

    }
}

export default users;
