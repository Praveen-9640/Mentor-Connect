import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"

function randomNumber() {
  return Math.floor(Math.random() * 9) + 1
}

function Login() {
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false) 
  const [selectedRole, setSelectedRole] = useState("mentee")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [subject, setSubject] = useState("")
  const [studyYear, setStudyYear] = useState("")
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

  const handleAuth = async () => {
    const isCaptchaCorrect = Number(captchaInput) === captcha.answer
    if (!isCaptchaCorrect) {
      setError("Captcha is wrong.")
      refreshCaptcha()
      return
    }

    if (isSignup) {

      if (!name || !email || !password) {
        setError("Please fill in all fields.")
        return
      }
      if (!email.includes("@")) {
        setError("Please enter a valid email address.")
        return
      }
      if (password.length < 8) {
        setError("Password must contain 8 characters")
        return
      }

      if (selectedRole === "mentor" && !subject.trim()) {
        setError("Please enter your subject.")
        return
      }
      if (selectedRole === "mentee" && !studyYear.trim()) {
        setError("Please enter your year of study.")
        return
      }
      
      try {
        const payload = {
          name,
          email,
          password,
          role: selectedRole.toUpperCase(),
          subject: selectedRole === "mentor" ? subject : null,
          studyYear: selectedRole === "mentee" ? studyYear : null,
        }
        await api.post("/api/auth/register", payload)
        
        alert(`Account created for ${name} (${email}) as ${selectedRole}!`);
        setIsSignup(false); 
        setError("");
        refreshCaptcha();
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed")
        refreshCaptcha()
      }
    } else {

      if (!email || !password) {
        setError("Please enter email and password.")
        return
      }

      try {
        const payload = { email, password }
        const res = await api.post("/api/auth/login", payload)
        
        const user = res.data;
        

        const userRoleLower = user.role.toLowerCase()
        if (userRoleLower !== selectedRole.toLowerCase()) {
           setError(`You are not registered as a ${selectedRole}.`)
           refreshCaptcha()
           return;
        }


        localStorage.setItem("role", userRoleLower)
        localStorage.setItem("userId", user.id)
        localStorage.setItem("userName", user.name)
        localStorage.setItem("token", user.token)

        if (userRoleLower === "admin") navigate("/admin/dashboard")
        else if (userRoleLower === "mentor") navigate("/mentor/dashboard")
        else navigate("/mentee/dashboard")

      } catch (err) {
        setError(err.response?.data?.message || "Invalid credentials.")
        refreshCaptcha()
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAuth()
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

        <div className="login-blob login-blob-a" aria-hidden="true" />
        <div className="login-blob login-blob-b" aria-hidden="true" />
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <div className="login-form-wrap">
          <h2 className="login-form-title">{isSignup ? "Create Account" : "Welcome back"}</h2>
          <p className="login-form-sub">
            {isSignup ? "Join the community today" : "Sign in to your account to continue"}
          </p>

          <div className="login-field">
            <label className="login-label" htmlFor="login-role">{isSignup ? "Register as" : "Login as"}</label>
            <select
              id="login-role"
              className="login-input"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
              {!isSignup && <option value="admin">Admin</option>}
            </select>
          </div>

          {/* NAME FIELD - Only shows during Signup */}
          {isSignup && (
            <div className="login-field">
              <label className="login-label" htmlFor="login-name">Full Name</label>
              <input
                id="login-name"
                className="login-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="login-field">
            <label className="login-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your email"
            />
          </div>

          <div className="login-field" style={{ position: "relative" }}>
            <label className="login-label" htmlFor="login-password">Password</label>
            <div style={{ display: "flex", width: "100%", position: "relative" }}>
              <input
                id="login-password"
                className="login-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter password"
                style={{ flex: 1, paddingRight: "40px" }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem"
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {isSignup && selectedRole === "mentor" && (
            <div className="login-field">
              <label className="login-label" htmlFor="login-subject">Which Subject?</label>
              <input
                id="login-subject"
                className="login-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter expertise subject"
              />
            </div>
          )}

          {isSignup && selectedRole === "mentee" && (
            <div className="login-field">
              <label className="login-label" htmlFor="login-year">Which Year?</label>
              <input
                id="login-year"
                className="login-input"
                value={studyYear}
                onChange={(e) => setStudyYear(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your year of study"
              />
            </div>
          )}

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
            <button className="btn login-btn" onClick={handleAuth}>
              {isSignup ? "Register" : "Sign In"}
            </button>
            <button className="btn btn-light login-refresh-btn" onClick={refreshCaptcha}>
              Refresh
            </button>
          </div>

          <p className="login-toggle-text" style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              type="button"
              onClick={() => { 
                const nextIsSignup = !isSignup;
                setIsSignup(nextIsSignup); 
                if (nextIsSignup && selectedRole === "admin") setSelectedRole("mentee");
                setError(""); 
                setCaptchaInput(""); 
              }}
              style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
            >
              {isSignup ? "Login here" : "Sign up here"}
            </button>
          </p>

          <p className="login-back-link">
            <a href="/get-started">← Back</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login