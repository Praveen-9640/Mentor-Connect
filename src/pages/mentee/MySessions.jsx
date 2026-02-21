import { useState } from "react"
import Sidebar from "../../components/Sidebar"

const initialSessions = [
  { id: 1, mentor: "Rahul Sharma", date: "2026-02-24", status: "Scheduled" },
  { id: 2, mentor: "Anita Verma", date: "2026-02-20", status: "Completed" },
]

function MySessions() {
  const [sessions, setSessions] = useState(initialSessions)
  const [message, setMessage] = useState("")
  const [selectedMentor, setSelectedMentor] = useState("Rahul Sharma")
  const [selectedDate, setSelectedDate] = useState("")

  const cancelSession = (id) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "Cancelled" } : s)))
    setMessage("Session cancelled.")
  }

  const addSession = () => {
    if (!selectedDate) {
      setMessage("Please choose a date from calendar.")
      return
    }

    setSessions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        mentor: selectedMentor,
        date: selectedDate,
        status: "Scheduled",
      },
    ])
    setMessage("New session booked.")
  }

  return (
    <div className="workspace">
      <Sidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>My Sessions</h1>
          <p>Book and manage your sessions.</p>
        </header>

        <article className="card">
          <div className="booking-row">
            <label>
              Mentor
              <select value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
                <option>Rahul Sharma</option>
                <option>Anita Verma</option>
                <option>Kiran Patel</option>
              </select>
            </label>
            <label>
              Date
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </label>
          </div>
          <div className="actions">
            <button className="btn" onClick={addSession}>Book Session</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Mentor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.mentor}</td>
                  <td>{session.date}</td>
                  <td>{session.status}</td>
                  <td>
                    <button className="btn btn-light btn-small" onClick={() => cancelSession(session.id)}>
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

export default MySessions
