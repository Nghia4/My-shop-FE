import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   orderItems: [ ],
   orderItemSelected: [],
    shippingAddress: {},
    paymentMethod: '',
    itemPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const orderSlide = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderProduct : (state, action) => {
      const {orderItem} = action.payload
      const itemOrder = Array.isArray(state.orderItems) && state?.orderItems?.find((item) => item?.product === orderItem.product)
      if(itemOrder) {
        itemOrder.amount += orderItem?.amount
      } else {
        Array.isArray(state.orderItems) && state.orderItems?.push(orderItem)
      }
    },
    removeOrderProduct: (state, action) => {
        const {idProduct} =action.payload
      const itemOrder = Array.isArray(state.orderItems) && state?.orderItems?.filter((item) => item?.product !== idProduct)
      const itemOrderSelect = Array.isArray(state.orderItemSelected) && state?.orderItemSelected.filter((item) => item?.product !== idProduct)
      state.orderItems = itemOrder
      state.orderItemSelected = itemOrderSelect
    },
    increaseAmount: (state, action) => {
        const {idProduct} = action.payload
      const itemOrder = Array.isArray(state.orderItems) && state?.orderItems?.find((item) => item?.product === idProduct)
      const itemOrderSelect = Array.isArray(state.orderItemSelected) && state?.orderItemSelected?.find((item) => item?.product === idProduct)
      itemOrder.amount++
      if(itemOrderSelect) {
        itemOrderSelect.amount++
      }
    },
    decreaseAmount: (state, action) => {
        const {idProduct} = action.payload
    
      const itemOrder = Array.isArray(state.orderItems) && state?.orderItems?.find((item) => item?.product === idProduct)
      const itemOrderSelect = Array.isArray(state.orderItemSelected) && state?.orderItemSelected?.find((item) => item?.product === idProduct)
      if(itemOrder.amount > 1) {
      itemOrder.amount--
      }
      if(itemOrderSelect && itemOrderSelect.amount > 1) {
        itemOrderSelect.amount--
      }
    },
    removeAllOrderProduct: (state, action) => {
        const {isChecked} =action.payload
      const itemOrder = Array.isArray(state.orderItems) && state?.orderItems?.filter((item) => !isChecked.includes(item.product))
      const itemOrderSelect = Array.isArray(state.orderItemSelected) && state?.orderItemSelected?.filter((item) => !isChecked.includes(item.product))
      state.orderItems = itemOrder
      state.orderItemSelected = itemOrderSelect
    },
    selectOrder: (state, action) => {
      const {isChecked} = action.payload
      const orderSelect = []
      state.orderItems.forEach((order) => {
        if(isChecked.includes(order?.product)){
          orderSelect.push(order)
        }
      })
      state.orderItemSelected = orderSelect
    }
  },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct, removeOrderProduct, increaseAmount, decreaseAmount, removeAllOrderProduct, selectOrder } = orderSlide.actions

export default orderSlide.reducer