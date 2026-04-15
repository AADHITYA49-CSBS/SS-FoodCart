import { NavLink } from 'react-router-dom';

function AppLayout({ apiBaseLabel, children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-wrap">
          <div className="brand-logo" aria-hidden="true">SS</div>
          <div>
            <h1>SS FoodCart</h1>
            <p>Bold food-ordering workspace with separate modules and quick API actions.</p>
          </div>
        </div>
        <div className="meta-card">
          <span>API Base</span>
          <strong>{apiBaseLabel}</strong>
          <p className="mini-note">Users, Products, Cart, Orders - each on its own page.</p>
        </div>
      </header>

      <nav className="top-nav" aria-label="Primary">
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

      {children}
    </div>
  );
}

export default AppLayout;

