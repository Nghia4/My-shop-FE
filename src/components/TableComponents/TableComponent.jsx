import { Button, Divider, Dropdown, Modal, Radio, Space, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import Loading from '../LoadingComponent/Loading';
import { DownOutlined, SmileOutlined } from '@ant-design/icons'
import ModalComponent from '../ModalComponent/ModalComponent';
import { Excel } from 'antd-table-saveas-excel'
import AdminUserOrder from '../AdminUserOrder/AdminUserOrder';

const TableComponent = (props) => {
  const { selectionType = 'checkbox', data = [], isLoading = false, columns = [], handleDeleteMany } = props
  const [rowSelectedKey, setRowSelectedKey] = useState([])
  const [ deleteManyModal, setDeleteManyModal] = useState(false)
  const newColumns = useMemo(() => {
      const filter = Array.isArray(columns) && columns.filter((col) => col.dataIndex !== "action")
      return filter
  },[columns])
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);
  // const [selectionType, setSelectionType] = useState('checkbox');

  // const columns = [
  //     {
  //       title: 'Name',
  //       dataIndex: 'name',
  //       render: (text) => <a>{text}</a>,
  //     },
  //     {
  //       title: 'Price',
  //       dataIndex: 'price',
  //     },
  //     {
  //       title: 'Rating',
  //       dataIndex: 'rating',
  //     },
  //     {
  //       title: 'Type',
  //       dataIndex: 'type',
  //     },
  //     {
  //       title: 'Action',
  //       dataIndex: 'action',
  //       render: (text) => <a>{text}</a>,
  //     },
  //   ];
  //   const data = products.map((product) => {
  //     return {
  //       ...product, key:product._id
  //     }
  //   })

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKey(selectedRowKeys)
    }
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKey)
    setDeleteManyModal(false)
  }

  const handleOpenDeleteModal = () => {
    setDeleteManyModal(true)
  }

  const exportExel = () => {
    const excel = new Excel()
    excel
      .addSheet("test")
      .addColumns(newColumns)
      .addDataSource(data , {
        str2Percent: true
      })
      .saveAs("Excel.xlsx")
  }

  const items = [
    {
      key: '1',
      label: (
      <a style={{ display: deleteManyModal ? 'none' : '' }} onClick={handleOpenDeleteModal} >
        Xóa những cái đã chọn
      </a>)
      ,
    },
  ];

  return (
    <div>
      <Loading isLoading={isLoading}>
        {rowSelectedKey.length > 0 && (
          <div className='dropdown'>
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  Xóa
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        )}
        <Button onClick={exportExel} >Export Excel</Button>
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          {...props}
        />
      </Loading>
      <ModalComponent title="Xóa" open={deleteManyModal} onCancel={()=> setDeleteManyModal(false)} onOk={handleDeleteAll} >  
                    <div>Bạn đã chắc muốn xóa những cái đã chọn ?</div>
            </ModalComponent>
    </div>
  )
}

export default TableComponent