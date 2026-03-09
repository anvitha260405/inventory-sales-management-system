import { useEffect, useState } from 'react'
import API from '../services/api'

function SalesPage() {
  const [products, setProducts] = useState([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [saleItems, setSaleItems] = useState([])
  const [loading, setLoading] = useState(true)

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

  const handleAddItem = () => {
    if (!selectedProductId || !quantity) {
      alert('Please select a product and enter quantity.')
      return
    }

    const selectedProduct = products.find(
      (product) => product.id === Number(selectedProductId)
    )

    if (!selectedProduct) {
      alert('Selected product not found.')
      return
    }

    if (Number(quantity) <= 0) {
      alert('Quantity must be greater than 0.')
      return
    }

    const existingItem = saleItems.find(
      (item) => item.productId === Number(selectedProductId)
    )

    if (existingItem) {
      alert('This product is already added to the sale.')
      return
    }

    const newItem = {
      productId: Number(selectedProductId),
      productName: selectedProduct.productName,
      unitPrice: selectedProduct.unitPrice,
      quantity: Number(quantity),
      subtotal: selectedProduct.unitPrice * Number(quantity)
    }

    setSaleItems([...saleItems, newItem])
    setSelectedProductId('')
    setQuantity('')
  }

  const handleRemoveItem = (productId) => {
    const updatedItems = saleItems.filter((item) => item.productId !== productId)
    setSaleItems(updatedItems)
  }

  const calculateTotal = () => {
    return saleItems.reduce((total, item) => total + item.subtotal, 0)
  }

  const handleSubmitSale = async () => {
    if (saleItems.length === 0) {
      alert('Please add at least one item to the sale.')
      return
    }

    const payload = {
      customerName: customerName,
      items: saleItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    }

    try {
      await API.post('/sales', payload)
      alert('Sale recorded successfully.')

      setCustomerName('')
      setSaleItems([])
      setSelectedProductId('')
      setQuantity('')

      fetchProducts()
    } catch (error) {
      console.error('Error recording sale:', error)
      alert('Failed to record sale. Check stock availability.')
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2>Sales</h2>
        <p className="text-muted">Record sales transactions and update inventory automatically.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="page-card">
            <h4 className="mb-3">Create Sale</h4>

            <div className="mb-3">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Select Product</label>
              <select
                className="form-select"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Choose product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.productName} (Stock: {product.currentStock})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>

            <button className="btn btn-outline-dark w-100 mb-3" onClick={handleAddItem}>
              Add Item
            </button>

            <button className="btn btn-dark w-100" onClick={handleSubmitSale}>
              Submit Sale
            </button>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="page-card">
            <h4 className="mb-3">Sale Items</h4>

            {loading ? (
              <p>Loading products...</p>
            ) : saleItems.length === 0 ? (
              <p className="text-muted">No items added to sale yet.</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleItems.map((item) => (
                        <tr key={item.productId}>
                          <td>{item.productName}</td>
                          <td>₹{item.unitPrice}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.subtotal}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveItem(item.productId)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-end mt-3">
                  <h5>Total Amount: ₹{calculateTotal()}</h5>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesPage