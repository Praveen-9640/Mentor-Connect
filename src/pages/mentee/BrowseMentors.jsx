import { useEffect, useState } from "react"
import Sidebar from "../../components/Sidebar"
import MentorCard from "../../components/MentorCard"
import api from "../../api"


function BrowseMentors() {
  const [mentors, setMentors] = useState([])

  useEffect(() => {
    fetchMentors()
  }, [])

  const fetchMentors = async () => {
    try {
      const res = await api.get("/users")
      // Filter only users with role MENTOR
      const mentorUsers = res.data.filter(u => u.role.toUpperCase() === "MENTOR")
      setMentors(mentorUsers)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="workspace">
      <Sidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>Browse Mentors</h1>
          <p>Choose a mentor and request a session.</p>
        </header>

        <div className="cards">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              name={mentor.name}
              expertise={mentor.subject || mentor.email}
              experience={"Experienced"}
            />
          ))}
          {mentors.length === 0 && <p>No mentors found in the platform.</p>}
        </div>
      </section>
    </div>
  )
}

export default BrowseMentors
