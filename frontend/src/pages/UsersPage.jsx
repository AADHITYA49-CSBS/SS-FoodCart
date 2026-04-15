import { useState } from 'react';
import { apiRequest } from '../api/http';

function UsersPage({ executeRequest, loading }) {
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

  const onFieldChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="card page-card users-theme">
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
          onClick={() =>
            executeRequest('GET /api/users/email/{email}', () =>
              apiRequest(`/api/users/email/${encodeURIComponent(userLookup.email)}`)
            )
          }
          disabled={loading}
        >
          Get User By Email
        </button>
      </div>
    </section>
  );
}

export default UsersPage;

