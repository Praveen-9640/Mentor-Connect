import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import api from "../../api"

function MenteeDashboard() {
  const navigate = useNavigate()
  const userName = localStorage.getItem("userName")
  const userId = localStorage.getItem("userId")
  const [sessionCount, setSessionCount] = useState(0)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/api/sessions")
        const UserSessions = res.data.filter(s => s.mentee?.id === Number(userId))
        setSessionCount(UserSessions.length)
      } catch (err) {
        console.error(err)
      }
    }
    fetchSessions()
  }, [userId])

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
            <p>Welcome back</p>
            <h3>{userName}</h3>
          </article>
          <article className="stat-card">
            <p>Total Booked Sessions</p>
            <h3>{sessionCount}</h3>
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
