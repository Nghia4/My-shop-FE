import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Select, Space, Table } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponents/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64, renderOptions } from '../../utils/utils'
import { WrapperUploadFile } from '../../pages/ProfilePage/style'
import { useMutationHook } from '../../hooks/mutationHook'
import * as ProductService from '../../services/ProductService'
import Loading from '../LoadingComponent/Loading'
import * as message from '../../components/PopUpMessage/PopUpMessage'
import { hashQueryKey, useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import {LeftOutlined, RightOutlined} from '@ant-design/icons'


const AdminProducts = () => {
    const [form] = Form.useForm()
    const [forms] = Form.useForm()
    const user = useSelector((state) => state?.user)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)
    const searchInput = useRef(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
      });
    const [stateProduct, setStateProduct] = useState({
        name: '',
        price: '',
        type: '',
        rating: '',
        description: '',
        image: '',
        countInStock: '',
        newType : '',
        discount:''
    })
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        price: '',
        type: '',
        rating: '',
        description: '',
        image: '',
        countInStock: '',
        discount:''
    })
   
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

    // fetch product details
    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                type: res?.data?.type,
                rating: res?.data?.rating,
                description: res?.data?.description,
                image: res?.data?.image,
                countInStock: res?.data?.countInStock,
                discount: res?.data?.discount
            })
        }
    }

    useEffect(() => {
        forms.setFieldsValue(stateProductDetails)
        if (isOpenDrawer === false) {
            forms.setFieldsValue(stateProductDetails)
        }
    }, [forms, stateProductDetails])

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected])

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }

    const renderAction = () => {
        return (
            <div style={{ gap: '12px' }}>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => { setIsOpenModalDelete(true) }} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
            </div>
        )
    }

    const mutation = useMutationHook(
        (data) => {
            const {
                name, price, type, rating, description, image, countInStock, discount
            } = data
            const res = ProductService.createProduct({
                name, price, type, rating, description, image, countInStock, discount
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
            const res = ProductService.updateProduct(
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
            const res = ProductService.deleteProduct(
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
            const res = ProductService.deleteManyProduct(
                 token, ids)
            return res
        }
    )

    const handleDeleteManyProducts = (ids) => {
        mutationDeleteMany.mutate({  token:user?.access_token, ids: ids, }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const getAllProduct = async () => {
        const res = await ProductService.getAllProductInSystem()
        return res
    }

    const fetchAllTypeProduct = async() => {
        const res = await ProductService.getAllTypeProduct()
       return res
    }

    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrored } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isLoading: isLoadingMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedmany } = mutationDeleteMany

    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct })
    const queryTypeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct})
    const { isLoading: isLoadingProduct, data: products } = queryProduct

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>=50',
                    value: '>='
                },
                {
                    text: '<=50',
                    value: '<='
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 50
                } else {
                    return record.price <= 50
                }
            },
            //   filterIcon :   <SearchOutlined />
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>=3',
                    value: '>='
                },
                {
                    text: '<=3',
                    value: '<='
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.rating >= 3
                } else {
                    return record.rating <= 3
                }
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            sorter: (a, b) => a.type - b.type,
            ...getColumnSearchProps('type')

        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
    const dataTable = Array.isArray(products?.data) && products?.data?.map((product) => {
        return {
            ...product, key: product._id
        }
    }
    )

    // const pagination = {
    //     current: 0,
    //     pageSize: 5,
    //     total: dataTable.length,
    //     onChange: (page, pageSize) => {
    //         getAllProduct(page, pageSize)
    //     },
    //   };


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

    useEffect(() => {
            if (isSuccessDeletedMany && dataDeletedMany.status === 'OK') {
                message.success()
            } else if (isErrorDeletedmany) {
                message.error()
            }
        }, [isSuccessDeletedMany])


    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }

    const handleOnChangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setStateProduct({
            name: '',
            price: '',
            type: '',
            rating: '',
            description: '',
            image: '',
            countInStock: '',
            discount: '',
        })
        form.resetFields()
    };

    const handleCancelDelete = () => {
        setIsOpenModalDelete(false)
    }

    const handleDeleteProduct = () => {
        mutationDelete.mutate({ id: rowSelected, access_token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false)
    };

    const onFinish = () => {
        const param = {
            name: stateProduct?.name,
            price: stateProduct?.price,
            type: stateProduct?.type === 'add-type' ? stateProduct.newType : stateProduct.type,
            rating: stateProduct?.rating,
            description: stateProduct?.description,
            image: stateProduct?.image,
            countInStock: stateProduct?.countInStock,
            discount: stateProduct?.discount
        }
        mutation.mutate(param, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
        form.resetFields()
    }
    
    const onUpdateProduct = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChangeSelect = (value) => {
            setStateProduct({
                ...stateProduct,
                type: value
            })
    }

    const handleTableChange = (page, pageSize) => {
        setPagination({ ...pagination, current: page, pageSize });
        getAllProduct();
      };

      const handlePrevClick = () => {
        const { current, pageSize } = pagination;
        const prevPage = current - 1;
        handleTableChange(prevPage, pageSize);
      };
    
      const handleNextClick = () => {
        const { current, pageSize } = pagination;
        const nextPage = current + 1;
        handleTableChange(nextPage, pageSize);
      };
  
    return (
        <div>
            <WrapperHeader>Quản lý Sản Phẩm</WrapperHeader>
            <div style={{ marginTop: '10px' }} >
                <Button onClick={() => { setIsModalOpen(true) }} style={{
                    height: '150px',
                    width: '150px',
                    borderRadius: '6px',
                    borderStyle: 'dashed'
                }}>
                    <PlusOutlined style={{ fontSize: '60px' }} />
                </Button>
            </div>
            <div style={{ marginTop: '20px' }} >
                <TableComponent 
                handleDeleteMany={handleDeleteManyProducts} 
                pagination={{
                    ...pagination,
                    prevIcon: <Button icon={<LeftOutlined />} onClick={handlePrevClick} />,
                    nextIcon: <Button icon={<RightOutlined />} onClick={handleNextClick} />,
                    onChange: handleTableChange
                  }}
                data={dataTable} 
                isLoading={isLoadingProduct} 
                columns={columns} 
                
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            setRowSelected(record._id)
                        }
                    }
                }} />
            </div>
            <ModalComponent title="Tạo Sản Phẩm" open={isModalOpen} onCancel={handleCancel} footer={null} >
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
                                    message: 'Please input Product name',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.name} onChange={handleOnChange} name='name' />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Type',
                                },
                            ]}
                        >
                            <Select
                                value='type'
                                name={stateProduct?.type}
                                onChange={handleOnChangeSelect}
                                options={renderOptions(queryTypeProduct?.data?.data)}
                                />
                        </Form.Item>
                        {stateProduct?.type === 'add-type' && (
                                <Form.Item
                                style={{ marginLeft: '80px' }}
                                  label="New Type"
                                  name="newType"
                                  rules={[
                                      {
                                          required: true,
                                          message: 'Please input your Type',
                                        },
                                    ]}
                              >
                                    <InputComponent value={stateProduct.newType} onChange={handleOnChange} name='newType' />
                                </Form.Item>
                                )}
                        <Form.Item
                            label="Count InStock"
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your count InStock',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name='countInStock' />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Price',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleOnChange} name='price' />
                        </Form.Item>
                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Rating',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleOnChange} name='rating' />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Description',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.description} onChange={handleOnChange} name='description' />
                        </Form.Item>
                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Discount',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnChange} name='discount' />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose your Image',
                                },
                            ]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1} >
                                <Button> Select Image </Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style={{
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
            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => { setIsOpenDrawer(false) }} width='60%' >
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
                        onFinish={onUpdateProduct}
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
                                    message: 'Please input Product name',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetails.name} onChange={handleOnChangeDetails} name='name' />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Type',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetails.type} onChange={handleOnChangeDetails} name='type' />
                        </Form.Item>
                        <Form.Item
                            label="Count InStock"
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your count InStock',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetails.countInStock} onChange={handleOnChangeDetails} name='countInStock' />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Price',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetails.price} onChange={handleOnChangeDetails} name='price' />
                        </Form.Item>
                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Rating',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetails.rating} onChange={handleOnChangeDetails} name='rating' />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Description',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetails.description} onChange={handleOnChangeDetails} name='description' />
                        </Form.Item>
                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Description',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetails.discount} onChange={handleOnChangeDetails} name='discount' />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose your Image',
                                },
                            ]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1} >
                                <Button> Select Image </Button>
                                {stateProductDetails?.image && (
                                    <img src={stateProductDetails?.image} style={{
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
            <ModalComponent title="Xóa sản phẩm" open={isOpenModalDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct} >
                <Loading isLoading={isLoadingDeleted} >
                    <div>Bạn có chắc muốn xóa sản phẩm `"{stateProductDetails?.name}"` không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}



export default AdminProducts