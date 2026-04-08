import { useEffect, useState } from "react"
import AdminSidebar from "../../components/AdminSidebar"
import api from "../../api"


function ManageSessions() {
  const [sessions, setSessions] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const res = await api.get("/sessions")
      setSessions(res.data)
    } catch (err) {
      console.error(err)
      setMessage("Failed to fetch sessions")
    }
  }

  // Without a status update API right now, we just list them.
  // The system would originally have updateStatus, but the backend doesn't have a PUT endpoint yet.
  
  return (
    <div className="workspace">
      <AdminSidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>Manage Sessions</h1>
          <p>View all booked sessions globally.</p>
        </header>

        <article className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Mentee</th>
                <th>Mentor</th>
                <th>Time Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.mentee?.name || "Unknown"}</td>
                  <td>{session.mentor?.name || "Unknown"}</td>
                  <td>
                    {new Date(session.startTime).toLocaleString()} - 
                    {new Date(session.endTime).toLocaleTimeString()}
                  </td>
                  <td>
                    <span className={`status-badge ${session.status.toLowerCase()}`}>
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                   <td colSpan="4" style={{textAlign: "center"}}>No sessions found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {message ? <p className="hint">{message}</p> : null}
        </article>
      </section>
    </div>
  )
}

export default ManageSessions
