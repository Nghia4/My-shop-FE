import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabels, WrapperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/mutationHook'
import { Button, Upload, message } from 'antd'
import { updateUser } from '../../redux/slides/userSlide'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils/utils'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [adress, setAdress] = useState('')
    const [avatar, setAvatar] = useState('')
    const mutation = useMutationHook(
        (data) => {
            const {id, access_token, ...rests} = data
            UserService.updateUser(id, access_token, rests)
        }
    )

    const {data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        if(isSuccess) {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    },[isSuccess, isError])

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAdress(user?.adress)
        setAvatar(user?.avatar)
    },[user])

    

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnChangeName = (value) => {
        setName(value)
    }
    const handleOnChangePhone = (value) => {
        setPhone(value)
    }   
    const handleOnChangeAdress = (value) => {
        setAdress(value)
    }

    const handleOnChangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if(!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setAvatar(file.preview)
    }
    
    const handleUpdate = () => {
        mutation.mutate( {id: user?.id,
            name,
            email,
            phone,
            adress,
            avatar,
            access_token: user?.access_token
        }
        )
    }
  return (
    <div style={{ width: '1270px', margin: '0 auto'}}>
        <WrapperHeader>Thong tin nguoi dung</WrapperHeader>
        <WrapperContentProfile>
            <WrapperInput>
                <WrapperLabels htmlFor="name">Name</WrapperLabels>
                <InputForm style={{ width:'300px' }} id="name" value={name} onChange={handleOnChangeName} />
                <ButtonComponent
                    onClick={handleUpdate}
                    styleButton={{ 
                        backgroundColor: 'blue', 
                        width: 'auto', height: '30px', 
                        borderRadius: '4px', 
                        border:'1px solid rgb(26, 148, 255)',
                        padding: '2px 6px 6px'
                     }}
                    size={40}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    textButton={'Cap nhat'}
                >
                </ButtonComponent>
            </WrapperInput>
            <WrapperInput>
                <WrapperLabels htmlFor="email">Email</WrapperLabels>
                <InputForm style={{ width:'300px' }} id="email" value={email} onChange={handleOnChangeEmail} />
                <ButtonComponent
                    onClick={handleUpdate}
                    styleButton={{ 
                        backgroundColor: 'blue', 
                        width: 'auto', height: '30px', 
                        borderRadius: '4px', 
                        border:'1px solid rgb(26, 148, 255)',
                        padding: '2px 6px 6px'
                     }}
                    size={40}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    textButton={'Cap nhat'}
                >
                </ButtonComponent>
            </WrapperInput>
            <WrapperInput>
                <WrapperLabels htmlFor="phone">Phone</WrapperLabels>
                <InputForm style={{ width:'300px' }} id="phone" value={phone} onChange={handleOnChangePhone} />
                <ButtonComponent
                    onClick={handleUpdate}
                    styleButton={{ 
                        backgroundColor: 'blue', 
                        width: 'auto', height: '30px', 
                        borderRadius: '4px', 
                        border:'1px solid rgb(26, 148, 255)',
                        padding: '2px 6px 6px'
                     }}
                    size={40}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    textButton={'Cap nhat'}
                >
                </ButtonComponent>
            </WrapperInput>
            <WrapperInput>
                <WrapperLabels htmlFor="adress">Adress</WrapperLabels>
                <InputForm style={{ width:'300px' }} id="adress" value={adress} onChange={handleOnChangeAdress} />
                <ButtonComponent
                    onClick={handleUpdate}
                    styleButton={{ 
                        backgroundColor: 'blue', 
                        width: 'auto', height: '30px', 
                        borderRadius: '4px', 
                        border:'1px solid rgb(26, 148, 255)',
                        padding: '2px 6px 6px'
                     }}
                    size={40}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    textButton={'Cap nhat'}
                >
                </ButtonComponent>
            </WrapperInput>
            <WrapperInput>
                <WrapperLabels htmlFor="avatar">Avatar</WrapperLabels>
                     <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1} >
                        <Button icon={<UploadOutlined />}> Select Image </Button>
                     </WrapperUploadFile>
                     {avatar && (
                        <img src={avatar} style={{ 
                            height: '50px',
                            width: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                         }} alt='avatar' />
                     )}
                {/* <InputForm style={{ width:'300px' }} id="avatar" value={avatar} onChange={handleOnChangeAvatar} /> */}
                <ButtonComponent
                    onClick={handleUpdate}
                    styleButton={{ 
                        backgroundColor: 'blue', 
                        width: 'auto', height: '30px', 
                        borderRadius: '4px', 
                        border:'1px solid rgb(26, 148, 255)',
                        padding: '2px 6px 6px'
                     }}
                    size={40}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    textButton={'Cap nhat'}
                >
                </ButtonComponent>
            </WrapperInput>
        </WrapperContentProfile>
        
    </div>
  )
}

export default ProfilePage