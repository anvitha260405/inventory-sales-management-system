import { useEffect, useState } from 'react'
import API from '../services/api'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    category: '',
    unitPrice: '',
    currentStock: '',
    reorderLevel: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newProduct = {
      productName: formData.productName,
      sku: formData.sku,
      category: formData.category,
      unitPrice: Number(formData.unitPrice),
      currentStock: Number(formData.currentStock),
      reorderLevel: Number(formData.reorderLevel)
    }

    try {
      if (formData.id) {
        await API.put(`/products/${formData.id}`, newProduct)
      } else {
        await API.post('/products', newProduct)
      }

      setFormData({
        productName: '',
        sku: '',
        category: '',
        unitPrice: '',
        currentStock: '',
        reorderLevel: ''
      })

      fetchProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product. Check SKU uniqueness and input values.')
    }
  }
  const handleEdit = (product) => {
    setFormData({
      productName: product.productName,
      sku: product.sku,
      category: product.category,
      unitPrice: product.unitPrice,
      currentStock: product.currentStock,
      reorderLevel: product.reorderLevel
    })
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?')
    if (!confirmDelete) return

    try {
      await API.delete(`/products/${id}`)
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product.')
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2>Products</h2>
        <p className="text-muted">Manage products, stock levels, and reorder limits.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="page-card">
            <h4 className="mb-3">Add New Product</h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">SKU</label>
                <input
                  type="text"
                  className="form-control"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Unit Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Current Stock</label>
                <input
                  type="number"
                  className="form-control"
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Reorder Level</label>
                <input
                  type="number"
                  className="form-control"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-dark w-100">
                Add Product
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="page-card">
            <h4 className="mb-3">Product List</h4>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search product by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-muted">No products found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Reorder</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                       .filter((product) =>
                         product.productName.toLowerCase().includes(search.toLowerCase())
                       )
                       .map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.productName}</td>
                        <td>{product.sku}</td>
                        <td>{product.category}</td>
                        <td>₹{product.unitPrice}</td>
                        <td>{product.currentStock}</td>
                        <td>{product.reorderLevel}</td>
                        <td>
                          {product.currentStock <= product.reorderLevel ? (
                            <span className="badge bg-danger">Low Stock</span>
                          ) : (
                            <span className="badge bg-success">Healthy</span>
                          )}
                        </td>
                        <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEdit(product)}
                            >
                              Edit
                            </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage