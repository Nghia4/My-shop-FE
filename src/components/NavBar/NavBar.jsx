import React, { useEffect, useState } from 'react'
import { WrapperContent, WrapperLabels, WrapperTextPrice, WrapperTextValue } from './style'
import { Rate } from 'antd'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import { Checkbox, Col, Row } from 'antd';
import { Radio } from 'antd';
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { checkProductRating } from '../../redux/slides/productSlide'

const NavBar = () => {
    const { state } = useLocation()
    const dispatch = useDispatch()
    const product = useSelector((state) => state?.product)
    const [products, setProducts] = useState([])
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 50,
        total: 0
    })

    const fetchProductType = async (type, page, limit) => {
        // const limit = context?.queryKey && context?.queryKey[1]
        const res = await ProductService.getProductType(type, page, limit)
        if (res?.status === 'OK') {
            setProducts(res?.data)
            setPanigate({ ...panigate, total: res?.totalPage })
        }
        return res.data
    }

    const fetchProductTypes = async (type, page, limit) => {
        // const limit = context?.queryKey && context?.queryKey[1]
        const res = await ProductService.getProductType(state, panigate.page, panigate.limit)
        return res.data
    }

    const queryProductType =  useQuery({ queryKey: ['productType'], queryFn: fetchProductTypes})
    const {data} = queryProductType

    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page, panigate.limit)
        }
    }, [state, panigate.page, panigate.limit])

    const onChange = (e) => {
        dispatch(checkProductRating(e.target.value))
      };
    const renderContent = (type, options) => {
        switch (type) {
            // case 'text':
            //     return options.map((option) => {
            //         return (
            //             <WrapperTextValue>{option}</WrapperTextValue>
            //         )
            //     })
            // case 'checkbox':
            //     return (
            //         <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange} >
            //             {options.map((option) => {
            //                 return (
            //                     <Checkbox value={option.value}>{option.label}</Checkbox>
            //                 )
            //             })}
            //             {/* <Checkbox value='B'>B</Checkbox> */}
            //         </Checkbox.Group>
            //     )
            case 'star':
                return options.map((option) => {
                    return (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                            <span>{`Từ ${option} sao trở lên`}</span>
                        </div>
                    )
                })
            case 'price':
                return options.map((option) => {
                    return (
                        <WrapperTextPrice>{option}</WrapperTextPrice>
                    )
                })
            default:
                return {}
        }
    }

    return (
        <div>
            <WrapperLabels>Lọc</WrapperLabels>
            <WrapperContent>
                {/* {renderContent('text', ['TU LANH', 'TV', 'MAY GIAT'])}
                {renderContent('checkbox', [
                    { value: 'a', label: 'A' },
                    { value: 'b', label: 'B' }
                ])} */}
                {/* {renderContent('star', [3, 4, 5])}
                {renderContent('price', ['tren 40.000', 'tren 100.000', 'tren 400.000'])} */}
            </WrapperContent>
            <Radio.Group
                style={{
                    width: '100%',
                }}
                onChange={onChange}
            >
                <Row>
                <Radio value={1}>{renderContent('star', [1])}</Radio>
                <Radio value={2}>{renderContent('star', [2])}</Radio>
                <Radio value={3}>{renderContent('star', [3])}</Radio>
                <Radio value={4}>{renderContent('star', [4])}</Radio>
                <Radio value={5}>{renderContent('star', [5])}</Radio>
                    
                    {/* <Col span={8}>
                        <Checkbox value="B">B</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value="C">C</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value="D">D</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value="E">E</Checkbox>
                    </Col> */}
                </Row>
            </Radio.Group>
        </div>
    )
}

export default NavBar