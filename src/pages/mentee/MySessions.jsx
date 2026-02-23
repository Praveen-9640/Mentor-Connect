import { useState } from "react"
import Sidebar from "../../components/Sidebar"

const mentorNames = [
  "Rahul Sharma",
  "Anita Verma",
  "Kiran Patel",
  "Meera Nair",
  "Arjun Rao",
  "Sneha Kulkarni",
]

const initialSessions = [
  { id: 1, mentor: "Rahul Sharma", date: "2026-02-24", time: "08:00-10:00", status: "Scheduled" },
  { id: 2, mentor: "Anita Verma", date: "2026-02-26", time: "12:00-15:00", status: "Scheduled" },
]

const timeSlots = ["08:00-10:00", "12:00-15:00", "15:00-17:00"]
const weekRows = [
  { label: "Mon", day: 1 },
  { label: "Tue", day: 2 },
  { label: "Wed", day: 3 },
  { label: "Thu", day: 4 },
  { label: "Fri", day: 5 },
  { label: "Sat", day: 6 },
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

function formatDateInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getSlotMentor(sessions, weekday, slot, weekStart, weekEnd) {
  const booked = sessions.find((session) => {
    if (session.status !== "Scheduled") {
      return false
    }
    const sessionDate = new Date(session.date)
    const day = sessionDate.getDay()
    return day === weekday &&
      session.time === slot &&
      sessionDate >= weekStart &&
      sessionDate <= weekEnd
  })

  return booked ? booked.mentor : "--"
}

function MySessions() {
  const { weekStart, weekEnd } = getCurrentWeekRange()
  const minDate = formatDateInput(weekStart)
  const maxDate = formatDateInput(weekEnd)

  const [sessions, setSessions] = useState(initialSessions)
  const [message, setMessage] = useState("")
  const [selectedMentor, setSelectedMentor] = useState(mentorNames[0])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("08:00-10:00")

  const cancelSession = (id) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "Cancelled" } : s)))
    setMessage("Session cancelled.")
  }

  const addSession = () => {
    if (!selectedDate) {
      setMessage("Please choose a date from calendar.")
      return
    }

    const bookingDate = new Date(selectedDate)
    if (bookingDate < weekStart || bookingDate > weekEnd) {
      setMessage("Please select a date from current week only.")
      return
    }

    const isAlreadyBooked = sessions.some(
      (session) =>
        session.date === selectedDate &&
        session.time === selectedTime &&
        session.status !== "Cancelled"
    )

    if (isAlreadyBooked) {
      setMessage("No mentor available at that time")
      return
    }

    setSessions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        mentor: selectedMentor,
        date: selectedDate,
        time: selectedTime,
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
                    <td key={slot}>{getSlotMentor(sessions, row.day, slot, weekStart, weekEnd)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="card">
          <div className="booking-row">
            <label>
              Mentor
              <select value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
                {mentorNames.map((mentor) => (
                  <option key={mentor} value={mentor}>
                    {mentor}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                max={maxDate}
              />
            </label>
            <label>
              Time Slot
              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
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
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.mentor}</td>
                  <td>{session.date}</td>
                  <td>{session.time}</td>
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
