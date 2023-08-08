import { Col, Image, InputNumber, Rate, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import ImageProduct from '../../assets/images/ImageProduct.webp'
import ImageProductSmall from '../../assets/images/ImageProductSmall.webp'
import { WrapperAdress, WrapperImageSmall, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQuantityProduct, WrapperStyleProductName } from './style'
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { addOrderProduct } from '../../redux/slides/orderSlide'
import Loading from '../LoadingComponent/Loading'
import ModalComponent from '../ModalComponent/ModalComponent'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'
import { initFaceBookSDK } from '../../utils/utils'
import { useNavigate } from 'react-router-dom'

const ProductDetailComponent = ({idProduct}) => {
    const dispatch = useDispatch()
    // const [isOpenModalUpdateInfoNotice, setIsOpenModalUpdateInfoNotice] = useState(false)
    const [numValueProduct, setNumValueProduct] = useState(1)
    const navigate = useNavigate()
    const [isOpenModalDelete,setIsOpenModalDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const onChange = (e) => { 
        setNumValueProduct(Number(e.target.value))
     }

    // const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct })
    
    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        const res = await ProductService.getDetailsProduct(id)
        return res.data
    }

    

    const handleOnChangeCount = (type) => {
        if(type === 'increase') {
            setNumValueProduct(numValueProduct + 1)
        } else if ( type === 'decrease' && numValueProduct > 1 ) {
            setNumValueProduct(numValueProduct - 1)
        }
    }

    // const renderStar = (num) => {
    //     const star = []
    //     for(let i=0; i < num; i++ ) {
    //             star.push(<StarFilled style={{ fontSize: "12px", color: 'yellow' }} />)
    //     }
    //     return star
    // }

    useEffect(() => {
        initFaceBookSDK()
    })

    
    const {isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled: !!idProduct })
    
    const handleCancel = () => {
        setIsOpenModalDelete(false)
    }

    const handleNavigateRegister = () => {
        navigate('/sign-in')
    }

    const handleAddOrderProduct = () => {
        if (!user?.access_token) {
            setIsOpenModalDelete(true)
        }
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numValueProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              discount: productDetails?.discount,
              product: productDetails?._id,
            },
          })
        );
      };

    return (
        <Loading isLoading={isLoading}>
        <Row style={{ padding: '16px', backgroundColor: '#fff', paddingRight:'8px', borderRadius:'4px' }}>
            <Col span={10} style={{ borderRight: ' 1px solid #e5e5e5' }}>
                <Image src={productDetails?.image} preview={false} alt='ImageProduct' />
                {/* <Row style={{ paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <Col span={4}>
                        <WrapperImageSmall src={ImageProductSmall} preview={false} alt='ImageProductSmall' />
                    </Col>
                    <Col span={4}>
                        <WrapperImageSmall src={ImageProductSmall} preview={false} alt='ImageProductSmall' />
                    </Col>
                    <Col span={4}>
                        <WrapperImageSmall src={ImageProductSmall} preview={false} alt='ImageProductSmall' />
                    </Col>
                    <Col span={4}>
                        <WrapperImageSmall src={ImageProductSmall} preview={false} alt='ImageProductSmall' />
                    </Col>
                    <Col span={4}>
                        <WrapperImageSmall src={ImageProductSmall} preview={false} alt='ImageProductSmall' />
                    </Col>
                    <Col span={4}>
                        <WrapperImageSmall src={ImageProductSmall} preview={false} alt='ImageProductSmall' />
                    </Col>
                </Row> */}
            </Col>
            <Col span={14} style={{ paddingLeft:'10px'}}>
                <WrapperStyleProductName>{productDetails?.name}</WrapperStyleProductName>
                <div>
                    <Rate allowHalf value={productDetails?.rating} disabled={true} />
                    {/* {renderStar(productDetails?.rating)} */}
                    {/* <StarFilled style={{ fontSize: "12px", color: 'yellow' }} />
                    <StarFilled style={{ fontSize: "12px", color: 'yellow' }} />
                    <StarFilled style={{ fontSize: "12px", color: 'yellow' }} /> */}
                    <span>| Đã bán {productDetails?.selled} </span>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct>{productDetails?.price.toLocaleString()}</WrapperPriceTextProduct>
                </WrapperPriceProduct>
                <WrapperAdress>
                    <span>Giao đến  </span>
                    <span className='adress'>{user?.adress}</span>
                    {/* <span className='changeAdress'>Đổi </span> */}
                </WrapperAdress>
                <LikeButtonComponent dataHref="https://developers.facebook.com/docs/plugins/" />
                <WrapperQuantityProduct>
                    <span>Sô lượng</span>
                    <div style={{ display: 'flex', alignItems: 'center' }} >
                        <ButtonComponent
                            styleButton={{ border: '1px solid #000 ', borderRadius: '0px' }}
                            icon={<MinusOutlined style={{ color: '#000', fontSize: '16px', width: '20px' }} />}
                            onClick={() => handleOnChangeCount('decrease')} />
                        <WrapperInputNumber value={numValueProduct} onChange={onChange} />
                        <ButtonComponent
                            styleButton={{ border: '1px solid #000', borderRadius: '0px' }}
                            icon={<PlusOutlined style={{ color: '#000', fontSize: '16px', width: '20px' }} />} 
                            onClick={() => handleOnChangeCount('increase')}  />
                    </div>
                </WrapperQuantityProduct>
                <div style={{ display: ' flex', alignItems: 'center', gap: '12px', paddingLeft:'10px' }}>
                    <ButtonComponent
                        styleButton={{ backgroundColor: 'rgb(255, 57, 69)', width: '220px', height: '48px' }}
                        size={40}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        onClick={handleAddOrderProduct}
                        textButton={'Chọn mua'}
                    />
                    {/* <ButtonComponent
                        styleButton={{ backgroundColor: '#fff', width: '220px', height: '48px', border:'1px solid rgb(13, 92, 182)' }}
                        size={40}
                        styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px', fontWeight: '700' }}
                        textButton={'Mua tra sau'}
                    /> */}
                </div>
            </Col>
                    <CommentComponent dataHref="https://developers.facebook.com/docs/plugins/comments#configurator" width="1270" />
        </Row>
        <ModalComponent title="Chưa có tài khoản" open={isOpenModalDelete} onCancel={handleCancel} onOk={handleNavigateRegister} >   
                    <div>Vui lòng đăng nhập trước khi vào giỏ hàng của mình </div>  
            </ModalComponent>
        </Loading>
    )
}

export default ProductDetailComponent