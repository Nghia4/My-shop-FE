import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Popover } from 'antd'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser, updateUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/productSlide';
import ModalComponent from '../ModalComponent/ModalComponent';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const [isOpenModalDelete,setIsOpenModalDelete] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [isPopUp, setIsPopUp] = useState(false)
    const [search, setSearch] = useState('')
    const order = useSelector((state) => state.order)
    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }

    const handleCancel = () => {
        setIsOpenModalDelete(false)
    }

    const handleNavigateRegister = () => {
        navigate('/sign-in')
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const handleLogout = async () => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        setLoading(false)
    }

    const handleNavigate = (type) => {
        switch (type) {
            case 'profile' :
                navigate('/profile-user')
                break;
            case 'system':
                navigate('/system/admin')
                break;
            case 'order':
                navigate(`/my-order`, {
                    state: {
                        id: user?.id,
                        token: user?.access_token
                    }
                })
                break;
            default:
                return ''
                
        }
        setIsPopUp(false)
    }

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }

    const handleNavigateOrder = () => {
        if(!user?.access_token) {
            setIsOpenModalDelete(true)
        } else {
            navigate('/order')
        }
    }

    const content = (
        <div>
            <WrapperContentPopup onClick={() => handleNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
            {user.isAdmin && (<WrapperContentPopup onClick={() =>handleNavigate('system')}>Quản lý hệ thống</WrapperContentPopup>)}
            <WrapperContentPopup onClick={() => handleNavigate('order')}>Lịch sử đơng hàng</WrapperContentPopup>
            <WrapperContentPopup onClick={handleLogout} >Đăng xuất</WrapperContentPopup>
        </div>
    )
    return (
        <div>
            <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset' }} gutter={16}>
                <Col span={6}>
                    <WrapperTextHeader to='/' >MY SHOP</WrapperTextHeader>
                </Col>
                {!isHiddenSearch && (
                    <Col span={12}>
                        <ButtonInputSearch
                            size='large'
                            textButton='Tim kiem'
                            placeholder="input search text"
                        // allowClear
                        // enterButton="Search"
                        // size="large"
                        onChange={onSearch}
                        />
                    </Col>
                )}
                <Col span={6} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Loading isLoading={loading}>
                        <WrapperHeaderAccount>
                            <div>
                                {userAvatar ? (<img src={userAvatar} alt='avatar' style={{
                                    height: '40px',
                                    width: '40px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }} />) : (<UserOutlined style={{ fontSize: '30px' }} />)}
                            </div>
                            {user?.access_token ?
                                (
                                    <>
                                        <Popover content={content} open={isPopUp} trigger="click" >
                                            <div onClick={() => setIsPopUp((open) => !open)} style={{ cursor: 'pointer' }}>{userName ? userName : user.email}</div>
                                        </Popover>
                                    </>
                                ) : (<div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                                    <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                                )}
                        </WrapperHeaderAccount>
                    </Loading>
                    {!isHiddenCart && (
                        <div style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'}} onClick={() => handleNavigateOrder()}>
                            <Badge count={order?.orderItems?.length} size='small' >
                                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            </Badge>
                            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                        </div>
                    )}
                </Col>
            </WrapperHeader>
            <ModalComponent title="Chưa có tài khoản" open={isOpenModalDelete} onCancel={handleCancel} onOk={handleNavigateRegister} >   
                    <div>Vui lòng đăng nhập trước khi vào giỏ hàng của mình </div>  
            </ModalComponent>
        </div>
    )
}

export default HeaderComponent