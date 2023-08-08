import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Radio, Space } from 'antd'
import TableComponent from '../TableComponents/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponent/Loading'
import { WrapperUploadFile } from '../../pages/ProfilePage/style'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { orderConstant } from '../../constant'
import './index.css';

const AdminUserOrder = () => {
    const user = useSelector((state) => state?.user)
    const [rowSelected, setRowSelected] = useState('')
    const searchInput = useRef(null);
   
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };

    // filter
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm({ closeDropdown: true }), dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button> */}
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder()
        return res
    }

    const queryOrder = useQuery({ queryKey: ['order'], queryFn: getAllOrder })
    const { isLoading: isLoadingUser, data: orders } = queryOrder

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            sorter: (a, b) => a._id - b._id,
        },
        {
            title: 'User name',
            dataIndex: 'fullName',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.fullName.length - b.fullName.length,
            ...getColumnSearchProps('fullName')
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone,
            //   filterIcon :   <SearchOutlined />
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.address - b.address,
            // filters: [
            //     {
            //         text: 'TRUE',
            //         value: true
            //     },
            //     {
            //         text: 'FALSE',
            //         value: false
            //     },
            // ],
            // onFilter: (value, record) => {
            //     if (value === true ) {
            //         return record.isAdmin === 'TRUE'
            //     } else {
            //         return record.isAdmin === 'FALSE'
            //     }
            // }
        },
        {
            title: 'City',
            dataIndex: 'city',
            sorter: (a, b) => a.city - b.city,
            ...getColumnSearchProps('city')

        },
        {
            title: 'isPaid',
            dataIndex: 'isPaid',
            sorter: (a, b) => a.isPaid - b.isPaid,
            ...getColumnSearchProps('totalPrice')

        },
        {
            title: 'Shipment method',
            dataIndex: 'delivery',
            sorter: (a, b) => a.isPaid - b.isPaid,
            ...getColumnSearchProps('totalPrice')

        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            sorter: (a, b) => a.paymentMethod - b.paymentMethod,
            ...getColumnSearchProps('paymentMethod')

        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            ...getColumnSearchProps('totalPrice')

        },
        // {
        //     title: 'Action',
        //     dataIndex: 'action',
        //     render: renderAction,
        // },
    ];
    const dataTable = Array.isArray(orders?.data) && orders?.data?.map((order) => {
        return {
            ...order, key: order._id, shippingAddress: order.shippingAddress , 
            fullName: order.shippingAddress.fullName, phone: order.shippingAddress.phone,
            address: order.shippingAddress.address, isPaid: order?.isPaid ? 'TRUE' : 'FALSE', city: order.shippingAddress.city,
            delivery: order?.delivery === 'fast' ? orderConstant.delivery.fast : orderConstant.delivery.gojek,
            paymentMethod: order?.paymentMethod === 'later_money' ? orderConstant.payment.later_money : orderConstant.payment.paypal
        }
    }
    )

    return (
        <div className='adminUserOrder'>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ marginTop: '20px' }} >
                <TableComponent  data={dataTable} isLoading={isLoadingUser} columns={columns} onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            setRowSelected(record._id)
                        }
                    }
                }}  />
            </div>
            <ModalComponent title="Xóa người dùng" open={null} onCancel={null} onOk={null} >
                <Loading isLoading={null} >
                    {/* <div>Bạn có chắc muốn xóa người dùng `"{stateUserDetails?.name}"` này không?</div> */}
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminUserOrder