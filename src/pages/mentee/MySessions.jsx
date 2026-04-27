import { useEffect, useState } from "react"
import Sidebar from "../../components/Sidebar"
import api from "../../api"


function MySessions() {
  const [sessions, setSessions] = useState([])
  const [mentors, setMentors] = useState([])
  const [message, setMessage] = useState("")

  const [selectedMentor, setSelectedMentor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("08:00-10:00")

  const userId = localStorage.getItem("userId")

  useEffect(() => {
    fetchMentors()
    fetchSessions()
  }, [])

  const fetchMentors = async () => {
    try {
      const res = await api.get("/users")
      const mentorUsers = res.data.filter(u => u.role.toUpperCase() === "MENTOR")
      setMentors(mentorUsers)
      if (mentorUsers.length > 0) {
         setSelectedMentor(mentorUsers[0].id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchSessions = async () => {
    try {
      const res = await api.get("/sessions")

      setSessions(res.data.filter(s => s.mentee?.id === Number(userId)))
    } catch (err) {
      console.error(err)
    }
  }

  const addSession = async () => {
    if (!selectedDate || !selectedPeriod) {
      setMessage("Please fill all booking fields.")
      return
    }

    const [startSpan, endSpan] = selectedPeriod.split("-")

    try {
      const body = {
        startTime: `${selectedDate}T${startSpan}:00`,
        endTime: `${selectedDate}T${endSpan}:00`,
        status: "Pending",
        mentee: { id: Number(userId) },
        mentor: { id: Number(selectedMentor) }
      }

      await api.post("/sessions/book", body)
      setMessage("Session booked successfully!")
      fetchSessions()
    } catch (err) {
       console.error(err)
       setMessage(err.response?.data?.error || "Failed to book session")
    }
  }

  const handleDownloadCSV = () => {
    if (sessions.length === 0) {
      alert("No sessions to download.");
      return;
    }


    const headers = ["Mentor Name", "Start Time", "End Time", "Status"];
    

    const rows = sessions.map(session => [
      session.mentor?.name || "Unknown",
      new Date(session.startTime).toLocaleString(),
      new Date(session.endTime).toLocaleTimeString(),
      session.status
    ]);


    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
    ].join("\n");


    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `My_Sessions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <h3>Book a Session</h3>
          <div className="booking-row">
            <label>
              Mentor
              <select value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </label>
            <label>
              Time Period
              <select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
                <option value="08:00-10:00">08:00 AM - 10:00 AM</option>
                <option value="13:00-15:00">01:00 PM - 03:00 PM</option>
                <option value="17:00-19:00">05:00 PM - 07:00 PM</option>
              </select>
            </label>
          </div>
          <div className="actions">
             <button className="btn" onClick={addSession}>
              Book Session
            </button>
          </div>
          {message && <p className="hint">{message}</p>}
        </article>

        <article className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>My Bookings</h3>
            <button className="btn btn-small" onClick={handleDownloadCSV}>
              Download CSV
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Mentor</th>
                <th>Time Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
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
                   <td colSpan="3" style={{textAlign: "center"}}>No sessions booked yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </article>
      </section>
    </div>
  )
}

export default MySessions
