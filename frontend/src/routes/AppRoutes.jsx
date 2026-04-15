import { Navigate, Route, Routes } from 'react-router-dom';
import CartPage from '../pages/CartPage';
import OrdersPage from '../pages/OrdersPage';
import ProductsPage from '../pages/ProductsPage';
import UsersPage from '../pages/UsersPage';

function AppRoutes({ executeRequest, loading, error, responseData }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />
      <Route
        path="/users"
        element={
          <UsersPage
            executeRequest={executeRequest}
            loading={loading}
            error={error}
            responseData={responseData}
          />
        }
      />
      <Route
        path="/products"
        element={
          <ProductsPage
            executeRequest={executeRequest}
            loading={loading}
            error={error}
            responseData={responseData}
          />
        }
      />
      <Route
        path="/cart"
        element={
          <CartPage
            executeRequest={executeRequest}
            loading={loading}
            error={error}
            responseData={responseData}
          />
        }
      />
      <Route
        path="/orders"
        element={
          <OrdersPage
            executeRequest={executeRequest}
            loading={loading}
            error={error}
            responseData={responseData}
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;

