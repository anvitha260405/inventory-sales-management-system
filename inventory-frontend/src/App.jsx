import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import ProductsPage from "./pages/ProductsPage"
import SalesPage from "./pages/SalesPage"
import AnalyticsPage from "./pages/AnalyticsPage"

function App() {
  return (
    <Router>
      <div className="d-flex">

        {/* Sidebar */}
        <div className="sidebar bg-dark text-white p-3">

          <h4 className="mb-4">Inventory System</h4>

          <ul className="nav flex-column">

            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Dashboard</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white" to="/products">Products</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white" to="/sales">Sales</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white" to="/analytics">Analytics</Link>
            </li>

          </ul>
        </div>

        {/* Main Content */}
        <div className="content-area flex-grow-1 p-4">

        <div className="mb-4">
          <h2 className="fw-bold">Inventory and Sales Management System</h2>
          <p className="text-muted mb-0">Inventory-focused operations and analytics dashboard</p>
        </div>

          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>

        </div>

      </div>
    </Router>
  )
}

export default App