import React, { useEffect, useRef, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import '../HomePages/HomePage.css'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.webp'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'

export const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 1000)
    const [typeProduct, setTypeProduct] = useState([])
    const [limit, setLimit] = useState(4)
    const [loading, setLoading] = useState(false)
    
    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
       const res = await ProductService.getAllProduct(search, limit)
       return res
    }

    const fetchAllTypeProduct = async() => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProduct(res?.data)
        }
    }
   
    const {isLoading, data: products, isPreviousData } = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 1000, keepPreviousData : true })

useEffect(() => {
    fetchAllTypeProduct()
},[])

    return (
        <>
        <Loading isLoading={isLoading} >
            <div className='mainHomePage'>
                <WrapperTypeProduct>
                    {typeProduct?.map((item, index) => {
                        return (
                            <TypeProduct name={item} key={index} />
                        )
                    })}
                </WrapperTypeProduct>
            </div>
            <div id='container' style={{ backgroundColor: "#efefef", height: "auto" }}>
                <SliderComponent arrImages={[slider1, slider2]} />
                <WrapperProducts>
                    {products?.data?.map((product) => {
                        return (
                        <CardComponent 
                        key={product._id} 
                        countInStock={product.countInStock} 
                        description={product.description} 
                        image={product.image}
                        name={product.name}
                        price={product.price} 
                        rating={product.rating}
                        type={product.type}
                        selled={product.selled}
                        discount={product.discount}
                        id={product._id}
                        />
                        )
                    })}
                </WrapperProducts>
                {/* <NavBar /> */}
                <div className='moreButton'>
                    <WrapperButtonMore
                        textButton="Xem thêm"
                        type="outline"
                        disabled={products?.total === products?.data.length  || products?.totalPage === 1}
                        styleButton={{ border: '1px solid rgb(11, 116, 229)', color:`${products?.total === products?.data.length ? '#ccc' : 'rgb(11, 116, 229)'}`, width: '240px', height: '38px', borderRadius: '4px' }}
                        styleTextButton={{ fontWeight: '500', color:products?.total === products?.data.length && '#fff' }}
                        onClick={() => setLimit((prev) => prev + 6)}
                    />
                </div>
            </div>
            </Loading>
        </>
    )
}
