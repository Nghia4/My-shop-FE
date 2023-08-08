import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import HeaderComponent from './components/HeaderComponent/HeaderComponent'
import DefaultComponents from './components/DefaultComponents/DefaultComponents'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'
import { isJsonString } from './utils/utils'
import jwt_decode from 'jwt-decode'
import { resetUser, updateUser } from './redux/slides/userSlide'
import * as UserService from './services/UserService'
import Loading from './components/LoadingComponent/Loading'

function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)
  useEffect(() => {
    setIsLoading(true)
    const { decoded, storageData} = handleDecoded()
      if(decoded?.id) {
        handleGetDetailUser(decoded?.id, storageData)
      }
    setIsLoading(false)
    }
  ,[])

    const handleDecoded = () => {
      let storageData = localStorage.getItem('access_token')
      let decoded = {}
      if(storageData && isJsonString(storageData)) {
        storageData = JSON.parse(storageData)
         decoded = jwt_decode(storageData)
      }
      return {decoded, storageData}
    }

    UserService.axiosJWT.interceptors.request.use(async (config) => {
      const currentTime = new Date()
    const { decoded } = handleDecoded()
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const decodedRefreshToken = jwt_decode(refreshToken)
      if(decoded?.exp < currentTime.getTime() / 1000) {
        if(decodedRefreshToken?.exp > currentTime.getTime() / 1000 ) {
          const data = await UserService.refreshToken(refreshToken)
          config.headers['token'] = `Bearer ${data?.access_token}`
        } else {
          dispatch(resetUser())
        }
      }
      return config
    },(err) => {
      return Promise.reject(err)
    })

  const handleGetDetailUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token, refresh_token : refreshToken}))
}
  // useEffect(() => {
  //   fetchApi()
  // }, [])

  // const fetchApi = async () => {
  //   const res = await axios.get(`http://localhost:3001/api/product/getAll`)
  //   return res.data
  // }

  // const query = useQuery({ queryKey: ['todo'], queryFn: fetchApi })

  return (
    <div>
      <Loading isLoading={isLoading} >
      <Router>
        <Routes>
          {routes.map((route, index) => {
            const Page = route.page
            const Layout = route.isShowHeader ? DefaultComponents : Fragment
            return (
              <Route key={index} exact path={!route.isPrivate || user.isAdmin ? route.path : ''} element={
                <Layout>
                <Page />
                </Layout>
              } />
            )
          })}
        </Routes>
      </Router>
      </Loading>
    </div>
  )
}

export default App