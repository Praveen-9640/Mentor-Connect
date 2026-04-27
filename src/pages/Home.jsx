import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"

const features = [
  {
    title: "Find a Mentor",
    desc: "Browse through our list of experienced mentors across various domains like Web Dev, Data Science, DSA, and more.",
  },
  {
    title: "Book Sessions",
    desc: "Pick a date and time slot that works for you and book a one-on-one session with your preferred mentor.",
  },
  {
    title: "Track Progress",
    desc: "Keep track of your upcoming and completed sessions. Stay on top of your learning journey.",
  },
]

function Home() {
  const navigate = useNavigate()
  const role = localStorage.getItem("role")

  const [stats, setStats] = useState([
    { label: "Mentors", value: "0" },
    { label: "Mentees", value: "0" },
    { label: "Topics Covered", value: "0" },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users")
        const users = res.data
        
        const mentors = users.filter(u => u.role.toUpperCase() === "MENTOR")
        const mentees = users.filter(u => u.role.toUpperCase() === "MENTEE")
        

        const subjects = new Set()
        mentors.forEach(m => {
          if (m.subject && m.subject.trim() !== "") {
            subjects.add(m.subject.trim().toLowerCase())
          }
        })

        setStats([
          { label: "Mentors", value: mentors.length.toString() },
          { label: "Mentees", value: mentees.length.toString() },
          { label: "Topics Covered", value: subjects.size.toString() },
        ])
      } catch (err) {
        console.error("Failed to fetch user stats", err)
      }
    }
    
    fetchStats()
  }, [])

  const dashboardPath =
    role === "admin"
      ? "/admin/dashboard"
      : role === "mentor"
        ? "/mentor/dashboard"
        : "/mentee/dashboard"

  return (
    <div style={{ display: "grid", gap: "14px" }}>
      {/* Hero */}
      <article className="card home-card" style={{ padding: "32px 24px", textAlign: "center" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: "2rem", color: "var(--primary)" }}>
          MentorConnect
        </h1>
        <p style={{ margin: "0 0 20px", color: "var(--muted)", fontSize: "1rem" }}>
          An online mentoring platform for CSE students to connect with experienced mentors.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          {role ? (
            <button className="btn" onClick={() => navigate(dashboardPath)}>
              Go to Dashboard
            </button>
          ) : (
            <button className="btn" onClick={() => navigate("/login")}>
              Login to Get Started
            </button>
          )}
          <button className="btn btn-light" onClick={() => navigate("/browse")}>
            Browse Mentors
          </button>
        </div>
      </article>

      {/* Stats */}
      <div className="stat-grid">
        {stats.map((s) => (
          <article key={s.label} className="stat-card">
            <p>{s.label}</p>
            <h3>{s.value}</h3>
          </article>
        ))}
      </div>

      {/* Features */}
      <article className="card">
        <h2>What you can do here</h2>
        <div className="cards" style={{ marginTop: "12px" }}>
          {features.map((f) => (
            <div key={f.title} className="card" style={{ boxShadow: "none", border: "1px solid var(--line)" }}>
              <h3 style={{ marginBottom: "6px", color: "var(--primary)" }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </article>

      {/* About */}
      <article className="card">
        <h2>About MentorConnect</h2>
        <p style={{ margin: "0", fontSize: "0.9rem", lineHeight: "1.7" }}>
          MentorConnect is a Full Stack Application Development project built by 2nd year CSE students.
          The platform allows students to register as mentees and get matched with senior mentors for
          guidance on technical topics, aptitude preparation, and career advice.
          Admins can manage users and approve sessions from a centralized dashboard.
        </p>
      </article>
    </div>
  )
}

export default Home
