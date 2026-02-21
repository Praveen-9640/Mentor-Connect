import { Link, useLocation, useNavigate } from "react-router-dom"

function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const linkClass = (path) =>
    `side-link ${location.pathname === path ? "active" : ""}`

  return (
    <aside className="side-panel">
      <h2>Admin</h2>
      <div className="side-links">
        <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
          Dashboard
        </Link>
        <Link to="/admin/users" className={linkClass("/admin/users")}>
          Users
        </Link>
        <Link to="/admin/sessions" className={linkClass("/admin/sessions")}>
          Sessions
        </Link>
      </div>
      <button
        className="btn btn-light logout-btn"
        onClick={() => {
          localStorage.removeItem("role")
          navigate("/login")
        }}
      >
        Logout
      </button>
    </aside>
  )
}

export default AdminSidebar
