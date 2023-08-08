import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceItem, WrapperReportText } from './style'
import { StarFilled } from '@ant-design/icons'
import official from '../../assets/images/official.png'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils/utils'

const CardComponent = (props) => {
    const { 
    countInStock,
    description, 
    image,
    name,
    price,
    rating,
    selled,
    discount,
    type,
id } = props
        const navigate = useNavigate()
        const handleDetailsProduct = (id) => {
            navigate(`/product-details/${id}`)
        }

    return (
        <WrapperCardStyle
            hoverable
            style={{ width: 200 }}
            bodyStyle={{ padding: "10px" }}
            cover={<img alt="example" src={image} style={{ objectFit: 'scale-down' }} />}
            onClick={() => countInStock !==0 && handleDetailsProduct(id)}
            disabled={countInStock === 0 ? true : false}
        >
            <img src={official} style={{ position: 'absolute', width: '68px', height: '14px', top: '-1px', left: '-1px' }} />
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span>{rating}<StarFilled style={{ fontSize: "12px", color: 'yellow' }} /> </span>
                <span>Da ban {selled || 0}</span>
            </WrapperReportText>
            <WrapperPriceItem>
                {convertPrice(price)}
                <WrapperDiscountText>
                    -{discount || 5} %
                </WrapperDiscountText>
            </WrapperPriceItem>
        </WrapperCardStyle>
    )
}

export default CardComponent