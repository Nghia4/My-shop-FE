import { Button } from 'antd'
import React from 'react'
import { SearchOutlined } from '@ant-design/icons'

const ButtonComponent = ({size, styleButton,styleTextButton,textButton, disabled, ...rests }) => {
    return (
        <Button
            style={{...styleButton, background: disabled ? '#ccc': styleButton.backgroundColor}}
            size={size}
            // icon={<SearchOutlined />}
            {...rests}
            >
          <span style={styleTextButton}>{textButton}</span> 
        </Button>
    )
}

export default ButtonComponent