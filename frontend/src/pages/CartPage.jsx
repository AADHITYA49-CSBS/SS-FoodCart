import { useState } from 'react';
import { apiRequest } from '../api/http';
import ResponsePanel from '../components/ResponsePanel';

function CartPage({ executeRequest, loading, error, responseData }) {
  const [cartForm, setCartForm] = useState({
    userId: '2',
    productId: '1',
    quantity: '2',
    cartItemId: '1',
    updateQuantity: '3',
    clearUserId: '2',
  });

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setCartForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="card page-card cart-theme">
      <h2>Cart</h2>
      <p>Add, update, remove, and clear cart items by user/product IDs.</p>

      <div className="form-grid three-col">
        <input name="userId" value={cartForm.userId} onChange={onFieldChange} placeholder="User ID" />
        <input name="productId" value={cartForm.productId} onChange={onFieldChange} placeholder="Product ID" />
        <input name="quantity" value={cartForm.quantity} onChange={onFieldChange} placeholder="Quantity" />
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
        <input name="cartItemId" value={cartForm.cartItemId} onChange={onFieldChange} placeholder="Cart Item ID" />
        <input name="updateQuantity" value={cartForm.updateQuantity} onChange={onFieldChange} placeholder="New Quantity" />
        <input name="clearUserId" value={cartForm.clearUserId} onChange={onFieldChange} placeholder="Clear User ID" />
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
          onClick={() =>
            executeRequest('DELETE /api/cart/{cartItemId}', () =>
              apiRequest(`/api/cart/${cartForm.cartItemId}`, { method: 'DELETE' })
            )
          }
          disabled={loading}
        >
          Remove Cart Item
        </button>
        <button
          type="button"
          onClick={() =>
            executeRequest('DELETE /api/cart/clear/{userId}', () =>
              apiRequest(`/api/cart/clear/${cartForm.clearUserId}`, { method: 'DELETE' })
            )
          }
          disabled={loading}
        >
          Clear Cart
        </button>
      </div>

      <ResponsePanel loading={loading} error={error} responseData={responseData} />
    </section>
  );
}

export default CartPage;

