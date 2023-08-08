import { Button } from 'antd'
import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
    const { size, placeholder, textButton,
        backgroundColorButton = 'rgb(13, 92, 182)',
        colorButton = '#fff' } = props
    return (
        <div style={{ display: 'flex' }}>
            <InputComponent
                style={{ borderRadius: '0px', border: 'none' }}
                size={size}
                placeholder={placeholder}
                {...props} />
            <ButtonComponent
                styleButton={{ borderRadius: '0px', border: 'none', backgroundColor: backgroundColorButton }}
                size={size}
                icon={<SearchOutlined />}
                textButton={textButton}
                styleTextButton={{color: colorButton}}
            />
        </div>
    )
}

export default ButtonInputSearch