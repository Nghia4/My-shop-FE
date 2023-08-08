import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../../components/LoadingComponent/Loading'
import { convertPrice, formatDay } from '../../utils/utils'
import { useLocation, useParams } from 'react-router-dom'
import { WrapperBottom, WrapperContainer, WrapperContent, WrapperHeaderInfoStyle, WrapperLeftBottom, WrapperRightBottom, WrapperStyleHeaderDate } from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { orderConstant } from '../../constant'

const MyOrderDetailsPage = () => {
  const location = useLocation()
  const { state } = location
  const user = useSelector((state) => state.user)
  const params = useParams()
  const { id } = params
  const fetchUserOrderDetails = async () => {
    const res = await OrderService.getMyDetailOrder(id, state?.token)
    return res.data
  }
  const queryOrderDetail = useQuery({ queryKey: ['dataOrder-details'], queryFn: fetchUserOrderDetails }, {
    enabled: id && state?.token
  })

   const { isLoading, data } = queryOrderDetail
  return (
    <Loading isLoading={isLoading}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <WrapperContainer>
              <WrapperHeaderInfoStyle>
              <div style={{ fontSize: '20px', fontWeight: '700',display:'flex', flexDirection:'column', gap: '6px' }}>
                Địa chỉ giao hàng
                <div style={{ fontSize: '16px', fontWeight: '400' }} >Người nhận : <span style={{ fontSize: '16px', fontWeight: 'bold' }}> {data?.shippingAddress?.fullName}</span></div>
                <div style={{ fontSize: '16px', fontWeight: '400' }} >Địa chỉ : <span style={{ fontSize: '16px', fontWeight: 'bold' }}> {data?.shippingAddress?.address}</span></div>
                <div style={{ fontSize: '16px', fontWeight: '400' }} >Thành phố : <span style={{ fontSize: '16px', fontWeight: 'bold' }}> {data?.shippingAddress?.city}</span></div>
                <div style={{ fontSize: '16px', fontWeight: '400' }} >Số điện thoại : <span style={{ fontSize: '16px', fontWeight: 'bold' }}> {data?.shippingAddress?.phone}</span></div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700',display:'flex', flexDirection:'column', gap: '6px' }} >
                Phương thức giao hàng
                <div style={{color: '#ea8500', fontWeight: 'bold'}} >{orderConstant.delivery[data?.delivery]}: Giao hàng tiết kiệm</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Chi phí vận chuyển: <span style={{ color: '#c0782d' }}> {convertPrice(data?.shippingPrice)}</span>
                  </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700',display:'flex', flexDirection:'column', gap: '6px' }} >
                Hình thức thanh toán
                <div style={{ fontSize: '16px', fontWeight: '400'}}>
                  {data?.paymentMethod === 'later_money' ? 'Thanh toán khi nhận hàng' : 'Thanh toán bằng Paypal'}        
                </div>
                <div style={{color: '#ea8500', fontWeight: 'bold'}} > {data?.isPaid === false ? 'Chưa thanh toán' : 'Đã thanh toán'}</div>
              </div>
              </WrapperHeaderInfoStyle>
              <WrapperStyleHeaderDate>
                <div>
                  {formatDay(data?.createdAt)}
                </div>
              </WrapperStyleHeaderDate>
              <div style={{ width: '100%', padding: '6px', fontWeight: 'bold' }}>Đơn hàng :</div>
              <div style={{ width: '100%', padding: '12px', margin: '12px' }}>
                {data?.orderItems?.map((item) => {
                  return (
                    <WrapperContent>

                      <div>
                        <img style={{ width: '80px', objectFit: 'contain' }} src={item?.image} alt='ảnh sản phẩm'></img>
                      </div>

                      <div style={{ width: '125px', overflow: 'hidden' }}>
                        <span>{item?.name}</span>
                      </div>
                      <div>
                        Số lượng: {item?.amount}
                      </div>
                      <div>
                        Đã được giảm giá: {convertPrice(item?.price * (item?.discount / 100))}
                      </div>
                      <div>
                        Thành tiền : {convertPrice((item?.amount * item?.price) - (item?.price * (item?.discount / 100)))}
                      </div>
                    </WrapperContent>
                  )
                })}
              </div>
              <WrapperBottom>
                <WrapperLeftBottom>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Tổng tiền : <span style={{ color: '#ed0f0f' }} > {convertPrice(data?.totalPrice)}</span>
                  </div>
                </WrapperLeftBottom>
                <WrapperRightBottom>
                 
                </WrapperRightBottom>
              </WrapperBottom>
            </WrapperContainer>
      </div>
    </Loading>
  )
}

export default MyOrderDetailsPage