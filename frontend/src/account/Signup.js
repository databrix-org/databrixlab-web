import { useState } from 'react'
import FormErrors from '../components/FormErrors'
import { signUp } from '../lib/allauth'
import { Link } from 'react-router-dom'
import { useConfig } from '../auth'
import ProviderList from '../socialaccount/ProviderList'
import Button from '../components/Button'
import './Signup.css'

export default function Signup () {
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [password2Errors, setPassword2Errors] = useState([])
  const [response, setResponse] = useState({ fetching: false, content: null })
  const config = useConfig()
  const hasProviders = config.data.socialaccount?.providers?.length > 0

  function submit () {
    if (password2 !== password1) {
      setPassword2Errors([{ param: 'password2', message: 'Password does not match.' }])
      return
    }
    setPassword2Errors([])
    setResponse({ ...response, fetching: true })
    signUp({ email, password: password1 }).then((content) => {
      setResponse((r) => { return { ...r, content } })
    }).catch((e) => {
      console.error(e)
      window.alert(e)
    }).then(() => {
      setResponse((r) => { return { ...r, fetching: false } })
    })
  }

  return (
    <div className="signup-container">
      <h1 className="signup-title">Sign Up</h1>
      <p className="login-link">
        Already have an account? <Link to='/account/login'>Login here.</Link>
      </p>

      <FormErrors errors={response.content?.errors} />

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type='email' required />
        <FormErrors param='email' errors={response.content?.errors} />
      </div>
      <div className="form-group">
        <label htmlFor="password1">Password</label>
        <input id="password1" autoComplete='new-password' value={password1} onChange={(e) => setPassword1(e.target.value)} type='password' required />
        <FormErrors param='password' errors={response.content?.errors} />
      </div>
      <div className="form-group">
        <label htmlFor="password2">Password (again)</label>
        <input id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} type='password' required />
        <FormErrors param='password2' errors={password2Errors} />
      </div>
      <Button className="signup-button" disabled={response.fetching} onClick={() => submit()}>Sign Up</Button>

      {hasProviders && (
        <div className="third-party-signup">
          <h2>Or use a third-party</h2>
          <ProviderList callbackURL='/account/provider/callback' />
        </div>
      )}
    </div>
  )
}