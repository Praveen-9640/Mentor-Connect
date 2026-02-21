import { useState } from "react"
import AdminSidebar from "../../components/AdminSidebar"

const initialUsers = [
  { id: 1, name: "Rahul Sharma", role: "Mentor", status: "Approved" },
  { id: 2, name: "Anita Verma", role: "Mentor", status: "Pending" },
  { id: 3, name: "Karthik Reddy", role: "Mentee", status: "Active" },
]

function ManageUsers() {
  const [users, setUsers] = useState(initialUsers)
  const [message, setMessage] = useState("")

  const approveUser = (id) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, status: "Approved" } : user))
    )
    setMessage("User approved.")
  }

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id))
    setMessage("User removed.")
  }

  return (
    <div className="workspace">
      <AdminSidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>Manage Users</h1>
          <p>Approve or remove users.</p>
        </header>

        <article className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <button className="btn btn-small" onClick={() => approveUser(user.id)}>
                      Approve
                    </button>
                    <button className="btn btn-light btn-small" onClick={() => deleteUser(user.id)}>
                      Delete
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

export default ManageUsers
