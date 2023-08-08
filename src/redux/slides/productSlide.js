import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search:'',
  rating: 0,
}

export const productSlide = createSlice({
  name: 'product',
  initialState,
  reducers: {
    searchProduct : (state, action) => {
      state.search = action.payload
    },
    checkProductRating: (state, action) => {
      state.rating = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { searchProduct, checkProductRating } = productSlide.actions

export default productSlide.reducer