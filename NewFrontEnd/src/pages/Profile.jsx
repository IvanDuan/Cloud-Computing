import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import { useNavigate } from "react-router-dom";
import {Divider, Row, Col, Input, Button, Image, Spin, DatePicker} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import * as actions from '../store/users/actions/actions';
import { uploadFile } from 'react-s3';

window.Buffer = window.Buffer || require("buffer").Buffer;

const Profile = () => {
    const navigate = useNavigate();

    const {load, usr} = useSelector(({users}) => ({
        load: users.loading,
        usr: users.user,
      }), shallowEqual);

    const dispatcher = useDispatch();

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState(".png")
    const [userName, setUserName] = useState(usr.username);
    const [firstName, setFirstName] = useState(usr.first_name);
    const [lastName, setLastName] = useState(usr.last_name);
    const [password, setPassword] = useState(usr.password);
    const [birthday, setBirthday] = useState(usr.birthday);

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    
   
    
    
    //pic_upload part
  const selectFile = (data) => {
        if(data.type === 'image/png') {
            setFileType('.png')
        } else if (data.type === 'image/jpeg'){
            setFileType('.jpg')
        }
        const blob = data.slice(0, data.size, data.type);
        const newFile = new File([blob], usr.username + fileType, {type: data.type});
        setSelectedFile(newFile)
    }
    const uploadPic = async(file) => {
        await dispatcher(actions.uploadPic(file, usr))
        navigate("/home")
        
    }

    const onEditClick = async() => {
          try {
            usr.username  = userName
            usr.first_name = firstName
            usr.last_name = lastName 
            usr.password  = password
            usr.birthday  = birthday
            await dispatcher(actions.updateUser(usr))
            navigate("/home")
          } catch (err) {
            console.error(err.message)
          }
    }

    const onChange = () => {

    }

    const onDeleteClick = async() => {
        try {
            await dispatcher(actions.deleteUser(usr))
            navigate("/")
          } catch (err) {
            console.error(err.message)
        }
    }
    return (
        <div className="home">
            <Spin indicator={antIcon} spinning={load}/>
            <Divider>
                <Row gutter = {16}>
                    <Col span={8}>
                        <Image src= {usr.profile_picture_link}/>
                    </Col>
                    <Col span={8}>
                        <input type="file" style={{display:'Upload'}} onChange={(e) =>{selectFile(e.target.files[0])}} multiple />
                        <button onClick={() => {uploadPic(selectedFile)}}>Upload</button>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>Username</Col>
                    <Col>
                        <Input defaultValue={usr.username} onChange={(e)=>{setUserName(e.target.value)}}/>
                    </Col>
                    <Col span={8}/>
                 </Row>
                 <Row gutter={16}>
                    <Col span={8}>First Name</Col>
                    <Col>
                        <Input defaultValue={usr.first_name} onChange={(e)=>{setFirstName(e.target.value)}}/>
                    </Col>
                    <Col span={8}/>
                 </Row>
                 <Row gutter={16}>
                    <Col span={8}>Last Name</Col>
                    <Col>
                        <Input defaultValue={usr.last_name} onChange={(e)=>{setLastName(e.target.value)}}/>
                    </Col>
                    <Col span={8}/>
                 </Row>
                 <Row gutter={16}>
                    <Col span={8}>Password</Col>
                    <Col>
                        <Input type="password" defaultValue={usr.password} onChange={(e)=>{setPassword(e.target.value)}}/>
                    </Col>
                    <Col span={8}/>
                 </Row>
                 <Row gutter={16}>
                    <Col span={8}>Birthday</Col>
                    <Col>
                    <DatePicker name="birthday" defaltValue={usr.birthday} onChange={onChange} />
                    </Col>
                    <Col span={8}/>
                 </Row>
                 <Row gutter={16}>
                    <Col span={8} />
                    <Col>
                        <Button onClick={() => {navigate("/home")}}>Back</Button>
                    </Col>
                    <Col span={8}>
                        <Button onClick = {() => {onEditClick()}}>Edit</Button>
                    </Col>
                 </Row>
                 <Row gutter={24}>
                    <Col span={4} />
                    <Col span={16}>
                        <Button onClick={() => {onDeleteClick()}}>DELETE ACCOUNT</Button>
                    </Col>
                    <Col span={4} />
                 </Row>
            </Divider>
        </div>
    )
}

export default Profile;
