import { Navigate, Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';
import './App.css';
import DashboardOrder from './pages/dashboard/DashboardOrder';
import DashboardProduct from './pages/dashboard/DashboardProduct';
import DashboardUser from './pages/dashboard/DashboardUser';
import AddProduct from './pages/dashboard/product/AddProduct';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './routes/ProtectedRoute';
import ProductDetail from './pages/dashboard/product/ProductDetail';
import keycloak from './config/KeycloakConfig';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import ProductList from './pages/main/product/ProductList';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/main/HomePage';
import Cart from './pages/main/cart/Cart';
import ProductDetailMain from './pages/main/product/ProductDetailMain';
import AccountLayout from './layouts/AccountLayout';
import Profile from './pages/main/user/profile/Profile';
import Address from './pages/main/user/address/Address';
import Order from './pages/main/user/order/Order';
import Checkout from './pages/main/checkout/Checkout';
import OrderList from './pages/dashboard/order/OrderList';
import OrderDetail from './pages/dashboard/order/OrderDetail';
import OrderDetailMain from './pages/main/user/order/OrderDetailMain';
import UserList from './pages/dashboard/user/UserList';
import DashBoardAnalytics from './pages/dashboard/DashBoardAnalytics';
import Search from './pages/main/search/Search';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route element={<MainLayout />} >
        <Route index element={<HomePage />} />
        <Route path='cart' element={<Cart />} />
        <Route path='checkout' element={<Checkout />} />
        <Route path='category'>
          <Route index element={<Navigate to="/" />} />
          <Route path=':categoryName' element={<ProductList />} />
        </Route>

        <Route path='products'>
          <Route index element={<Navigate to="/" />} />
          <Route path=':productId' element={<ProductDetailMain />} />
        </Route>
        <Route path='search'>
          <Route index element={<Search />} />
        </Route>
        <Route path='account' element={<AccountLayout />} >
          <Route index element={<Profile />} />
          <Route path='addresses' element={<Address />} />
          <Route path='orders' element={<div><Outlet /></div>} >
            {/* <Route index element={<Navigate to="/account/orders?status=ALL" />} /> */}
            <Route index element={<Order />} />
            <Route path=':id' element={<OrderDetailMain />} />
          </Route>
        </Route>
      </Route>
      <Route element={<ProtectedRoute roles={['client_admin']} />} >
        <Route path='dashboard' element={<DashboardLayout />} >
          <Route index element={<Dashboard />} />
          <Route path='orders' element={<DashboardOrder />} >
            <Route index element={<OrderList />} />
            <Route path=':id' element={<OrderDetail />} />
          </Route>
          <Route path='products'>
            <Route index element={<DashboardProduct />} />
            <Route path='add' element={<AddProduct />} />
            <Route path=':id' element={<ProductDetail />} />
          </Route>
          <Route path='users' element={<DashboardUser />} >
            <Route index element={<UserList />} />
          </Route>
          <Route path='analytics' >
            <Route index element={<DashBoardAnalytics />} />
          </Route>
        </Route>
      </Route>
      <Route path='*' element={<h1>404 Not Found</h1>} />
      <Route path='unauthorized' element={<UnauthorizedPage />} />
    </Route>
  )
)

function App() {

  return (
    <ReactKeycloakProvider authClient={keycloak}
    // initOptions={{
    //   onLoad: 'login-required',
    // }}
    // LoadingComponent={
    //   <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}><h1>Loading...</h1></div>
    // }
    >
      <div className="App" style={{ height: "100vh", display: "flex" }}>
        <RouterProvider router={router} />
      </div>
    </ReactKeycloakProvider>
  );
}

export default App;
