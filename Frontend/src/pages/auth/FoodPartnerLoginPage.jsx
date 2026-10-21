import { Link } from 'react-router-dom'
import '../../auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import SiteHeader from '../../components/SiteHeader'
import { saveAccount } from '../../utils/account'

const FoodPartnerLoginPage = () => {
  
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/food-partner/login',
        { email, password },
        { withCredentials: true } // Include credentials in the request
      )
      saveAccount({
        id: response.data.foodPartner._id,
        name: response.data.foodPartner.resturantName || response.data.foodPartner.name,
        email: response.data.foodPartner.email,
        role: 'foodPartner',
      })
      navigate('/home')
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      // Handle login error (e.g., show an error message to the user)
    }
  }

  return (
  <main className="auth-shell">
    <section className="auth-panel" aria-labelledby="auth-title">
      <SiteHeader className="auth-header" label="PARTNER PORTAL" />

      <div className="auth-content">
        <div className="auth-copy">
          <p className="eyebrow">FOR RESTAURANTS</p>
          <h1 id="auth-title">Welcome back</h1>
          <p className="auth-description">Sign in to pick up where you left off.</p>
          <div className="auth-art" aria-hidden="true">
            <span className="art-orbit art-orbit-one" />
            <span className="art-orbit art-orbit-two" />
            <span className="art-spark art-spark-one">✳</span>
            <span className="art-spark art-spark-two">✦</span>
            <span className="art-note">Made for your business.</span>
          </div>
        </div>

        <div className="form-card">
          <div className="form-heading">
            <h2>Sign in</h2>
            <p>Enter your details below.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="field">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <a className="text-link" href="#forgot-password">Forgot password?</a>
              </div>
              <input id="password" name="password" type="password" placeholder="At least 8 characters" autoComplete="current-password" />
            </div>
            <button className="submit-button" type="submit">Sign in</button>
          </form>
          <p className="switch-copy">
            New here? <Link className="text-link" to="/food-partner/register">Create an account</Link>
          </p>
          <div className="form-divider"><span>OR</span></div>
          <p className="audience-switch">
            Signing up as a diner?{' '}
            <Link className="text-link" to="/register">Register as a normal user</Link>
          </p>
        </div>
      </div>

      <footer className="auth-footer">
        <span>© 2026 Zomato</span>
        <span>Made for good food moments</span>
      </footer>
    </section>
  </main>
)
}

export default FoodPartnerLoginPage
