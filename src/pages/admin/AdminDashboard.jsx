import { useEffect, useState } from "react"
import AdminSidebar from "../../components/AdminSidebar"
import { useNavigate } from "react-router-dom"
import api from "../../api"


function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState([
    { label: "Mentors", value: "0" },
    { label: "Mentees", value: "0" },
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/users")
        const mentorsCount = userRes.data.filter(u => u.role.toUpperCase() === "MENTOR").length
        const menteesCount = userRes.data.filter(u => u.role.toUpperCase() === "MENTEE").length

        setStats([
          { label: "Mentors", value: mentorsCount },
          { label: "Mentees", value: menteesCount },
        ])
      } catch (err) {
        console.error("Failed to load dashboard stats", err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="workspace">
      <AdminSidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of users and sessions on the platform.</p>
        </header>

        <div className="stat-grid">
          {stats.map((item) => (
            <article key={item.label} className="stat-card">
              <p>{item.label}</p>
              <h3>{item.value}</h3>
            </article>
          ))}
        </div>

        <article className="card">
          <h3>Quick Actions</h3>
          <div className="actions">
            <button className="btn" onClick={() => navigate("/admin/users")}>
              Manage Users
            </button>
            <button className="btn btn-light" onClick={() => navigate("/admin/sessions")}>
              Manage Sessions
            </button>
          </div>
        </article>

        <article className="card">
          <h3>Recent Updates</h3>
          <p>2 sessions were approved today.</p>
          <p>1 mentor profile is pending review.</p>
        </article>
      </section>
    </div>
  )
}

export default AdminDashboard
