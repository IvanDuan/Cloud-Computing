import React, {useEffect} from 'react'
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import { useNavigate } from "react-router-dom";
import {Button} from 'antd';
import * as actions from '../store/users/actions/actions';


const Navbar = () => {

  const navigate = useNavigate();
  const dispatcher = useDispatch();

  const {usr, logd} = useSelector(({users}) => ({
    usr: users.user,
    logd: users.userLogged
  }), shallowEqual);

  const logOff = () => {
    dispatcher(actions.setUserLogoff())
    navigate("/")
  }

  return (
    
   
    
    // profile_pic
    <div className='navbar'>
      <div className='user'>
      <img src= {usr.profile_picture_link} alt="" />
        <Button onClick={() =>{navigate("/profile")}}><span className="name">{usr.first_name} {usr.last_name}</span></Button>
        <button onClick={() =>{logOff()}}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
