import { useEffect, useState } from "react"
import Sidebar from "../../components/Sidebar"

const mentorNames = [
  "Nithya prasuna",
  "Anita Verma",
  "Kiran Patel",
  "Meera Nair",
  "Arjun Rao",
  "Sneha Kulkarni",
]

const initialSessions = [
  { id: 1, mentor: "Nithya prasuna", date: "2026-02-24", time: "08:00-10:00", status: "Scheduled" },
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

function getBookingRange() {
  const today = new Date()
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

function formatDateInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function parseDateInput(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function getSlotStartMinutes(slot) {
  const [start] = slot.split("-")
  const [hours, minutes] = start.split(":").map(Number)
  return hours * 60 + minutes
}

function isSlotBookable(selectedDate, slot, now = new Date()) {
  if (!selectedDate) return false

  const bookingDate = parseDateInput(selectedDate)
  bookingDate.setHours(0, 0, 0, 0)

  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  if (bookingDate < today) return false
  if (bookingDate > today) return true

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  return getSlotStartMinutes(slot) > currentMinutes
}

function getSlotMentor(sessions, weekday, slot, rangeStart, rangeEnd) {
  const booked = sessions.find((session) => {
    if (session.status !== "Scheduled") return false
    const sessionDate = parseDateInput(session.date)
    const day = sessionDate.getDay()
    return day === weekday && session.time === slot &&
      sessionDate >= rangeStart && sessionDate <= rangeEnd
  })

  return booked ? booked.mentor : "--"
}

function MySessions() {
  const { start, end } = getBookingRange()
  const minDate = formatDateInput(start)
  const maxDate = formatDateInput(end)
  const initialSlots = timeSlots.filter((slot) => isSlotBookable(minDate, slot))

  const [sessions, setSessions] = useState(initialSessions)
  const [message, setMessage] = useState("")
  const [selectedMentor, setSelectedMentor] = useState(mentorNames[0])
  const [selectedDate, setSelectedDate] = useState(minDate)
  const [selectedTime, setSelectedTime] = useState(initialSlots[0] ?? "")

  const availableTimeSlots = timeSlots.filter((slot) => isSlotBookable(selectedDate, slot))

  useEffect(() => {
    if (!availableTimeSlots.includes(selectedTime)) {
      setSelectedTime(availableTimeSlots[0] ?? "")
    }
  }, [availableTimeSlots, selectedTime])

  const cancelSession = (id) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "Cancelled" } : s)))
    setMessage("Session cancelled.")
  }

  const approveSession = (id) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "Scheduled" } : s)))
    setMessage("Session approved.")
  }

  const addSession = () => {
    if (!selectedDate) {
      setMessage("Please choose a date.")
      return
    }

    const bookingDate = parseDateInput(selectedDate)
    if (bookingDate < start || bookingDate > end) {
      setMessage("You can only book within the next 7 days.")
      return
    }

    if (!selectedTime || !isSlotBookable(selectedDate, selectedTime)) {
      setMessage("Please choose a future time slot.")
      return
    }

    const isAlreadyBooked = sessions.some(
      (session) =>
        session.date === selectedDate &&
        session.time === selectedTime &&
        session.status !== "Cancelled"
    )

    if (isAlreadyBooked) {
      setMessage("No mentor available at that time.")
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
    setMessage("Session booked!")
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
          <h3>Weekly Schedule</h3>
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
                    <td key={slot}>{getSlotMentor(sessions, row.day, slot, start, end)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="card">
          <h3>Book a Session</h3>
          <div className="booking-row">
            <label>
              Mentor
              <select value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
                {mentorNames.map((mentor) => (
                  <option key={mentor} value={mentor}>{mentor}</option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setMessage("")
                }}
                min={minDate}
                max={maxDate}
              />
            </label>
            <label>
              Time Slot
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={!availableTimeSlots.length}
              >
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
                {!availableTimeSlots.length ? <option value="">No slots available</option> : null}
              </select>
            </label>
          </div>
          <div className="actions">
            <button className="btn" onClick={addSession} disabled={!availableTimeSlots.length}>
              Book Session
            </button>
          </div>
          {message ? <p className="hint">{message}</p> : null}
        </article>

        <article className="card">
          <h3>My Bookings</h3>
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
                  <td>
                    <span className={`status-badge ${session.status.toLowerCase()}`}>
                      {session.status}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "6px" }}>
                    {session.status === "Cancelled" ? (
                      <button className="btn btn-small" onClick={() => approveSession(session.id)}>
                        Approve
                      </button>
                    ) : null}
                    <button className="btn btn-light btn-small" onClick={() => cancelSession(session.id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </div>
  )
}

export default MySessions
