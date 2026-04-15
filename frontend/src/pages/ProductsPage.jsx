import { useState } from 'react';
import { apiRequest } from '../api/http';

const PRODUCT_CATEGORIES = ['Momos', 'Waffles', 'Soups'];

function ProductsPage({ executeRequest, loading }) {
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

  const onFieldChange = (setter) => (event) => {
    const { name, value, type, checked } = event.target;
    setter((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <section className="card page-card products-theme">
      <h2>Products</h2>
      <p>Create and query Momos, Waffles, Soups with varieties.</p>

      <div className="form-grid">
        <input name="name" value={productForm.name} onChange={onFieldChange(setProductForm)} placeholder="Product Name" />
        <input
          name="description"
          value={productForm.description}
          onChange={onFieldChange(setProductForm)}
          placeholder="Description"
        />
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
        <input
          name="productId"
          value={productLookup.productId}
          onChange={onFieldChange(setProductLookup)}
          placeholder="Product ID"
        />
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
          onClick={() =>
            executeRequest('GET /api/products/{id}', () => apiRequest(`/api/products/${productLookup.productId}`))
          }
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
  );
}

export default ProductsPage;

