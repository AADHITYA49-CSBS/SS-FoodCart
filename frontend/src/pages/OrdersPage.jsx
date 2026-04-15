import { useState } from 'react';
import { apiRequest } from '../api/http';
import ResponsePanel from '../components/ResponsePanel';

const DELIVERY_TYPES = ['SWIGGY', 'ZOMATO', 'DIRECT'];
const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'DELIVERED'];

function OrdersPage({ executeRequest, loading, error, responseData }) {
  const [orderForm, setOrderForm] = useState({
    userId: '2',
    deliveryType: 'DIRECT',
    orderId: '1',
    statusOrderId: '1',
    status: 'CONFIRMED',
  });

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="card page-card orders-theme">
      <h2>Orders</h2>
      <p>Place orders and update status lifecycle.</p>

      <div className="form-grid three-col">
        <input name="userId" value={orderForm.userId} onChange={onFieldChange} placeholder="User ID" />
        <select name="deliveryType" value={orderForm.deliveryType} onChange={onFieldChange}>
          {DELIVERY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input name="orderId" value={orderForm.orderId} onChange={onFieldChange} placeholder="Order ID" />
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
          onClick={() =>
            executeRequest('GET /api/orders/order/{orderId}', () =>
              apiRequest(`/api/orders/order/${orderForm.orderId}`)
            )
          }
          disabled={loading}
        >
          Get Order Details
        </button>
      </div>

      <div className="form-grid two-col">
        <input
          name="statusOrderId"
          value={orderForm.statusOrderId}
          onChange={onFieldChange}
          placeholder="Order ID For Status Update"
        />
        <select name="status" value={orderForm.status} onChange={onFieldChange}>
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

      <ResponsePanel loading={loading} error={error} responseData={responseData} />
    </section>
  );
}

export default OrdersPage;

