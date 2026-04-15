import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import './App.css';
import ResponsePanel from './components/ResponsePanel';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import UsersPage from './pages/UsersPage';

function App() {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');

  const apiBaseLabel = useMemo(() => import.meta.env.VITE_API_BASE_URL || 'Vite proxy (/api -> localhost:8080)', []);

  async function executeRequest(label, requestFn) {
    setLoading(true);
    setError('');

    try {
      const payload = await requestFn();
      setResponseData({ label, payload });
    } catch (requestError) {
      setError(requestError.message || 'Unexpected request error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>SS FoodCart</h1>
          <p>Colorful React frontend with separate pages for Users, Products, Cart, and Orders.</p>
        </div>
        <div className="meta-card">
          <span>API Base</span>
          <strong>{apiBaseLabel}</strong>
          <p className="mini-note">Use the tabs below and execute APIs page by page.</p>
        </div>
      </header>

      <nav className="top-nav">
        <NavLink to="/users" className={({ isActive }) => (isActive ? 'nav-link active users' : 'nav-link users')}>
          Users
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? 'nav-link active products' : 'nav-link products')}>
          Products
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => (isActive ? 'nav-link active cart' : 'nav-link cart')}>
          Cart
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => (isActive ? 'nav-link active orders' : 'nav-link orders')}>
          Orders
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UsersPage executeRequest={executeRequest} loading={loading} />} />
        <Route path="/products" element={<ProductsPage executeRequest={executeRequest} loading={loading} />} />
        <Route path="/cart" element={<CartPage executeRequest={executeRequest} loading={loading} />} />
        <Route path="/orders" element={<OrdersPage executeRequest={executeRequest} loading={loading} />} />
      </Routes>

      <ResponsePanel loading={loading} error={error} responseData={responseData} />
    </div>
  );
}

export default App;
