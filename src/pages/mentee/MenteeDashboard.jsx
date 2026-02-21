import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar"

function MenteeDashboard() {
  const navigate = useNavigate()

  return (
    <div className="workspace">
      <Sidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>Mentee Dashboard</h1>
          <p>Welcome back. Continue your mentorship journey.</p>
        </header>

        <div className="stat-grid">
          <article className="stat-card">
            <p>Assigned Mentor</p>
            <h3>Rahul Sharma</h3>
          </article>
          <article className="stat-card">
            <p>Upcoming Sessions</p>
            <h3>2</h3>
          </article>
          <article className="stat-card">
            <p>Progress</p>
            <h3>60%</h3>
          </article>
        </div>

        <article className="card">
          <h3>Quick Actions</h3>
          <div className="actions">
            <button className="btn" onClick={() => navigate("/browse")}>Browse Mentors</button>
            <button className="btn btn-light" onClick={() => navigate("/mentee/sessions")}>My Sessions</button>
          </div>
        </article>
      </section>
    </div>
  )
}

export default MenteeDashboard
