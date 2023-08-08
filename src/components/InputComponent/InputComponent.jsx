import { Input } from 'antd'
import React from 'react'

const InputComponent = ({ size, placeholder, style, ...rests }) => {
    return (
        <Input
            style={{ borderRadius: '0px', border: 'none' }}
            size={size}
            placeholder={placeholder}
            {...rests}
        />
    )
}

export default InputComponent