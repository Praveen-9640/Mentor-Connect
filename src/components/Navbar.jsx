import { Link, useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem("role")

  return (
    <nav className="nav">
      <Link to="/" className="logo-link">
        <h1 className="logo">MentorConnect</h1>
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/mentee/dashboard">Mentee</Link>
        <Link to="/mentor/sessions">Mentor</Link>
        <Link to="/admin/dashboard">Admin</Link>
        {!role ? (
          <Link to="/login">Login</Link>
        ) : (
          <button
            className="btn btn-light nav-logout"
            onClick={() => {
              localStorage.removeItem("role")
              navigate("/login")
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
