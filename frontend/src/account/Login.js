import { useState } from 'react'
import FormErrors from '../components/FormErrors'
import { login } from '../lib/allauth'
import { Link } from 'react-router-dom'
import { useConfig } from '../auth'
import ProviderList from '../socialaccount/ProviderList'
import Button from '../components/Button'
import WebAuthnLoginButton from '../mfa/WebAuthnLoginButton'
import './Login.css'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [response, setResponse] = useState({ fetching: false, content: null })
  const [error, setError] = useState(null)
  const config = useConfig()
  const hasProviders = config.data.socialaccount?.providers?.length > 0

  function submit () {
    setResponse({ ...response, fetching: true })
    setError(null)
    login({ email, password }).then((content) => {
      setResponse((r) => { return { ...r, content } })
      // Handle successful login here
    }).catch((e) => {
      console.error(e)
      if (e.response && e.response.status === 409) {
        setError("There was a conflict with your login attempt. Please try again or contact support if the issue persists.")
      } else {
        setError("An error occurred during login. Please try again.")
      }
    }).finally(() => {
      setResponse((r) => { return { ...r, fetching: false } })
    })
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>

      <FormErrors errors={response.content?.errors} />
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type='email' required />
        <FormErrors param='email' errors={response.content?.errors} />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type='password' required />
        <FormErrors param='password' errors={response.content?.errors} />
        <Link to='/account/password/reset' className="forgot-password">Forgot your password?</Link>
      </div>

      <Button className="login-button" disabled={response.fetching} onClick={() => submit()}>Login</Button>

      <p className="signup-link">
        No account? <Link to='/account/signup'>Sign up here.</Link>
      </p>

      {hasProviders && (
        <div className="third-party-login">
          <h2>Or use a third-party</h2>
          <ProviderList callbackURL='/account/provider/callback' />
        </div>
      )}
    </div>
  )
}