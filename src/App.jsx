import { Navigate, Routes, Route, useLocation, useNavigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Login from "./pages/Login"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ManageUsers from "./pages/admin/ManageUsers"
import ManageSessions from "./pages/admin/ManageSessions"
import MenteeDashboard from "./pages/mentee/MenteeDashboard"
import BrowseMentors from "./pages/mentee/BrowseMentors"
import MySessions from "./pages/mentee/MySessions"
import MentorDashboard from "./pages/mentor/MentorDashboard"
import MentorSessions from "./pages/mentor/MentorSessions"
import Home from "./pages/Home"

function GetStarted() {
  const navigate = useNavigate()

  return (
    <section className="card getstart-hero-card getstart-simple getstart-page-center">
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-screen">
          <span className="hero-screen-title">Find Your Mentor Today</span>
        </div>
        <div className="hero-block hero-block-a" />
        <div className="hero-block hero-block-b" />
        <div className="hero-block hero-block-c" />
        <div className="hero-ring" />

        <div className="getstart-text getstart-center">
          <h1 className="getstart-title">MentorConnect</h1>
          <p className="getstart-subtitle">Online Mentoring & Training Platform</p>
          <p className="getstart-value">
            Connect with expert mentors. Book sessions. Grow faster.
          </p>
          <button className="btn" onClick={() => navigate("/login")}>
            Continue to Login
          </button>
        </div>
      </div>
    </section>
  )
}

function RequireAccess({ allowMentee, allowAdmin, allowMentor, children }) {
  const role = localStorage.getItem("role")

  if (!role) {
    return <Navigate to="/login" replace />
  }

  if (role === "admin" && allowAdmin) {
    return children
  }

  if (role === "mentee" && allowMentee) {
    return children
  }

  if (role === "mentor" && allowMentor) {
    return children
  }

  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (role === "mentor") {
    return <Navigate to="/mentor/dashboard" replace />
  }

  return <Navigate to="/mentee/dashboard" replace />
}

function App() {
  const location = useLocation()
  const isGetStarted = location.pathname === "/get-started"
  const isLogin = location.pathname === "/login"
  const hideNavbar = isGetStarted || isLogin

  return (
    <div className="app">
      {!hideNavbar ? <Navbar /> : null}
      <main className={isLogin ? "container-full" : "container"}>
        <Routes>
          <Route path="/" element={<Navigate to="/get-started" replace />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/mentee/dashboard"
            element={
              <RequireAccess allowMentee allowAdmin>
                <MenteeDashboard />
              </RequireAccess>
            }
          />
          <Route
            path="/browse"
            element={
              <RequireAccess allowMentee allowAdmin>
                <BrowseMentors />
              </RequireAccess>
            }
          />
          <Route
            path="/mentee/sessions"
            element={
              <RequireAccess allowMentee allowAdmin>
                <MySessions />
              </RequireAccess>
            }
          />
          <Route
            path="/mentor/dashboard"
            element={
              <RequireAccess allowMentor allowAdmin>
                <MentorDashboard />
              </RequireAccess>
            }
          />
          <Route
            path="/mentor/sessions"
            element={
              <RequireAccess allowMentor allowAdmin>
                <MentorSessions />
              </RequireAccess>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAccess allowAdmin>
                <AdminDashboard />
              </RequireAccess>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireAccess allowAdmin>
                <ManageUsers />
              </RequireAccess>
            }
          />
          <Route
            path="/admin/sessions"
            element={
              <RequireAccess allowAdmin>
                <ManageSessions />
              </RequireAccess>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      {!hideNavbar ? <Footer /> : null}
    </div>
  )
}

export default App
