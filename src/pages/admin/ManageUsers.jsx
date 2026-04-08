import { useEffect, useState } from "react"
import AdminSidebar from "../../components/AdminSidebar"
import api from "../../api"


function ManageUsers() {
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users")
      setUsers(res.data)
    } catch (err) {
      console.error("Failed to fetch users", err)
      setMessage("Failed to fetch users")
    }
  }

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`)
      setMessage("User removed.")
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      console.error(err)
      setMessage("Failed to remove user.")
    }
  }


  return (
    <div className="workspace">
      <AdminSidebar />

      <section className="workspace-main">
        <header className="page-header">
          <h1>Manage Users</h1>
          <p>View registered users.</p>
        </header>

        <article className="card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge active`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-light btn-small" onClick={() => deleteUser(user.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                   <td colSpan="4" style={{textAlign: "center"}}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {message ? <p className="hint">{message}</p> : null}
        </article>
      </section>
    </div>
  )
}

export default ManageUsers
