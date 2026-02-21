import { useNavigate } from "react-router-dom"

function MentorCard({ name, expertise, experience }) {
  const navigate = useNavigate()

  return (
    <article className="card mentor-card">
      <h3>{name}</h3>
      <p>Expertise: {expertise}</p>
      <p>Experience: {experience} years</p>
      <button className="btn" onClick={() => navigate("/mentee/sessions")}>
        Request Session
      </button>
    </article>
  )
}

export default MentorCard
