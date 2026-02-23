import { Navigate, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Login from "./pages/Login"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ManageUsers from "./pages/admin/ManageUsers"
import ManageSessions from "./pages/admin/ManageSessions"
import MenteeDashboard from "./pages/mentee/MenteeDashboard"
import BrowseMentors from "./pages/mentee/BrowseMentors"
import MySessions from "./pages/mentee/MySessions"

function Home() {
  return (
    <section className="card home-card">
      <h1>MentorConnect Study Hub</h1>
      <p>Learn with mentors, book focused sessions, and track your study journey.</p>
      <div className="home-points">
        <span>Admin: manage users and sessions</span>
        <span>Mentee: browse mentors and book sessions</span>
      </div>
    </section>
  )
}

function HomeEntry() {
  const role = localStorage.getItem("role")
  return role ? <Home /> : <Navigate to="/login" replace />
}

function RequireAccess({ allowMentee, allowAdmin, children }) {
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

  return <Navigate to={role === "admin" ? "/admin/dashboard" : "/mentee/dashboard"} replace />
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomeEntry />} />
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
      <Footer />
    </div>
  )
}

export default App
