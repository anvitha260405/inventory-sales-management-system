import { useEffect, useState } from 'react'
import API from '../services/api'

function DashboardPage() {
const [totalProducts, setTotalProducts] = useState(0)
const [lowStockCount, setLowStockCount] = useState(0)
const [deadStockCount, setDeadStockCount] = useState(0)
const [stockMovementCount, setStockMovementCount] = useState(0)
const [turnover, setTurnover] = useState(0)
const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const productsResponse = await API.get('/products')
      const lowStockResponse = await API.get('/analytics/low-stock')
      const deadStockResponse = await API.get('/analytics/dead-stock')
      const stockMovementResponse = await API.get('/analytics/stock-movements')
      const turnoverResponse = await API.get('/analytics/turnover')

      setTotalProducts(productsResponse.data.length)
      setLowStockCount(lowStockResponse.data.length)
      setDeadStockCount(deadStockResponse.data.length)
      setStockMovementCount(stockMovementResponse.data.length)
      setTurnover(turnoverResponse.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <h4>Loading dashboard...</h4>
  }

  return (
    <div>
      <div className="mb-4">
        <h2>Dashboard</h2>
        <p className="text-muted">Inventory overview and analytics summary</p>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card">
            <h5>Total Products</h5>
            <h2>{totalProducts}</h2>
            <p className="text-muted mb-0">Products currently available in system</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card">
            <h5>Inventory Turnover</h5>
            <h2>{turnover.toFixed(2)}</h2>
            <p className="text-muted mb-0">Rate of stock movement in the system</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card warning-card">
            <h5>Low Stock</h5>
            <h2>{lowStockCount}</h2>
            <p className="text-muted mb-0">Products needing reorder attention</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card danger-card">
            <h5>Dead Stock</h5>
            <h2>{deadStockCount}</h2>
            <p className="text-muted mb-0">Products with no sales movement</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card info-card">
            <h5>Stock Movements</h5>
            <h2>{stockMovementCount}</h2>
            <p className="text-muted mb-0">Inventory updates recorded so far</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage