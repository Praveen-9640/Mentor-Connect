import { useState } from "react"
import MentorSidebar from "../../components/MentorSidebar"

const timeSlots = ["08:00-10:00", "12:00-15:00", "15:00-17:00"]
const weekRows = [
  { label: "Mon", day: 1 },
  { label: "Tue", day: 2 },
  { label: "Wed", day: 3 },
  { label: "Thu", day: 4 },
  { label: "Fri", day: 5 },
  { label: "Sat", day: 6 },
]

const initialRequests = [
  { id: 1, mentee: "Karthik Reddy", mentor: "Nithya prasuna", date: "2026-02-24", time: "08:00-10:00", status: "Pending" },
  { id: 2, mentee: "Neha Jain", mentor: "Nithya prasuna", date: "2026-02-25", time: "12:00-15:00", status: "Pending" },
  { id: 3, mentee: "Rohit Das", mentor: "Nithya prasuna", date: "2026-02-26", time: "15:00-17:00", status: "Pending" },
]

function getCurrentWeekRange() {
  const today = new Date()
  const day = today.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() + diffToMonday)
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  return { weekStart, weekEnd }
}

function getSlotMentee(sessions, weekday, slot, weekStart, weekEnd) {
  const booked = sessions.find((session) => {
    if (session.status !== "Accepted") {
      return false
    }
    const sessionDate = new Date(session.date)
    return sessionDate.getDay() === weekday &&
      session.time === slot &&
      sessionDate >= weekStart &&
      sessionDate <= weekEnd
  })

  return booked ? booked.mentee : "--"
}

function MentorSessions() {
  const [requests, setRequests] = useState(initialRequests)
  const [message, setMessage] = useState("")
  const { weekStart, weekEnd } = getCurrentWeekRange()

  const updateStatus = (id, nextStatus) => {
    if (nextStatus === "Accepted") {
      const target = requests.find((r) => r.id === id)
      const isConflicting = requests.some(
        (r) =>
          r.id !== id &&
          r.status === "Accepted" &&
          r.date === target.date &&
          r.time === target.time
      )

      if (isConflicting) {
        setMessage("No mentor available at that time")
        return
      }
    }

    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)))
    setMessage(`Session ${nextStatus.toLowerCase()}.`)
  }

  return (
    <div className="workspace">
      <MentorSidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>Mentor Sessions</h1>
          <p>Accept or cancel requests. Accepted sessions appear in weekly schedule.</p>
        </header>

        <article className="card">
          <h3>Weekly Prototype Schedule</h3>
          <table className="table prototype-table">
            <thead>
              <tr>
                <th>Day</th>
                {timeSlots.map((slot) => (
                  <th key={slot}>{slot}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekRows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  {timeSlots.map((slot) => (
                    <td key={slot}>{getSlotMentee(requests, row.day, slot, weekStart, weekEnd)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="card">
          <h3>Session Requests</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Mentee</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.mentee}</td>
                  <td>{request.date}</td>
                  <td>{request.time}</td>
                  <td>
                    <span className={`status-badge ${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-small" onClick={() => updateStatus(request.id, "Accepted")}>
                      Accept
                    </button>
                    <button className="btn btn-light btn-small" onClick={() => updateStatus(request.id, "Cancelled")}>
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

export default MentorSessions
