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
import MentorSessions from "./pages/mentor/MentorSessions"

function Home() {
  const navigate = useNavigate()

  return (
    <section className="card hero-card">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-tag">MentorConnect Platform</p>
          <h1>Online Mentoring & Training Platform</h1>
          <p>
            Learn with mentors, schedule focused sessions, and track study progress
            with role-based dashboards for Admin, Mentor, and Mentee.
          </p>
          <div className="actions">
            <button className="btn" onClick={() => navigate("/get-started")}>
              Get Started
            </button>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-screen">
            <span>Mentoring</span>
          </div>
          <div className="hero-block hero-block-a" />
          <div className="hero-block hero-block-b" />
          <div className="hero-block hero-block-c" />
          <div className="hero-ring" />
        </div>
      </div>
    </section>
  )
}

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
          <p className="text-base text-gray-700 leading-relaxed max-w-md mx-auto">
            Connect with expert mentors. Book sessions. Grow faster.
          </p>
          <button className="btn" onClick={() => navigate("/login")}>
            Find a Mentor
          </button>
        </div>
      </div>
    </section>
  )
}

function HomeEntry() {
  const role = localStorage.getItem("role")
  return role ? <Home /> : <Navigate to="/get-started" replace />
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
    return <Navigate to="/mentor/sessions" replace />
  }

  return <Navigate to="/mentee/dashboard" replace />
}

function App() {
  const location = useLocation()
  const isGetStarted = location.pathname === "/get-started"

  return (
    <div className="app">
      {!isGetStarted ? <Navbar /> : null}
      <main className="container">
        <Routes>
          <Route path="/" element={<HomeEntry />} />
          <Route path="/get-started" element={<GetStarted />} />
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
      {!isGetStarted ? <Footer /> : null}
    </div>
  )
}

export default App
