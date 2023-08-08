import React, { useEffect, useState } from 'react'
import { WrapperContentLeft, WrapperContentRight, WrapperText } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import ImageSign from '../../assets/images/ImageSign.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/mutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/PopUpMessage/PopUpMessage'
import jwt_decode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'

const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }

    const mutation = useMutationHook(
        data => UserService.loginUser(data)
    )

    const {data, isLoading, isSuccess, isError } = mutation 

    useEffect(() => {
        if(isSuccess && mutation?.data.status === "OK") {
        navigate('/')
        localStorage.setItem('access_token', JSON.stringify(data?.access_token))
        localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
        if(data?.access_token) {
            const decoded = jwt_decode(data?.access_token)
            if(decoded?.id) {
                handleGetDetailUser(decoded?.id, data?.access_token)
            }
        }
    } else if (isError) {
        message.error()
    }
    },[isSuccess, isError])

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token)
        dispatch(updateUser({...res?.data, access_token: token}))
    }

    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnChangePassword = (value) => {
        setPassword(value)
    }

    const handleSignIn = () => {
        mutation.mutate({
            email,
            password
        })
    }

  return (
    <div style={{ display: 'flex', justifyContent:'center', background:'rgba(0,0,0,0.53)', height:'100vh', alignItems:'center'}}>
    <div style={{ display: 'flex', width:'800px', height:'445px', borderRadius:'6px', background:'#fff', borderRadius:'6px' }}>
        <WrapperContentLeft>
            <h1>Xin chào</h1>
            <p>Đăng nhập và tạo tài khoản</p>
            <InputForm 
            style={{ marginBottom: '10px' }} 
            placeholder="abc@gmail.com" 
            value={email} 
            onChange={handleOnChangeEmail}
            />
            <div style={{ position: 'relative'}}>
                <span onClick={() => setIsShowPassword(!isShowPassword)} style={{
                    zIndex:10,
                    position:'absolute',
                    top:'4px',
                    right:'8px',
                }}>{
                    isShowPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)
                }
                </span>
            <InputForm 
            placeholder="password" 
            type={isShowPassword? 'text' : 'password'}
            value={password}
            onChange={handleOnChangePassword}
            />
            </div>
            <div>
            {data?.status === 'ERR' && <span style={{ color:'red', fontSize:'16px'}}>{data?.message}</span>}
            </div>
            <Loading isLoading={isLoading}>
            <ButtonComponent
                        disabled={!email.length || !password.length}
                        onClick={handleSignIn}
                        styleButton={{ backgroundColor: 'rgb(255, 57, 69)', width: '220px', height: '48px', margin:'26px 0 10px' }}
                        size={40}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        textButton={'Đăng nhập'}
                    />
            </Loading>
                    <p><WrapperText>Quên mật khâu</WrapperText></p>
                    <p>Chưa có tài khoản? <WrapperText onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperText></p>
        </WrapperContentLeft>
        <WrapperContentRight>
            <Image src={ImageSign} preview={false} alt='image-logo' height="203px" width="203px" />
            
        </WrapperContentRight>
    </div>
    </div>
  )
}

export default SignInPage