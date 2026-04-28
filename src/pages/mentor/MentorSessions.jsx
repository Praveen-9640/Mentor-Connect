import { useEffect, useState } from "react"
import MentorSidebar from "../../components/MentorSidebar"
import api from "../../api"


function MentorSessions() {
  const [requests, setRequests] = useState([])
  const [message, setMessage] = useState("")
  
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/api/sessions")
        setRequests(res.data.filter(s => s.mentor?.id === Number(userId)))
      } catch (err) {
        console.error(err)
        setMessage("Failed to fetch sessions.")
      }
    }
    fetchSessions()
  }, [userId])

  const updateStatus = async (id, nextStatus) => {
    try {
      await api.put(`/api/sessions/${id}/status`, { status: nextStatus })
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)))
      setMessage(`Session successfully marked as ${nextStatus.toLowerCase()}.`)
    } catch (err) {
      console.error(err)
      setMessage("Failed to update session status.")
    }
  }

  return (
    <div className="workspace">
      <MentorSidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>Mentor Sessions</h1>
          <p>Accept or cancel requests.</p>
        </header>

        <article className="card">
          <h3>Session Requests</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Mentee</th>
                <th>Time Range</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <strong>{request.mentee?.name || "Unknown"}</strong>
                    {request.status === "ACCEPTED" && request.mentee && (
                      <div style={{ fontSize: "0.85em", marginTop: "4px", color: "gray" }}>
                        <div style={{ margin: "2px 0" }}>📧 {request.mentee.email}</div>
                        <div style={{ margin: "2px 0" }}>🎓 Year: {request.mentee.studyYear || "N/A"}</div>
                      </div>
                    )}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(request.startTime).toLocaleDateString()} <br/>
                    <span style={{ fontSize: "0.9em", color: "gray" }}>
                      {new Date(request.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(request.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    {request.status === "ACCEPTED" || request.status === "CANCELLED" ? (
                      <span className="hint">Done</span>
                    ) : (
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button className="btn btn-small" onClick={() => updateStatus(request.id, "ACCEPTED")}>
                          Accept
                        </button>
                        <button className="btn btn-light btn-small" onClick={() => updateStatus(request.id, "CANCELLED")}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                   <td colSpan="4" style={{textAlign: "center"}}>No session requests found.</td>
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

export default MentorSessions
