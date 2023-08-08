import React, { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavBar, WrapperPagination, WrapperProducts } from './style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'

const TypeProductPage = () => {
    const ratingProduct = useSelector((state) => state?.product.rating)
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 1000)
    const [limit, setLimit] = useState(3)
    const {state} = useLocation()
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 4,
        total:0
    })

        const fetchProductType = async (type, page, limit) => {
        // const limit = context?.queryKey && context?.queryKey[1]
            const res = await ProductService.getProductType(type, page, limit)
            if(res?.status === 'OK') {
                setProducts(res?.data)
                setPanigate({...panigate, total: res?.totalPage})
           } 
        }

        const onChange = (current, pageSize) => { 
            setPanigate({page: current - 1 , limit: pageSize, ...panigate })
            fetchProductType(state, current - 1 , pageSize)
         }

    useEffect(() => {
        if(state) {
            setIsLoading(true)
            fetchProductType(state, panigate.page, panigate.limit)
            setIsLoading(false)    
        }
    },[state,panigate.page, panigate.limit])

    useEffect(() => {
        fetchProductType(state, panigate.page, panigate.limit); 
      }, [panigate.page])

    return (
        <Loading isLoading={isLoading}>
        <div style={{ width:'100%', background:'#efefef', height: 'calc(100vh - 64px)'}}>
        <div style={{ width:'1270px', margin:'0 auto', height:'100%' }}>
            <Row style={{ paddingTop: '16px', display: 'flex', flexWrap: 'nowrap', height: 'calc(100vh - 80px)'}}>
                <WrapperNavBar span={4}>
                    <NavBar />
                </WrapperNavBar>
                <WrapperProducts span={20}>
                    {products?.filter((pro) => {
                        if(searchDebounce === '' && pro?.rating >= ratingProduct) {
                            return pro
                        } else if (pro?.name.toLowerCase().includes(searchDebounce.toLowerCase()) && ratingProduct === 0) {
                            return pro
                        } else if (pro?.name.toLowerCase().includes(searchDebounce.toLowerCase()) && pro?.rating >= ratingProduct ) {
                            return pro
                        }
                    })?.map((product) => {
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
            </Row>
            <WrapperPagination>
                <Pagination showQuickJumper defaultCurrent={panigate.page} pageSize={panigate.limit} total={panigate.total}  onChange={onChange} />
            </WrapperPagination>
        </div>
        </div>
        </Loading>
    )
}

export default TypeProductPage