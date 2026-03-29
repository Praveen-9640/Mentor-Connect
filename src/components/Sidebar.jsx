import { Link, useLocation, useNavigate } from "react-router-dom"

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const linkClass = (path) =>
    `side-link ${location.pathname === path ? "active" : ""}`

  return (
    <aside className="side-panel">
      <h2>Mentee</h2>
      <div className="side-links">
        <Link to="/mentee/dashboard" className={linkClass("/mentee/dashboard")}>
          Dashboard
        </Link>
        <Link to="/browse" className={linkClass("/browse")}>
          Browse Mentors
        </Link>
        <Link to="/mentee/sessions" className={linkClass("/mentee/sessions")}>
          My Sessions
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

export default Sidebar
