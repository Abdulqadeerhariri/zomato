import { Link } from 'react-router-dom'
import '../../auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import SiteHeader from '../../components/SiteHeader'
import { saveAccount } from '../../utils/account'

const FoodPartnerRegisterPage = () => {

  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hundleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const restaurantName = e.target.restaurantName.value;
    const contactName = e.target.name.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/food-partner/register',
        {
          resturantName: restaurantName,
          contactName,
          phone,
          address,
          email,
          password
        },
        {
          withCredentials: true // Include credentials in the request
        }
      );
      saveAccount({
        id: response.data.foodPartner._id,
        name: response.data.foodPartner.resturantName,
        email: response.data.foodPartner.email,
        role: 'foodPartner',
      })
      navigate('/home')

    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message)
      setErrorMessage(
        error.response?.data?.message ||
          (error.response
            ? 'Registration failed. Please check your details and try again.'
            : 'Could not connect to the server. Please try again later.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-labelledby="auth-title">
        <SiteHeader className="auth-header" label="PARTNER PORTAL" />

        <div className="auth-content">
          <div className="auth-copy">
            <p className="eyebrow">FOR RESTAURANTS</p>
            <h1 id="auth-title">Grow with us</h1>
            <p className="auth-description">Bring your kitchen to a table full of new customers.</p>
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
              <h2>Create your account</h2>
              <p>It only takes a minute.</p>
            </div>
            <form className="auth-form" onSubmit={hundleSubmit}>
              <div className="field">
                <label htmlFor="restaurant-name">Restaurant name</label>
                <input id="restaurant-name" name="restaurantName" type="text" placeholder="e.g. The Green Plate" autoComplete="organization" required />
              </div>
              <div className="field">
                <label htmlFor="full-name">Your name</label>
                <input id="full-name" name="name" type="text" placeholder="Your name" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="phone-number">Phone number</label>
                <input id="phone-number" name="phone" type="tel" placeholder="+1 (555) 000-0000" autoComplete="tel" required />
              </div>
              <div className="field">
                <label htmlFor="address">Home address</label>
                <input id="address" name="address" type="text" placeholder="Street, city, postal code" autoComplete="street-address" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" required />
              </div>
              {errorMessage && <p className="form-message form-message-error" role="alert">{errorMessage}</p>}
              <button className="submit-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Join as a partner'}
              </button>
            </form>
            <p className="switch-copy">
              Already have an account? <Link className="text-link" to="/food-partner/login">Sign in</Link>
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

export default FoodPartnerRegisterPage
