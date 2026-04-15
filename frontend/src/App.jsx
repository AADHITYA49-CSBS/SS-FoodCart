import { useMemo, useState } from 'react';
import { apiRequest } from './api/http';
import './App.css';

const DELIVERY_TYPES = ['SWIGGY', 'ZOMATO', 'DIRECT'];
const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'DELIVERED'];
const PRODUCT_CATEGORIES = ['Momos', 'Waffles', 'Soups'];

function App() {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');

  const [registerForm, setRegisterForm] = useState({
    name: 'Demo Customer',
    email: 'demo.customer@ssfoodcart.com',
    password: 'cust123',
    role: 'CUSTOMER',
    phone: '9000000009',
    address: 'Bengaluru',
  });
  const [loginForm, setLoginForm] = useState({
    email: 'admin@ssfoodcart.com',
    password: 'admin123',
  });
  const [userLookup, setUserLookup] = useState({
    userId: '1',
    email: 'admin@ssfoodcart.com',
  });

  const [productForm, setProductForm] = useState({
    name: 'Peri Peri Momos',
    description: 'Spicy peri peri coated steamed momos',
    price: '159',
    category: 'Momos',
    available: true,
  });
  const [productLookup, setProductLookup] = useState({
    productId: '1',
    category: 'Momos',
  });

  const [cartForm, setCartForm] = useState({
    userId: '2',
    productId: '1',
    quantity: '2',
    cartItemId: '1',
    updateQuantity: '3',
    clearUserId: '2',
  });

  const [orderForm, setOrderForm] = useState({
    userId: '2',
    deliveryType: 'DIRECT',
    orderId: '1',
    statusOrderId: '1',
    status: 'CONFIRMED',
  });

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

  function onFieldChange(setter) {
    return (event) => {
      const { name, value, type, checked } = event.target;
      setter((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>SS FoodCart Frontend Console</h1>
          <p>Professional React client wired to your backend APIs (Users, Products, Cart, Orders).</p>
        </div>
        <div className="meta-card">
          <span>API Base</span>
          <strong>{apiBaseLabel}</strong>
          <button
            type="button"
            onClick={() => executeRequest('GET /api/products', () => apiRequest('/api/products'))}
            disabled={loading}
          >
            Test Backend Connection
          </button>
        </div>
      </header>

      <main className="grid-layout">
        <section className="card">
          <h2>Users</h2>
          <p>Register, login, and lookup users.</p>

          <div className="form-grid">
            <input name="name" value={registerForm.name} onChange={onFieldChange(setRegisterForm)} placeholder="Name" />
            <input name="email" value={registerForm.email} onChange={onFieldChange(setRegisterForm)} placeholder="Email" />
            <input name="password" value={registerForm.password} onChange={onFieldChange(setRegisterForm)} placeholder="Password" />
            <select name="role" value={registerForm.role} onChange={onFieldChange(setRegisterForm)}>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <input name="phone" value={registerForm.phone} onChange={onFieldChange(setRegisterForm)} placeholder="Phone" />
            <input name="address" value={registerForm.address} onChange={onFieldChange(setRegisterForm)} placeholder="Address" />
          </div>

          <div className="button-row">
            <button
              type="button"
              onClick={() =>
                executeRequest('POST /api/users/register', () =>
                  apiRequest('/api/users/register', { method: 'POST', body: registerForm })
                )
              }
              disabled={loading}
            >
              Register User
            </button>
          </div>

          <div className="form-grid two-col">
            <input name="email" value={loginForm.email} onChange={onFieldChange(setLoginForm)} placeholder="Login Email" />
            <input name="password" value={loginForm.password} onChange={onFieldChange(setLoginForm)} placeholder="Login Password" />
          </div>

          <div className="button-row">
            <button
              type="button"
              onClick={() =>
                executeRequest('POST /api/users/login', () =>
                  apiRequest('/api/users/login', { method: 'POST', body: loginForm })
                )
              }
              disabled={loading}
            >
              Login
            </button>
          </div>

          <div className="form-grid two-col">
            <input name="userId" value={userLookup.userId} onChange={onFieldChange(setUserLookup)} placeholder="User ID" />
            <input name="email" value={userLookup.email} onChange={onFieldChange(setUserLookup)} placeholder="Lookup Email" />
          </div>

          <div className="button-row wrap">
            <button
              type="button"
              onClick={() => executeRequest('GET /api/users/{id}', () => apiRequest(`/api/users/${userLookup.userId}`))}
              disabled={loading}
            >
              Get User By ID
            </button>
            <button
              type="button"
              onClick={() => executeRequest('GET /api/users/email/{email}', () => apiRequest(`/api/users/email/${encodeURIComponent(userLookup.email)}`))}
              disabled={loading}
            >
              Get User By Email
            </button>
          </div>
        </section>

        <section className="card">
          <h2>Products</h2>
          <p>Create and query Momos, Waffles, Soups with varieties.</p>

          <div className="form-grid">
            <input name="name" value={productForm.name} onChange={onFieldChange(setProductForm)} placeholder="Product Name" />
            <input name="description" value={productForm.description} onChange={onFieldChange(setProductForm)} placeholder="Description" />
            <input name="price" value={productForm.price} onChange={onFieldChange(setProductForm)} placeholder="Price" />
            <select name="category" value={productForm.category} onChange={onFieldChange(setProductForm)}>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <label className="checkbox-field">
              <input
                name="available"
                type="checkbox"
                checked={productForm.available}
                onChange={onFieldChange(setProductForm)}
              />
              Available
            </label>
          </div>

          <div className="button-row wrap">
            <button
              type="button"
              onClick={() =>
                executeRequest('POST /api/products', () =>
                  apiRequest('/api/products', {
                    method: 'POST',
                    body: {
                      ...productForm,
                      price: Number(productForm.price),
                    },
                  })
                )
              }
              disabled={loading}
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={() => executeRequest('GET /api/products', () => apiRequest('/api/products'))}
              disabled={loading}
            >
              Get All Products
            </button>
            <button
              type="button"
              onClick={() => executeRequest('GET /api/products/available', () => apiRequest('/api/products/available'))}
              disabled={loading}
            >
              Get Available Products
            </button>
          </div>

          <div className="form-grid two-col">
            <input name="productId" value={productLookup.productId} onChange={onFieldChange(setProductLookup)} placeholder="Product ID" />
            <select name="category" value={productLookup.category} onChange={onFieldChange(setProductLookup)}>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="button-row wrap">
            <button
              type="button"
              onClick={() => executeRequest('GET /api/products/{id}', () => apiRequest(`/api/products/${productLookup.productId}`))}
              disabled={loading}
            >
              Get Product By ID
            </button>
            <button
              type="button"
              onClick={() =>
                executeRequest('GET /api/products/category/{category}', () =>
                  apiRequest(`/api/products/category/${encodeURIComponent(productLookup.category)}`)
                )
              }
              disabled={loading}
            >
              Get By Category
            </button>
          </div>
        </section>

        <section className="card">
          <h2>Cart</h2>
          <p>Add, update, remove, and clear cart items by user/product IDs.</p>

          <div className="form-grid three-col">
            <input name="userId" value={cartForm.userId} onChange={onFieldChange(setCartForm)} placeholder="User ID" />
            <input name="productId" value={cartForm.productId} onChange={onFieldChange(setCartForm)} placeholder="Product ID" />
            <input name="quantity" value={cartForm.quantity} onChange={onFieldChange(setCartForm)} placeholder="Quantity" />
          </div>

          <div className="button-row wrap">
            <button
              type="button"
              onClick={() =>
                executeRequest('POST /api/cart/add', () =>
                  apiRequest('/api/cart/add', {
                    method: 'POST',
                    body: {
                      userId: Number(cartForm.userId),
                      productId: Number(cartForm.productId),
                      quantity: Number(cartForm.quantity),
                    },
                  })
                )
              }
              disabled={loading}
            >
              Add To Cart
            </button>
            <button
              type="button"
              onClick={() => executeRequest('GET /api/cart/{userId}', () => apiRequest(`/api/cart/${cartForm.userId}`))}
              disabled={loading}
            >
              Get Cart Items
            </button>
          </div>

          <div className="form-grid three-col">
            <input name="cartItemId" value={cartForm.cartItemId} onChange={onFieldChange(setCartForm)} placeholder="Cart Item ID" />
            <input name="updateQuantity" value={cartForm.updateQuantity} onChange={onFieldChange(setCartForm)} placeholder="New Quantity" />
            <input name="clearUserId" value={cartForm.clearUserId} onChange={onFieldChange(setCartForm)} placeholder="Clear User ID" />
          </div>

          <div className="button-row wrap">
            <button
              type="button"
              onClick={() =>
                executeRequest('PUT /api/cart/update', () =>
                  apiRequest('/api/cart/update', {
                    method: 'PUT',
                    body: {
                      cartItemId: Number(cartForm.cartItemId),
                      quantity: Number(cartForm.updateQuantity),
                    },
                  })
                )
              }
              disabled={loading}
            >
              Update Cart Item
            </button>
            <button
              type="button"
              onClick={() => executeRequest('DELETE /api/cart/{cartItemId}', () => apiRequest(`/api/cart/${cartForm.cartItemId}`, { method: 'DELETE' }))}
              disabled={loading}
            >
              Remove Cart Item
            </button>
            <button
              type="button"
              onClick={() => executeRequest('DELETE /api/cart/clear/{userId}', () => apiRequest(`/api/cart/clear/${cartForm.clearUserId}`, { method: 'DELETE' }))}
              disabled={loading}
            >
              Clear Cart
            </button>
          </div>
        </section>

        <section className="card">
          <h2>Orders</h2>
          <p>Place orders with delivery type and update status lifecycle.</p>

          <div className="form-grid three-col">
            <input name="userId" value={orderForm.userId} onChange={onFieldChange(setOrderForm)} placeholder="User ID" />
            <select name="deliveryType" value={orderForm.deliveryType} onChange={onFieldChange(setOrderForm)}>
              {DELIVERY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input name="orderId" value={orderForm.orderId} onChange={onFieldChange(setOrderForm)} placeholder="Order ID" />
          </div>

          <div className="button-row wrap">
            <button
              type="button"
              onClick={() =>
                executeRequest('POST /api/orders/place', () =>
                  apiRequest('/api/orders/place', {
                    method: 'POST',
                    body: {
                      userId: Number(orderForm.userId),
                      deliveryType: orderForm.deliveryType,
                    },
                  })
                )
              }
              disabled={loading}
            >
              Place Order
            </button>
            <button
              type="button"
              onClick={() => executeRequest('GET /api/orders/{userId}', () => apiRequest(`/api/orders/${orderForm.userId}`))}
              disabled={loading}
            >
              Get Orders By User
            </button>
            <button
              type="button"
              onClick={() => executeRequest('GET /api/orders/order/{orderId}', () => apiRequest(`/api/orders/order/${orderForm.orderId}`))}
              disabled={loading}
            >
              Get Order Details
            </button>
          </div>

          <div className="form-grid two-col">
            <input
              name="statusOrderId"
              value={orderForm.statusOrderId}
              onChange={onFieldChange(setOrderForm)}
              placeholder="Order ID For Status Update"
            />
            <select name="status" value={orderForm.status} onChange={onFieldChange(setOrderForm)}>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="button-row">
            <button
              type="button"
              onClick={() =>
                executeRequest('PUT /api/orders/status/{orderId}', () =>
                  apiRequest(`/api/orders/status/${orderForm.statusOrderId}`, {
                    method: 'PUT',
                    body: { status: orderForm.status },
                  })
                )
              }
              disabled={loading}
            >
              Update Order Status
            </button>
          </div>
        </section>
      </main>

      <section className="response-card">
        <h2>API Response</h2>
        {loading && <p className="info">Request in progress...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && !responseData && <p className="info">Run any action to view response payload.</p>}
        {responseData && (
          <>
            <p className="response-label">{responseData.label}</p>
            <pre>{JSON.stringify(responseData.payload, null, 2)}</pre>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
