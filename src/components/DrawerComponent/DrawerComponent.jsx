import { Drawer } from 'antd'
import React from 'react'

const DrawerComponent = ({title = 'Drawer', placement = 'right', onClose, isOpen = false , children, ...rests }) => {
  return (
    <>
         <Drawer title={title} placement={placement} onClose={onClose} open={isOpen} {...rests}>
                {children}
      </Drawer>
    </>
  )
}

export default DrawerComponent