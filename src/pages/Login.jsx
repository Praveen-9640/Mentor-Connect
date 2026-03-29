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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="login-page">
      {/* Left branding panel */}
      <div className="login-left">
        <div className="login-left-inner">
          <div className="login-logo-badge" aria-hidden="true">
            <span>MC</span>
          </div>
          <h1 className="login-brand-name">MentorConnect</h1>
          <p className="login-brand-tagline">Knowledge. Guidance. Growth.</p>

          <ul className="login-features">
            <li>
              <span className="login-feature-dot" />
              Connect with expert mentors
            </li>
            <li>
              <span className="login-feature-dot" />
              Book 1-on-1 sessions easily
            </li>
            <li>
              <span className="login-feature-dot" />
              Track your learning progress
            </li>
          </ul>
        </div>

        {/* Decorative blobs */}
        <div className="login-blob login-blob-a" aria-hidden="true" />
        <div className="login-blob login-blob-b" aria-hidden="true" />
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <div className="login-form-wrap">
          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-sub">Sign in to your account to continue</p>

          <p className="login-demo-hint">
            Demo — admin/admin123 · mentee/mentee123 · mentor/mentor123
          </p>

          <div className="login-field">
            <label className="login-label" htmlFor="login-role">Login as</label>
            <select
              id="login-role"
              className="login-input"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-username">Username</label>
            <input
              id="login-username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-captcha">
              Captcha: {captcha.a} + {captcha.b} = ?
            </label>
            <input
              id="login-captcha"
              className="login-input"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter answer"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="login-actions">
            <button className="btn login-btn" onClick={handleLogin}>
              Sign In
            </button>
            <button className="btn btn-light login-refresh-btn" onClick={refreshCaptcha}>
              Refresh Captcha
            </button>
          </div>

          <p className="login-back-link">
            <a href="/get-started">← Back</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
