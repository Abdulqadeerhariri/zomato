import { Link } from 'react-router-dom'
import axios from 'axios'
import '../../auth.css'
import { useNavigate } from 'react-router-dom'
import SiteHeader from '../../components/SiteHeader'
import { saveAccount } from '../../utils/account'

const RegisterPage = () => {

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const fullName = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/register',
        {
          fullName,
          email,
          password
        },
        { withCredentials: true }
      );

      saveAccount({
        id: response.data.user._id,
        name: response.data.user.fullName,
        email: response.data.user.email,
        role: 'user',
      })
      navigate('/home')
    } catch (error) {
      console.error(
        'Registration error:',
        error.response?.data || error.message
      );
    }
  };



return (
  <main className="auth-shell">
    <section className="auth-panel" aria-labelledby="auth-title">
      <SiteHeader className="auth-header" label="FOOD, YOUR WAY" />

      <div className="auth-content">
        <div className="auth-copy">
          <p className="eyebrow">A LITTLE TASTE OF SOMETHING GOOD</p>
          <h1 id="auth-title">Good food, good mood</h1>
          <p className="auth-description">Create an account and find something delicious.</p>
          <div className="auth-art" aria-hidden="true">
            <span className="art-orbit art-orbit-one" />
            <span className="art-orbit art-orbit-two" />
            <span className="art-spark art-spark-one">✳</span>
            <span className="art-spark art-spark-two">✦</span>
            <span className="art-note">Made for your cravings.</span>
          </div>
        </div>

        <div className="form-card">
          <div className="form-heading">
            <h2>Create your account</h2>
            <p>It only takes a minute.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="full-name">Full name</label>
              <input id="full-name" name="name" type="text" placeholder="Alex Morgan" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" required />
            </div>
            <button className="submit-button" type="submit">Create account</button>
          </form>
          <p className="switch-copy">
            Already have an account? <Link className="text-link" to="/login">Sign in</Link>
          </p>
          <div className="form-divider"><span>OR</span></div>
          <p className="audience-switch">
            Signing up as a food partner?{' '}
            <Link className="text-link" to="/food-partner/register">Register as a food partner</Link>
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

export default RegisterPage
