import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: '',
  name: '',
  email:'',
  phone:'',
  adress:'',
  avattar:'',
  access_token:'',
  city:'',
  isAdmin: false,
  refresh_token:''
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
        const { name = '', email= '', access_token= '', phone = '', adress ='', avatar='', _id = '',city='', isAdmin, refresh_token = ''  } = action.payload
        state.id = _id
        state.name = name
        state.email = email
        state.phone = phone
        state.adress = adress
        state.avatar = avatar
        state.access_token = access_token
        state.isAdmin = isAdmin
        state.city = city
        state.refresh_token = refresh_token
    },
    resetUser: (state) => {
        state.id = ''
        state.name = ''
        state.email = ''
        state.phone = ''
        state.adress = ''
        state.avatar = ''
        state.access_token = ''
        state.city = ''
        state.isAdmin = false
        state.refresh_token = ''
    },
    },
  },
)

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer