import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../../components/LoadingComponent/Loading'
import { convertPrice, formatDay } from '../../utils/utils'
import { useLocation, useNavigate } from 'react-router-dom'
import { WrapperBottom, WrapperContainer, WrapperContent, WrapperLeftBottom, WrapperRightBottom, WrapperStyleHeaderDate } from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useMutationHook } from '../../hooks/mutationHook'
import * as message from '../../components/PopUpMessage/PopUpMessage'

const OrderHistoryPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const fetchUserOrder = async () => {
    const res = await OrderService.getDetailOrder(state?.id, state?.token)
    return res.data
  }
  const queryOrder = useQuery({ queryKey: ['dataOrder'], queryFn: fetchUserOrder }, {
    enabled: state?.id && state?.token
  })

  const handleNavigateDetailOrder = (id) => {
    navigate(`/my-order-details/${id}`, {
      state: {
        token: state?.token
      }
    })
  }

  const mutationDelete = useMutationHook(
    (data) => {
      const { id, token , orderItems, userId} = data
      const res = OrderService.deleteOrder(
        id, token,orderItems, userId
      )
      return res
    }
  )

  const handleDeleteOrder = (order) => {
    mutationDelete.mutate({id : order._id, token:state?.token, orderItems: order?.orderItems, userId: user?.id },{
      onSuccess: () => {
        queryOrder.refetch()
      }
    })
  }

  const {  isLoading: isLoadingDelete, isError: isErrorDeleted, isSuccess: isSuccessDeleted, data: dataDeleted } = mutationDelete
  
  useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.status === 'OK') {
      message.success('Đã hủy đơn hàng thành công')
    } else if(isErrorDeleted && dataDeleted?.status === 'ERR') {
      message.error('Xóa không thành công , xin hãy thử lại')
    }
  },[isSuccessDeleted,isErrorDeleted])

  const { isLoading, data } = queryOrder
  return (
    <Loading isLoading={isLoading}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        {data?.map((items) => {
          return (
            <Loading isLoading={isLoadingDelete}>
            <WrapperContainer>
              <WrapperStyleHeaderDate>
                <div>
                  {formatDay(items?.createdAt)}
                </div>
              </WrapperStyleHeaderDate>
              <div style={{ width: '100%', padding: '6px', fontWeight: 'bold' }}>Đơn hàng :</div>
              <div style={{ width: '100%', padding: '12px', margin: '12px' }}>
                {items?.orderItems?.map((item) => {
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
                        Đơn giá sản phẩm: {convertPrice(item?.price)}
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
                    Chi phí vận chuyển: <span style={{ color: '#c0782d' }}> {convertPrice(items?.shippingPrice)}</span>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Tổng tiền : <span style={{ color: '#ed0f0f' }} > {convertPrice(items?.totalPrice)}</span>
                  </div>
                </WrapperLeftBottom>
                <WrapperRightBottom>
                  <ButtonComponent
                    styleButton={{ backgroundColor: 'rgb(57, 98, 253)', width: '180px', height: '36px' }}
                    size={40}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    onClick={() => handleDeleteOrder(items)}
                    textButton={'Hủy đơn hàng'}
                  />
                   <ButtonComponent
                    styleButton={{ backgroundColor: 'rgb(57, 98, 253)', width: '180px', height: '36px' }}
                    size={40}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    onClick={() => handleNavigateDetailOrder(items?._id)}
                    textButton={'Xem chi tiết'}
                  />
                </WrapperRightBottom>
              </WrapperBottom>
            </WrapperContainer>
            </Loading>
          )
        })}

      </div>
    </Loading>
  )
}

export default OrderHistoryPage