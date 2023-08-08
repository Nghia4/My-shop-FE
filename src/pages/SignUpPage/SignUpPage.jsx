import React, { useEffect, useState } from 'react'
import { WrapperContentLeft, WrapperContentRight, WrapperText } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import ImageSign from '../../assets/images/ImageSign.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/mutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/PopUpMessage/PopUpMessage'

const SignUpPage = (value) => {
    const navigate = useNavigate()
    const mutation = useMutationHook(
        data => UserService.signupUser(data)
    )
    const { data, isLoading, isSuccess, isError } = mutation

    const handleNavigateSignIn = () => {
        // if(mutation?.data.status === 'OK')
        navigate('/sign-in')
    }

    useEffect(() => {
        if(isSuccess) {
        message.success()
        handleNavigateSignIn()
    } else if (isError) {
        message.error()
    }
    },[isSuccess, isError])

    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnChangePassword = (value) => {
        setPassword(value)
    }

    const handleOnChangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }

    const handleSignUp = () => {
        mutation.mutate({
            email,
            password,
            confirmPassword
        })
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh', alignItems: 'center' }}>
            <div style={{ display: 'flex', width: '800px', height: '445px', borderRadius: '6px', background: '#fff', borderRadius: '6px' }}>
                <WrapperContentLeft>
                    <h1>Xin chào</h1>
                    <p>Đăng nhập và tạo tài khoản</p>
                    <InputForm
                        style={{ marginBottom: '10px' }}
                        placeholder="abc@gmail.com" 
                        value={email} 
                        onChange={handleOnChangeEmail}
                        />
                    <div style={{ marginBottom: '10px', position: 'relative' }}>
                        <span onClick={() => setIsShowPassword(!isShowPassword)} style={{
                            zIndex: 10,
                            position: 'absolute',
                            top: '4px',
                            right: '8px',
                        }}>{
                                isShowPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)
                            }
                        </span>
                        <InputForm
                            placeholder="password"
                            type={isShowPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handleOnChangePassword} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <span onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)} style={{
                            zIndex: 10,
                            position: 'absolute',
                            top: '4px',
                            right: '8px',
                        }}>{
                                isShowConfirmPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)
                            }
                        </span>
                        <InputForm
                            placeholder="confirm password"
                            type={isShowConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={handleOnChangeConfirmPassword} />
                    </div>
                    <div style={{ color:'red', marginTop:'10px', fontSize:'16px' }}>{data?.status === 'ERR' && <span>{data?.message}</span>}</div>
                    <Loading isLoading={isLoading}>
                    <ButtonComponent
                        disabled={!email.length || !password.length || !confirmPassword.length}
                        onClick={handleSignUp}
                        styleButton={{ backgroundColor: 'rgb(255, 57, 69)', width: '220px', height: '48px', margin: '26px 0 10px' }}
                        size={40}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        textButton={'Đăng ký'}
                    />
                    </Loading>
                    <p>Đã có tài khoản ? <WrapperText onClick={handleNavigateSignIn}>Đăng nhập tại đây</WrapperText></p>
                </WrapperContentLeft>
                <WrapperContentRight>
                    <Image src={ImageSign} preview={false} alt='image-logo' height="203px" width="203px" />
                    {/* <h4>Mua sắm tại đây</h4> */}
                </WrapperContentRight>
            </div>
        </div>
    )
}

export default SignUpPage