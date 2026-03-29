import { useState } from "react"
import AdminSidebar from "../../components/AdminSidebar"

const initialSessions = [
  { id: 1, mentee: "Karthik", mentor: "Rahul", date: "2026-02-24", status: "Pending" },
  { id: 2, mentee: "Neha", mentor: "Anita", date: "2026-02-26", status: "Scheduled" },
]

function ManageSessions() {
  const [sessions, setSessions] = useState(initialSessions)
  const [message, setMessage] = useState("")

  const updateStatus = (id, status) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
    setMessage(`Session marked as ${status}.`)
  }

  return (
    <div className="workspace">
      <AdminSidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>Manage Sessions</h1>
          <p>Approve or cancel sessions.</p>
        </header>

        <article className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Mentee</th>
                <th>Mentor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.mentee}</td>
                  <td>{session.mentor}</td>
                  <td>{session.date}</td>
                  <td>
                    <span className={`status-badge ${session.status.toLowerCase()}`}>
                      {session.status}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "6px" }}>
                    {session.status === "Scheduled" ? (
                      <button
                        className="btn btn-light btn-small"
                        onClick={() => updateStatus(session.id, "Pending")}
                      >
                        Unapprove
                      </button>
                    ) : (
                      <button
                        className="btn btn-small"
                        onClick={() => updateStatus(session.id, "Scheduled")}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="btn btn-light btn-small"
                      onClick={() => updateStatus(session.id, "Cancelled")}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {message ? <p className="hint">{message}</p> : null}
        </article>
      </section>
    </div>
  )
}

export default ManageSessions
