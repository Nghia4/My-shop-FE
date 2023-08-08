import { Modal } from 'antd'
import React from 'react'

const ModalComponent = ({title = 'Modal', isOpen = false, onCancle, children, ...rests}) => {
  return (
    <Modal title={title} isOpen={isOpen} onCancel={onCancle} {...rests} >
        {children}
    </Modal>
  )
}

export default ModalComponent