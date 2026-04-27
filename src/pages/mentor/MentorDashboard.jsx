import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MentorSidebar from "../../components/MentorSidebar"
import api from "../../api"

function MentorDashboard() {
  const navigate = useNavigate()
  const userName = localStorage.getItem("userName")
  const userId = localStorage.getItem("userId")
  const [sessionCount, setSessionCount] = useState(0)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions")

        const MySessions = res.data.filter(s => s.mentor?.id === Number(userId))
        setSessionCount(MySessions.length)
      } catch (err) {
        console.error(err)
      }
    }
    fetchSessions()
  }, [userId])

  return (
    <div className="workspace">
      <MentorSidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>Mentor Dashboard</h1>
          <p>Welcome back! Manage your schedule and guide your mentees.</p>
        </header>

        <div className="stat-grid">
          <article className="stat-card">
            <p>Welcome back</p>
            <h3>{userName}</h3>
          </article>
          <article className="stat-card">
            <p>Total Session Requests</p>
            <h3>{sessionCount}</h3>
          </article>
          <article className="stat-card">
            <p>Profile Status</p>
            <h3>Active</h3>
          </article>
        </div>

        <article className="card">
          <h3>Quick Actions</h3>
          <div className="actions">
            <button className="btn" onClick={() => navigate("/mentor/sessions")}>View Session Requests</button>
          </div>
        </article>
      </section>
    </div>
  )
}

export default MentorDashboard
