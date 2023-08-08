import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailPage = () => {
  const navigate = useNavigate()
  const {id} =useParams()
  return (
    <div style={{ padding: '0 120px', background: '#efefef' }}>
    <h5 style={{ fontSize: '24px' }} ><span style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}> Trang chủ</span> --- Chi tiết sản phẩm</h5>
    <ProductDetailComponent idProduct={id} />
    </div>
  )
}

export default ProductDetailPage