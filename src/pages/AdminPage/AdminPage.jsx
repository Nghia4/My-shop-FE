import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { getItem } from '../../utils/utils';
import { UserOutlined, DatabaseOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUsers from '../../components/AdminUsers/AdminUsers';
import AdminProducts from '../../components/AdminProducts/AdminProducts';
import AdminUserOrder from '../../components/AdminUserOrder/AdminUserOrder';

const AdminPage = () => {
  const rootSubmenuKeys = ['user', 'product', 'order']
  const [keySelected, setKeySelected] = useState(['user'])
  const [openKeys, setOpenKeys] = useState(['user']);

  const items = [
    getItem('Người dùng', 'user', <UserOutlined />),
    getItem('Sản phẩm', 'product', <DatabaseOutlined />,),
    getItem('Thống kê đơn đặt hàng', 'order', <ShoppingCartOutlined />)
  ];

  useEffect(() => {
    renderPage(['user'])
  })

  const renderPage = (key) => {
    switch(key) {
      case 'user':
        return (
          <AdminUsers />
        )
        case 'product':
        return (
          <AdminProducts />
        )
        case 'order':
          return (
            <AdminUserOrder />
          )
        default:
          return <></>
    }
  }

 

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  }

  const handleOnClick = ({key}) => {
    setKeySelected(key)
  }

  return (
    <>
    <HeaderComponent isHiddenSearch isHiddenCart />
    <div style={{ display: 'flex'}} >
    <Menu 
      mode='inline'
      openKeys={openKeys['user']}
      onOpenChange={onOpenChange}
      style={{
        width: 256,
        boxShadow: '1px 1px 2px #ccc',
        height: '100vh',
      }}
      items={items}
      onClick={handleOnClick}
      />
      <div style={{ flex: 1, padding: '15px'}}>
      {renderPage(keySelected)}
      </div> 
      </div>
      </>
  )
}

export default AdminPage