import * as actionTypes from '../actionTypes';
// import axios from '../../../axios-orders';
import {message} from 'antd';
import api from '../../../api/api';
import { uploadFile } from 'react-s3';


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

export const uploadPicStart = () => ({
    type:actionTypes.UPLOAD_PIC_START
})

export const uploadPicSuccess = () => ({
    type: actionTypes.UPLOAD_PIC_SUCCESS,
})

export const uploadPicFail = () => ({
    type:actionTypes.UPLOAD_PIC_FAIL
})

export const deleteUserStart =  () => ({
    type: actionTypes.DELETE_USER_START
})

export const deleteUserSuccess = (data) => ({
    type: actionTypes.DELETE_USER_SUCCESS,
    data
})

export const deleteUserFail = (data) => ({
    type: actionTypes.DELETE_USER_FAIL,
    data
})

export const updateUserStart =  () => ({
    type: actionTypes.UPDATE_USER_START
})

export const updateUserSuccess = (data) => ({
    type: actionTypes.UPDATE_USER_SUCCESS,
    data
})

export const updateUserFail = (data) => ({
    type: actionTypes.UPDATE_USER_FAIL,
    data
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

export const fetchUser = (id) => async(dispatch) => {
    dispatch(loginUserStart())
    try {
        const response = await api.get('/users/' + id)
        dispatch(loginUserSuccess(response.data))
        console.log('responsedata: ', response.data)
    } catch (err) {
        dispatch(loginUserFail())
        console.error(err.message)
    }
}
//upload pic


export const createUser = (userData, pictureFile, pictureType) => async(dispatch) => {
    dispatch(newUserStart())
    try {
        const pictureLink = "https://aimsbconnectbucket.s3.amazonaws.com/default.png"
        const createUser = {
            ...userData,
            profile_picture_link: pictureLink
        }
        console.log(createUser)
        await api.post('/users/', createUser);
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

export const uploadPic = (data, user) => async(dispatch) => {
    dispatch(uploadPicStart())
    try {
        const response = await api.get('/iam')
        const config = {
            bucketName: "aimsbconnectbucket",
            region: "us-east-1",
            accessKeyId: response.data.iam_access_key,
            secretAccessKey: response.data.iam_secret_access_key
        }
        uploadFile(data, config)
        const updatedUser = {
            ...user,
            profile_picture_link: "https://aimsbconnectbucket.s3.amazonaws.com/" + data.name
        }
        delete updatedUser.user_id
        const updateUser = await api.put('/users/' + user.user_id, updatedUser)
        dispatch(uploadPicSuccess())
    } catch (err) {
        console.error(err.message)
        dispatch(uploadPicFail())
    }
} 

export const deleteUser = (user) => async(dispatch) => {
    dispatch(deleteUserStart())
    try {
        const response = await api.delete('/users/' + user.user_id)
        if(response.data !== ''){
            await dispatch(setUserLogoff())
            await dispatch(deleteUserSuccess(response.data))
        } else {
            throw new Error("Invalid id", user.user_id)
        }
        
    } catch (err) {
       const errorUser = {username: 'error'}
        console.error(err.message)
        message.error('Deleting id', user.user_id, " unsuccessful")
        dispatch(deleteUserFail(errorUser))
    }
}

export const updateUser = (user) => async(dispatch) => {
    dispatch(updateUserStart())
    try {
        const updatedUser = {
            ...user,
            profile_picture_link: "https://aimsbconnectbucket.s3.amazonaws.com/default.png"
        }
        console.log(updatedUser)
        await api.put('/users/' + user.user_id, updatedUser);
        dispatch(updateUserSuccess())
        message.success('User Update Success!');
        
    } catch (err) {
        console.error(err.message)
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
