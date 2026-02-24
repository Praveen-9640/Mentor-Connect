import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

function randomNumber() {
  return Math.floor(Math.random() * 9) + 1
}

function Login() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState("mentee")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [captchaInput, setCaptchaInput] = useState("")
  const [error, setError] = useState("")
  const [seed, setSeed] = useState(0)

  const captcha = useMemo(() => {
    const a = randomNumber()
    const b = randomNumber()
    return { a, b, answer: a + b }
  }, [seed])

  const refreshCaptcha = () => {
    setCaptchaInput("")
    setSeed((prev) => prev + 1)
  }

  const handleLogin = () => {
    const isCaptchaCorrect = Number(captchaInput) === captcha.answer
    if (!isCaptchaCorrect) {
      setError("Captcha is wrong.")
      refreshCaptcha()
      return
    }

    if (selectedRole === "admin" && username === "admin" && password === "admin123") {
      localStorage.setItem("role", "admin")
      navigate("/admin/dashboard")
      return
    }

    if (selectedRole === "mentee" && username === "mentee" && password === "mentee123") {
      localStorage.setItem("role", "mentee")
      navigate("/mentee/dashboard")
      return
    }

    if (selectedRole === "mentor" && username === "mentor" && password === "mentor123") {
      localStorage.setItem("role", "mentor")
      navigate("/mentor/sessions")
      return
    }

    setError(`Invalid ${selectedRole} credentials.`)
    refreshCaptcha()
  }

  return (
    <section className="card login-card">
      <h2>Login</h2>
      <p className="hint">Demo credentials: admin/admin123, mentee/mentee123, mentor/mentor123</p>

      <label>
        Login as
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <label>
        Username
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin or mentee or mentor"
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </label>

      <label>
        Captcha: {captcha.a} + {captcha.b} = ?
        <input
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          placeholder="Enter answer"
        />
      </label>

      <div className="actions">
        <button className="btn" onClick={handleLogin}>Login</button>
        <button className="btn btn-light" onClick={refreshCaptcha}>Refresh Captcha</button>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
    </section>
  )
}

export default Login
