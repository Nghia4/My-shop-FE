import {Form, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import * as  UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
// import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
// import * as PaymentService from '../../services/PaymentService'
import { useMutationHook } from '../../hooks/mutationHook';
import { convertPrice } from '../../utils/utils';
import * as message from '../../components/PopUpMessage/PopUpMessage'
import * as OrderService from '../../services/OrderService'
import * as PayMentService from '../../services/PaymentService'
import { useNavigate } from 'react-router-dom';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import { PayPalButton } from 'react-paypal-button-v2'

const PaymentPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const navigate = useNavigate()
  const [sdkReady , setSdkReady] = useState(false)

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    adress: '',
    city: ''
  })
  const [form] = Form.useForm();

  const dispatch = useDispatch()


  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        adress: user?.adress,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

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

  const mutationUpdate = useMutationHook(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )

  const mutationAddOrder = useMutationHook(
    (data) => {
      const {
        token,
        ...rest 
      } = data
      const res = OrderService.createOrder(
        {...rest},
        token,
      )
      return res
    }
  )

  const {isLoading, data, isSuccess} = mutationUpdate
  const {isLoading: isLoadingDataOrder, data: dataOrder, isSuccess: isSuccessUpdate, isError} = mutationAddOrder

  const handleAddOrder = () => {
    if(user?.access_token, user?.name, user?.adress,user?.phone, user?.city ){
      
      mutationAddOrder.mutate({token: user?.access_token,
      orderItems: order?.orderItemSelected,
      fullName: user?.name,
      address: user?.adress,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      itemPrice: priceMemo,
      shippingPrice: priceDeliveryMemo,
      totalPrice: totalPrice,
      delivery: delivery,
      user: user?.id,
      email: user?.email
      })
    }
  }

useEffect(() => {
  if(isSuccessUpdate && dataOrder?.status === 'OK'){
    const arrayOrdered = []
    order?.orderItemSelected?.forEach(item => {
      arrayOrdered.push(item.product)
    });
    dispatch(removeAllOrderProduct({isChecked: arrayOrdered}))
    message.success('Đã đặt hàng thành công')
    navigate('/orderSuccess', {
      state: {
        delivery,
        payment,
        orders: order?.orderItemSelected,
        totalPrice: totalPrice,
        priceDelivery:  priceDeliveryMemo,
      }
    })
  } else if (dataOrder?.status === 'ERR' && dataOrder?.message === 'Không đủ hàng'){
    message.error('Trong đơn hàng của bạn có sản phẩm không dủ hàng')
  }
},[isError,isSuccessUpdate])

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

 
  const handleUpdateInforUser = () => {
    const {name, address,city, phone} = stateUserDetails
    if(name && address && city && phone){
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name, address,city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

 const handleOnChangeDelivery = (e) => {
    setDelivery(e.target.value)
 }

 const onChangePayment = (e) => {
  setPayment(e.target.value)
 }

 const addPaypalScript = async () => {
  const { data } = await PayMentService.getPaymentConfig()
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
  script.async = true;
  script.onload = () => {
    setSdkReady(true)
  }
  document.body.appendChild(script)
 }

 const onSuccessPaypal = (details, data) => {
       mutationAddOrder.mutate(
    { 
      token: user?.access_token,
      orderItems: order?.orderItemSelected,
      fullName: user?.name,
      address: user?.adress,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      itemPrice: priceMemo,
      shippingPrice: priceDeliveryMemo,
      totalPrice: totalPrice,
      delivery: delivery,
      user: user?.id,
      isPaid :true,
      paidAt: details.update_time, 
      email: user?.email
    }
  )
}

useEffect(() => {
  if(!window.paypal) {
    addPaypalScript()
  }else {
    setSdkReady(true)
  }
}, [])

  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <Loading isLoading={isLoadingDataOrder}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h3>Thanh toán</h3>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức giao hàng</Lable>
                  <WrapperRadio onChange={handleOnChangeDelivery} value={delivery}> 
                    <Radio  value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio  value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={onChangePayment} value={payment}> 
                    <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
              <div style={{width: '100%'}}>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ: </span>
                    <span style={{fontWeight: 'bold'}}>{ `${user?.adress} ${user?.city}`} </span>
                    <span onClick={handleChangeAddress} style={{color: '#9255FD', cursor:'pointer'}}>Thay đổi</span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <span>Đã được giảm giá</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }} >{convertPrice(discountPriceMemo)}</span>
                </div>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span>Tạm tính</span>
                    <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span>Phí giao hàng</span>
                    <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDeliveryMemo)}</span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span>Tổng tiền</span>
                  <span style={{display:'flex', flexDirection: 'column'}}>
                    <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPrice)}</span>
                    <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                  </span>
                </WrapperTotal>
              </div>
              
              {
                payment === 'paypal' && sdkReady ? (
                  <div style={{width: '320px'}}>
                  <PayPalButton
                    amount={Math.round(totalPrice / 30000)}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert('Error')
                    }}
                  />
                </div>
                ) : (
                  <ButtonComponent
                  size={40}
                  onClick={handleAddOrder}
                  styleButton={{
                    backgroundColor: 'rgb(255, 57, 69)',
                    height: '48px',
                    width: '220px',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                  textButton={'Đặt hàng'}
                  styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '500' }} />
                )
              }
            </WrapperRight>
          </div>
        </div>
        <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
          <Loading isLoading={isLoading}>
          <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please input your city!' }]}
              >
                <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your  phone!' }]}
              >
                <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
              </Form.Item>

              <Form.Item
                label="Adress"
                name="adress"
                rules={[{ required: true, message: 'Please input your  adress!' }]}
              >
                <InputComponent value={stateUserDetails.adress} onChange={handleOnchangeDetails} name="adress" />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  )
}

export default PaymentPage