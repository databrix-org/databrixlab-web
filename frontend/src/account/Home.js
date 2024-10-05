import { Link } from 'react-router-dom'

export default function Home () {
  return (
    <div>
      <h1>Welcome</h1>

      <p>Welcome to the React ❤️ django-allauth.</p>
      <p className="login-link">
        <Link to='/account/login'>Login here.</Link>
      </p>
    </div>
  )
}
