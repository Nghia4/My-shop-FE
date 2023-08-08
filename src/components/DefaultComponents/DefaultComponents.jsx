import React from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'

const DefaultComponents = ({children}) => {
  return (
    <div>
        <HeaderComponent />
        {children}
    </div>
  )
}

export default DefaultComponents