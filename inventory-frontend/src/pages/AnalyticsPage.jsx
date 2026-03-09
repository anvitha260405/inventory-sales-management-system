import { useEffect, useState } from 'react'
import API from '../services/api'

function AnalyticsPage() {
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [deadStockProducts, setDeadStockProducts] = useState([])
  const [stockMovements, setStockMovements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const lowStockResponse = await API.get('/analytics/low-stock')
      const deadStockResponse = await API.get('/analytics/dead-stock')
      const stockMovementResponse = await API.get('/analytics/stock-movements')

      setLowStockProducts(lowStockResponse.data)
      setDeadStockProducts(deadStockResponse.data)
      setStockMovements(stockMovementResponse.data)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <h4>Loading analytics...</h4>
  }

  return (
    <div>
      <div className="mb-4">
        <h2>Inventory Analytics</h2>
        <p className="text-muted">Analyze inventory health using low stock, dead stock, and stock movement data.</p>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="page-card">
            <h4 className="mb-3">Low Stock Products</h4>

            {lowStockProducts.length === 0 ? (
              <p className="text-muted">No low stock products found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Current Stock</th>
                      <th>Reorder Level</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.productName}</td>
                        <td>{product.sku}</td>
                        <td>{product.category}</td>
                        <td>{product.currentStock}</td>
                        <td>{product.reorderLevel}</td>
                        <td>
                          <span className="badge bg-danger">Low Stock</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="page-card">
            <h4 className="mb-3">Dead Stock Products</h4>

            {deadStockProducts.length === 0 ? (
              <p className="text-muted">No dead stock products found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Current Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deadStockProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.productName}</td>
                        <td>{product.sku}</td>
                        <td>{product.category}</td>
                        <td>{product.currentStock}</td>
                        <td>
                          <span className="badge bg-warning text-dark">Dead Stock</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="page-card">
            <h4 className="mb-3">Stock Movement History</h4>

            {stockMovements.length === 0 ? (
              <p className="text-muted">No stock movement records found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Movement Type</th>
                      <th>Quantity Changed</th>
                      <th>Stock Before</th>
                      <th>Stock After</th>
                      <th>Reference Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockMovements.map((movement) => (
                      <tr key={movement.id}>
                        <td>{movement.id}</td>
                        <td>{movement.product?.productName}</td>
                        <td>{movement.movementType}</td>
                        <td>{movement.quantityChanged}</td>
                        <td>{movement.stockBefore}</td>
                        <td>{movement.stockAfter}</td>
                        <td>{movement.referenceNote}</td>
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

export default AnalyticsPage