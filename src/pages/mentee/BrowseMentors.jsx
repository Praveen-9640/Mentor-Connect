import Sidebar from "../../components/Sidebar"
import MentorCard from "../../components/MentorCard"

const mentors = [
  { id: 1, name: "Rahul Sharma", expertise: "Web Development", experience: 5 },
  { id: 2, name: "Anita Verma", expertise: "Data Science", experience: 7 },
  { id: 3, name: "Kiran Patel", expertise: "UI/UX Design", experience: 4 },
  { id: 4, name: "Meera Nair", expertise: "Aptitude & Interview Prep", experience: 6 },
  { id: 5, name: "Arjun Rao", expertise: "Java & DSA", experience: 8 },
  { id: 6, name: "Sneha Kulkarni", expertise: "Cloud & DevOps", experience: 5 },
]

function BrowseMentors() {
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
              expertise={mentor.expertise}
              experience={mentor.experience}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default BrowseMentors
