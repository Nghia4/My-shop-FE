import React, { useEffect, useMemo, useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style'
import { Checkbox, Form } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { WrapperInputNumber } from '../../components/ProductDetailComponent/style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils/utils'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import Loading from '../../components/LoadingComponent/Loading'
import InputComponent from '../../components/InputComponent/InputComponent'
import * as UserService from '../../services/UserService'
import * as message from '../../components/PopUpMessage/PopUpMessage'
import { useMutationHook } from '../../hooks/mutationHook'
import { updateUser } from '../../redux/slides/userSlide'
import { useNavigate } from 'react-router-dom'
import StepComponent from '../../components/StepComponent/StepComponent'

const OrderPage = () => {
  const [form] = Form.useForm()
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [isChecked, setIsChecked] = useState([])
  const [isOpenModalUpdateInfoNotice, setIsOpenModalUpdateInfoNotice] = useState(false)
  const dispatch = useDispatch()

  const [stateUser, setStateUser] = useState({
        name: '',
        phone: '',
        adress:'',
        city: '',
  })

  const mutationUpdate = useMutationHook(
    (data) => {
        const {
            id,
            token,
            ...rests } = data
        const res = UserService.updateUser(
            id, token,
            { ...rests })
        return res
    }
)

  const onChange = (e) => {
    if(isChecked.includes(e.target.value)) {
      const newChecked = isChecked.filter((item) => item !== e.target.value)
      setIsChecked(newChecked)
    } else {
      setIsChecked([ ...isChecked, e.target.value ])
    }
  }

  const handleChangeCount = (type, idProduct) => {
    if(type === 'increase') {
      dispatch(increaseAmount({idProduct}))
    } else if( type === 'decrease') {
      dispatch(decreaseAmount({idProduct}))
    }
  }

  useEffect(()=> {
    dispatch(selectOrder({isChecked}))
  },[isChecked])

  useEffect(() => {
    form.setFieldsValue(stateUser)

  },[form,stateUser])

  useEffect(() => {
    if(isOpenModalUpdateInfoNotice) {
      setStateUser({
        ...stateUser,
        name: user?.name,
        phone: user?.phone,
        adress: user?.adress,
        city : user?.city
      })
    }
  },[isOpenModalUpdateInfoNotice])

  const discountPriceMemo = useMemo(() => {
    const result = order?.orderItemSelected?.reduce((total, cur) => {
        if(cur.discount === 0){
          return  total 
        } else {
          return total + (((cur.price *(cur.discount / 100)) * cur.amount))
        }
    },0)
    return result
  },[order])

  const priceMemo = useMemo(() => {
    const result = order?.orderItemSelected?.reduce((total, cur) => {
      if(discountPriceMemo === 0) {
        return total + (cur.price * cur.amount)
      } else {
      return total + ((cur.price * cur.amount) - discountPriceMemo)
      }
    },0)
    return result
  },[order])

  const priceDeliveryMemo = useMemo(() => {
    if(priceMemo < 2000000 && priceMemo >= 500000) {
      return 20000
    } else if (priceMemo === 0 || priceMemo >= 2000000) {
      return 0
    } else if ( priceMemo < 500000 && priceMemo > 0) {
      return 30000
    }
  },[priceMemo])
  
  const totalPrice = useMemo(() => {
    return Number(priceMemo) + Number(priceDeliveryMemo)
  },[priceMemo,priceDeliveryMemo])


  const handleOnchangeCheckAll = (e) => {
      const newListChecked = []
      if (e.target.checked) {
      order?.orderItems.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setIsChecked(newListChecked)
    } else {
      setIsChecked([])
    }
  }

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({idProduct}))
  }

  const handleDeleteAllOrder = () => {
    if(isChecked?.length) {
      dispatch(removeAllOrderProduct({isChecked}))
    }
  }
  const handleAddCart = () => {
    if(!order.orderItemSelected?.length) {
      message.error()
    }
   else if(!user?.name  || !user?.phone || !user?.adress || !user?.city) {
      setIsOpenModalUpdateInfoNotice(true)
    } else {
      navigate('/payment')
    }
  }

  const handleCancel = () => {
    setIsOpenModalUpdateInfoNotice(false)
    setStateUser({
      ...stateUser,
      name:'',
      phone: '',
      adress: '',
      city: ''
    })
  }

  const handleOnChangeDetails = (e) => {
    setStateUser({
        ...stateUser,
        [e.target.name]: e.target.value
    })
}

const { isLoading, data } = mutationUpdate

  const handleUpdateUser = () => {
    const {name, phone, adress, city} = stateUser
    mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUser }, {
      onSuccess: () => {
          dispatch(updateUser({name, phone, adress, city}))
          setIsOpenModalUpdateInfoNotice(false)
      },
      onSettled: () => {
        data.refetch()
    }
  })
  }

  const items = [
    {
      title: '30.000 VND',
      description:' Dưới 500.000 VND'
    },
    {
      title: '20.000 VND',
      description:'Từ 500.000 VND đến dưới 2.000.000 VND'
    },
    {
      title: '0 VND',
      description:'2.000.000 VND trở lên'
    },
  ]

  return (
    <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h3 style={{ fontWeight: 'bold' }}>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperLeft>
            <h4>Phí giao hàng</h4>
            <WrapperStyleHeader>
                <StepComponent items={items} current={priceMemo >= 2000000 ? 3 : priceMemo < 500000 &&  order?.orderItemSelected?.length >=1 ? 1 : priceMemo >= 500000 && priceMemo < 2000000 ? 2 : 0} />
            </WrapperStyleHeader>
            <WrapperStyleHeader>
              <span style={{ display: 'inline-block', width: '390px' }} >
                <Checkbox onChange={handleOnchangeCheckAll} checked={isChecked?.length === order?.orderItems?.length} ></Checkbox>
                <span>Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <span>Đơn giá</span>
                <span>Giảm giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleDeleteAllOrder} />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
              <WrapperItemOrder>
                <div style={{ width: '380px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} >
                  <Checkbox onChange={onChange} value={order?.product} checked={isChecked.includes(order?.product)} ></Checkbox>
                  <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} alt='orderImage'></img>
                  <div style={{ 
                    width: 260,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                   }}
                  >{order?.name}</div>
                </div>
                <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <span>
                    <span style={{ fontSize: '13px', color: '#242424', width: '95px' }} >{convertPrice(order?.price)}</span>
                  </span>
                    <WrapperPriceDiscount>
                      {order?.discount ? order?.discount : 0} %
                    </WrapperPriceDiscount>
                  <WrapperCountOrder>
                    <button style={{ border: 'none', background: 'transparent', cursor:'pointer' }} onClick={() => handleChangeCount('decrease', order?.product)} >
                      <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                    </button>
                    <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} />
                    <button style={{ border: 'none', background: 'transparent', cursor:'pointer' }} onClick={() => handleChangeCount('increase', order?.product)} >
                      <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                    </button>
                  </WrapperCountOrder>
                  <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px' }} >{order?.discount === 0 ?  convertPrice(order?.price * order?.amount) : convertPrice((order?.price - (order?.price * (order?.discount / 100))) * order?.amount)}</span>
                  <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(order?.product)} />
                </div>
              </WrapperItemOrder>         
                )
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: '100%' }} >
              <WrapperInfo>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <span>Đã được giảm giá</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} >{convertPrice(discountPriceMemo)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <span>Tạm tính</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} > {convertPrice(priceMemo)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                </div> <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <span>Phí giao hàng</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} >{convertPrice(priceDeliveryMemo)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tong tien</span>
                <span style={{ display: 'flex', flexDirection: 'column' }} >
                  <span style={{ color: 'rgb(254,56,52)', fontSize: '24px' }} >{convertPrice(totalPrice)}</span>
                  {/* <span style={{ color: '#000', fontSize: '11px' }} >Da bao gom thue</span> */}
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              size={40}
              onClick={handleAddCart}
              styleButton={{
                backgroundColor: 'rgb(255, 57, 69)',
                height: '48px',
                width: '220px',
                border: 'none',
                borderRadius: '4px'
              }}
              textButton={'Mua hàng'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '500' }} />
          </WrapperRight>
        </div>
      </div>
      <ModalComponent title="Cap nhat thong tin" open={isOpenModalUpdateInfoNotice} onCancel={handleCancel} onOk={handleUpdateUser} >      
      <Form
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 22,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        // onFinish={onUpdateUser}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input User name',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.name} onChange={handleOnChangeDetails} name='name' />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Phone',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.phone} onChange={handleOnChangeDetails} name='phone' />
                        </Form.Item>
                        <Form.Item
                            label="Adress"
                            name="adress"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your adress',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.adress} onChange={handleOnChangeDetails} name='adress' />
                        </Form.Item>
                        <Form.Item
                            label="City"
                            name="city"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your city',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.city} onChange={handleOnChangeDetails} name='city' />
                        </Form.Item>
                    </Form>
            </ModalComponent>
    </div>
  )
}

export default OrderPage