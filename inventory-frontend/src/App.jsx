import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import ProductsPage from "./pages/ProductsPage"
import SalesPage from "./pages/SalesPage"
import AnalyticsPage from "./pages/AnalyticsPage"

function App() {
  return (
    <Router>
      <div className="d-flex">
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

        <div className="content-area flex-grow-1 p-4">
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