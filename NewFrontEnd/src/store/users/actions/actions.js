import * as actionTypes from '../actionTypes';
// import axios from '../../../axios-orders';
import {message} from 'antd';
import api from '../../../api/api';


export const fetchUsersStart = () => ({
    type: actionTypes.FETCH_USERS_START
});

export const fetchUsersSuccess = (users) => ({
    type: actionTypes.FETCH_USERS_SUCCESS,
    users
})

export const newUserStart = () => ({
    type: actionTypes.NEW_USER_START
})

export const newUserSuccess = () => ({
    type:actionTypes.NEW_USER_SUCCESS
})

export const loginUserStart =  () => ({
    type: actionTypes.LOGIN_USER_START
})

export const loginUserSuccess = (data) => ({
    type: actionTypes.LOGIN_USER_SUCCESS,
    data
})

export const loginUserFail = (data) => ({
    type: actionTypes.LOGIN_USER_FAIL,
    data
})

export const setUserLogin = () => ({
    type:actionTypes.SET_USER_LOGIN
})

export const setUserLogoff = () => ({
    type:actionTypes.SET_USER_LOGOFF
})

export const fetchUsers = () => async(dispatch) => {
    dispatch(fetchUsersStart())
    try {
        const response  = await api.get('/users')
        const fetchedUsers = [];
        for (const key in response.data) {
            fetchedUsers.push({
                ...response.data[key]
            })
        }
        //fetchedUsers.sort(compare);
        dispatch(fetchUsersSuccess(fetchedUsers));
    } catch (err) {
        console.error(err.message)
    }
}

export const createUser = (userData) => async(dispatch) => {
    dispatch(newUserStart())
    try {
        await api.post('/users/', userData);
        dispatch(newUserSuccess())
        message.success('User Registration Success!');
        
    } catch (err) {
        console.error(err.message)
    }
}

export const loginUser = (userData) => async(dispatch) => {
    dispatch(loginUserStart())
    try {
        const response = await api.post('/user-login', userData)
        if(response.data !== ''){
            await dispatch(setUserLogin())
            await dispatch(loginUserSuccess(response.data))
        } else {
            throw new Error("Invalid Username/Password")
        }
        
    } catch (err) {
       const errorUser = {username: 'error'}
        console.error(err.message)
        message.error('Invalid Username or Password!')
        await dispatch(setUserLogoff())
        dispatch(loginUserFail(errorUser))
        
    }
}

const compare = (a, b) => {
    if(a.name < b.name) {
      return -1;
    }
    if(a.name > b.name) {
      return 1;
    }
    return 0;
  }