import AdminPage from "../pages/AdminPage/AdminPage";
import { HomePage } from "../pages/HomePages/HomePage";
import MyOrderDetailsPage from "../pages/MyOrderDetailsPages/MyOrderDetailsPages";
import NotFoundPage from "../pages/NotFoundPages/NotFoundPage";
import OrderHistoryPage from "../pages/OrderHistoryPages/OrderHistoryPage";
import OrderPage from "../pages/OrderPages/OrderPage";
import OrderSuccessPage from "../pages/OrderSuccessPage/OrderSuccessPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductPage from "../pages/ProductPages/ProductPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";


export const routes = [
{
    path: '/',
    page: HomePage,
    isShowHeader : true
},
{
    path: '/order',
    page: OrderPage,
    isShowHeader : true
},
{
    path: '/my-order',
    page: OrderHistoryPage,
    isShowHeader : true
},
{
    path: '/my-order-details/:id',
    page: MyOrderDetailsPage,
    isShowHeader : true
},
{
    path: '/product',
    page: ProductPage,
    isShowHeader : true
},
{
    path: '/payment',
    page: PaymentPage,
    isShowHeader : true
},
{
    path: '/orderSuccess',
    page: OrderSuccessPage,
    isShowHeader : true
},
{
    path: '/product/:type',
    page: TypeProductPage,
    isShowHeader : true
},
{
    path: '/sign-in',
    page: SignInPage,
    isShowHeader : false
},
{
    path: '/sign-up',
    page: SignUpPage,
    isShowHeader : false
},
{
    path: '/product-details',
    page: ProductDetailPage,
    isShowHeader : true
},
{
    path: '/product-details/:id',
    page: ProductDetailPage,
    isShowHeader : true
},
{
    path: '/profile-user',
    page: ProfilePage,
    isShowHeader : true
},
{
    path: '/system/admin',
    page: AdminPage,
    isShowHeader : false,
    isPrivate: true
},
{
    path: '*',
    page: NotFoundPage
}
]