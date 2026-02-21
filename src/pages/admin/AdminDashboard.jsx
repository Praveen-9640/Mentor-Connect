import AdminSidebar from "../../components/AdminSidebar"
import { useNavigate } from "react-router-dom"

const stats = [
  { label: "Mentors", value: "14" },
  { label: "Mentees", value: "42" },
  { label: "Sessions", value: "12" },
]

function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="workspace">
      <AdminSidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Simple overview for users and sessions.</p>
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
              Open Users
            </button>
            <button className="btn btn-light" onClick={() => navigate("/admin/sessions")}>
              Open Sessions
            </button>
          </div>
          <p className="hint">These buttons navigate to working pages.</p>
        </article>
        <article className="card">
          <h3>Recent Update</h3>
          <p>2 sessions were approved today.</p>
          <p>1 mentor profile is pending review.</p>
        </article>
      </section>
    </div>
  )
}

export default AdminDashboard
