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
import * as UserService from '../../services/UserService'
import * as message from '../../components/PopUpMessage/PopUpMessage'
import { useMutationHook } from '../../hooks/mutationHook'
import { getBase64 } from '../../utils/utils'
import { useQuery } from '@tanstack/react-query'

const AdminUsers = () => {
    const [form] = Form.useForm()
    const [forms] = Form.useForm()
    const user = useSelector((state) => state?.user)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)
    // const [searchText, setSearchText] = useState('');
    // const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        password:'',
        isAdmin: false,
        phone: '',
        adress:'',
        avatar:''
    })
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        isAdmin: '',
        phone: '',
        adress:'',
        avatar:''
    })
    const [isAdmin, setIsAdmin] = useState(stateUserDetails.isAdmin)

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
        // render: (text) =>
        //   searchedColumn === dataIndex ? (
        //     <Highlighter
        //       highlightStyle={{
        //         backgroundColor: '#ffc069',
        //         padding: 0,
        //       }}
        //       searchWords={[searchText]}
        //       autoEscape
        //       textToHighlight={text ? text.toString() : ''}
        //     />
        //   ) : (
        //     text
        //   ),
    });

    // fetch User details
    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailUser(rowSelected)
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                isAdmin: res?.data?.isAdmin,
                phone: res?.data?.phone,
                adress: res?.data?.adress,
                avatar: res?.data?.avatar
            })
        }
    }

    useEffect(() => {
        forms.setFieldsValue(stateUserDetails)
        if (isOpenDrawer === false) {
            forms.setFieldsValue(stateUserDetails)
        }
    }, [forms, stateUserDetails])

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected])

    const handleDetailsUser = () => {
        setIsOpenDrawer(true)
    }

    const renderAction = () => {
        return (
            <div style={{ gap: '12px' }}>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => { setIsOpenModalDelete(true) }} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsUser} />
            </div>
        )
    }

    const mutation = useMutationHook(
        (data) => {
            const {
                name, price, type, rating, description, image, countInStock
            } = data
            const res = UserService.signupUser({
                name, price, type, rating, description, image, countInStock
            })
            return res
        }
    )

    const mutationUpdate = useMutationHook(
        (data) => {
            const {
                id,
                token,
                ...rests } = data
            const res = UserService.updateUser(
                id, token,
                { ...rests })
            return res
        }
    )

    const mutationDelete = useMutationHook(
        (data) => {
            const {
                id,
                token } = data
            const res = UserService.deleteUser(
                id, token)
            return res
        }
    )

    const mutationDeleteMany = useMutationHook(
        (data) => {
            const {
                token,
                ...ids
             } = data
            const res = UserService.deleteManyUser(
                 token, ids)
            return res
        }
    )

    const getAllUser = async () => {
        const res = await UserService.getAllUser()
        return res
    }

    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrored } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isLoading: isLoadingMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedmany } = mutationDelete
    const queryUser = useQuery({ queryKey: ['user'], queryFn: getAllUser })
    const { isLoading: isLoadingUser, data: users } = queryUser

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.price - b.price,
            //   filterIcon :   <SearchOutlined />
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: 'TRUE',
                    value: true
                },
                {
                    text: 'FALSE',
                    value: false
                },
            ],
            onFilter: (value, record) => {
                if (value === true ) {
                    return record.isAdmin === 'TRUE'
                } else {
                    return record.isAdmin === 'FALSE'
                }
            }
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.type - b.type,
            ...getColumnSearchProps('type')

        },
        {
            title: 'Adress',
            dataIndex: 'adress',
            sorter: (a, b) => a.type - b.type,
            ...getColumnSearchProps('adress')

        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
    const dataTable = Array.isArray(users?.data) && users?.data?.map((user) => {
        return {
            ...user, key: user._id, isAdmin: user?.isAdmin ? 'TRUE' : 'FALSE'
        }
    }
    )


    useEffect(() => {
        form.resetFields()
        if (isSuccess && data.status === 'OK') {
            message.success()
            handleCancel()
        } else {
            message.error()
        }
    }, [isSuccess])

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated.status === 'OK') {
            message.success()
            handleCloseDrawer()
        } else if (isErrored) {
            message.error()
        }
    }, [isSuccessUpdated])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])

    // useEffect(() => {
    //     if (isSuccessDeletedMany && dataDeletedMany.status === 'OK') {
    //         message.success()
    //     } else if (isErrorDeletedmany) {
    //         message.error()
    //     }
    // }, [isSuccessDeletedMany])

    const handleDeleteManyUsers = (ids) => {
        mutationDeleteMany.mutate({  token:user?.access_token, ids: ids, }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setStateUser({
            ...stateUser,
            avatar: file.preview
        })
    }

    const handleOnChangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setStateUser({
        name: '',
        email: '',
        isAdmin: false,
        phone: ''
        })
    };

    const handleCancelDelete = () => {
        setIsOpenModalDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDelete.mutate({ id: rowSelected, access_token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false)
        setStateUserDetails({
            name: '',
        email: '',
        isAdmin: '',
        phone: ''
        })
    };

    const onFinish = () => {
        mutation.mutate(stateUser, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
        form.resetFields()
    }

    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
        setRowSelected('')
    }

    const handleOnChange = (e) => {
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            {/* <div style={{ marginTop: '10px' }} >
                <Button onClick={() => { setIsModalOpen(true) }} style={{
                    height: '150px',
                    width: '150px',
                    borderRadius: '6px',
                    borderStyle: 'dashed'
                }}>
                    <PlusOutlined style={{ fontSize: '60px' }} />
                </Button>
            </div> */}
            
            <div style={{ marginTop: '20px' }} >
                <TableComponent handleDeleteMany={handleDeleteManyUsers} data={dataTable} isLoading={isLoadingUser} columns={columns} onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            setRowSelected(record._id)
                        }
                    }
                }}  />
            </div>
            <ModalComponent title="Tạo người dùng" open={isModalOpen} onCancel={handleCancel} footer={null} >
                <Loading isLoading={isLoading} >
                    <Form
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 18,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input User name',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.name} onChange={handleOnChange} name='name' />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Type',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.email} onChange={handleOnChange} name='email' />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your count InStock',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.password} onChange={handleOnChange} name='password' />
                        </Form.Item>
                        <Form.Item
                            label="Admin"
                            name="isAdmin"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Price',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.isAdmin} onChange={handleOnChange} name='isAdmin' />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Rating',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.phone} onChange={handleOnChange} name='phone' />
                        </Form.Item>
                        <Form.Item
                            label="Adress"
                            name="adress"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Description',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.adress} onChange={handleOnChange} name='adress' />
                        </Form.Item>
                        <Form.Item
                            label="Avatar"
                            name="avatar"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose your Avatar',
                                },
                            ]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1} >
                                <Button> Select Image </Button>
                                {stateUser?.avatar && (
                                    <img src={stateUser?.avatar} style={{
                                        height: '50px',
                                        width: '50px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '20px'
                                    }} alt='avatar' />
                                )}
                            </WrapperUploadFile>

                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 20,
                                span: 4,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent title='Chi tiết User' isOpen={isOpenDrawer} onClose={() => { setIsOpenDrawer(false) }} width='60%' >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated} >
                    <Form
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 22,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onUpdateUser}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="on"
                        form={forms}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input User name',
                                },
                            ]}
                        >
                            <InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name='name' />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Email',
                                },
                            ]}
                        >
                            <InputComponent value={stateUserDetails.email} onChange={handleOnChangeDetails} name='email' />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone',
                                },
                            ]}
                        >
                            <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name='phone' />
                        </Form.Item>
                        <Form.Item
                            label="Admin"
                            name="isAdmin"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Price',
                                },
                            ]}
                        >
                            {/* <InputComponent value={stateUserDetails.isAdmin} onChange={handleOnChangeDetails} name='isAdmin' /> */}
                            <Radio.Group onChange={handleOnChangeDetails} value={stateUserDetails.isAdmin} name='isAdmin'>
                                <Radio value={true}>TRUE</Radio>
                                <Radio value={false}>FALSE</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label="Adress"
                            name="adress"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Rating',
                                },
                            ]}
                        >
                            <InputComponent value={stateUserDetails.adress} onChange={handleOnChangeDetails} name='adress' />
                        </Form.Item>
                        {/* <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Description',
                                },
                            ]}
                        >
                            <InputComponent value={stateUserDetails.description} onChange={handleOnChangeDetails} name='description' />
                        </Form.Item> */}
                        <Form.Item
                            label="Avatar"
                            name="avatar"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose your Avatar',
                                },
                            ]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1} >
                                <Button> Select Image </Button>
                                {stateUserDetails?.avatar && (
                                    <img src={stateUserDetails?.avatar} style={{
                                        height: '50px',
                                        width: '50px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '20px'
                                    }} alt='avatar' />
                                )}
                            </WrapperUploadFile>

                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 22,
                                span: 2,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent title="Xóa người dùng" open={isOpenModalDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser} >
                <Loading isLoading={isLoadingDeleted} >
                    <div>Bạn có chắc muốn xóa người dùng `"{stateUserDetails?.name}"` này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminUsers