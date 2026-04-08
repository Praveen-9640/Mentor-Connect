import { Link, useLocation, useNavigate } from "react-router-dom"

function MentorSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const linkClass = (path) =>
    `side-link ${location.pathname === path ? "active" : ""}`

  return (
    <aside className="side-panel">
      <h2>Mentor</h2>
      <div className="side-links">
        <Link to="/mentor/dashboard" className={linkClass("/mentor/dashboard")}>
          Dashboard
        </Link>
        <Link to="/mentor/sessions" className={linkClass("/mentor/sessions")}>
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

export default MentorSidebar
