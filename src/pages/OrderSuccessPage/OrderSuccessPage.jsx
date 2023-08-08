import {Form, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { Lable, WrapperInfo, WrapperContainer, WrapperRadio, WrapperRight, WrapperTotal, WrapperCountOrder, WrapperItemOrder } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import * as  UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
// import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
// import * as PaymentService from '../../services/PaymentService'
import { useMutationHook } from '../../hooks/mutationHook';
import { convertPrice } from '../../utils/utils';
import * as message from '../../components/PopUpMessage/PopUpMessage'
import * as OrderService from '../../services/OrderService'
import { useLocation } from 'react-router-dom';
import { orderConstant } from '../../constant';
import { WrapperInputNumber } from '../../components/ProductDetailComponent/style';

const OrderSuccessPage = () => {
  const location = useLocation()
  const {state} = location
 
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <Loading isLoading={null}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h3>Dat hang thanh cong</h3>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Lable>Phương thức giao hàng</Lable>
                  
                    <div>
                    <span style={{color: '#ea8500', fontWeight: 'bold'}}>{orderConstant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm,
                    <span style={{color: '#ea8500', fontWeight: 'bold', paddingLeft: '12px'}} >Phí giao hàng: {convertPrice(state?.priceDelivery)}</span>
                    </div>
                  
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Phương thức thanh toán</Lable>
                  
                    <div>
                    <span style={{color: '#ea8500', fontWeight: 'bold'}}></span>{orderConstant.payment[state?.payment]}
                    </div>
                
                </div>
              </WrapperInfo>
              
              {state?.orders.map((order) => {
                return (   
              <WrapperItemOrder>
             
                <div style={{ width: '390px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <img src={order.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} alt='orderImage'></img>
                  <div style={{ 
                    width: 260,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                   }}
                  >{order?.name}</div>
                </div>
                <div style={{ width: '488px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                  <span>
                    <span style={{ fontSize: '13px', color: '#242424' }} >Giá tiền :{convertPrice(order?.price)}</span>
                  </span>
                  <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px' }} >Số lượng :{order?.amount}</span> 
                  <span style={{ fontSize: '13px'}} >Đã được giảm  : <span style={{ fontSize: '13px', color: 'rgb(255, 66, 78)' }} >{convertPrice((order?.price * (order?.discount / 100)) * order?.amount)}</span></span>
                </div>
              </WrapperItemOrder>     
                )
              })}    
            <div>
            <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px' }} >Tổng tiền :{convertPrice(state?.totalPrice)}</span>
            </div>
            </WrapperContainer>
          </div>
        </div>
      </Loading>
    </div>
  )
}

export default OrderSuccessPage