import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ReelsNavigation from '../../components/ReelsNavigation'
import SiteHeader from '../../components/SiteHeader'
import '../../auth.css'
import './Library.css'

const Saved = () => {
  const [foodItems, setFoodItems] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    axios.get('http://localhost:3000/api/food/saved', { withCredentials: true })
      .then((response) => {
        if (!Array.isArray(response.data?.food)) {
          throw new Error('Saved videos response did not include a food list.')
        }
        if (isCurrent) setFoodItems(response.data.food)
      })
      .catch((error) => {
        if (isCurrent) {
          setErrorMessage(error.response?.data?.message || error.message || 'Could not load saved videos.')
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  const removeSavedVideo = async (foodId) => {
    try {
      await axios.post('http://localhost:3000/api/food/save', { foodId }, { withCredentials: true })
      setFoodItems((items) => items.filter((item) => item._id !== foodId))
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Could not remove this saved video.')
    }
  }

  return (
    <main className="library-page">
      <SiteHeader className="library-header" label="YOUR COLLECTION" />
      <ReelsNavigation />
      <section className="library-content" aria-labelledby="saved-title">
        <p className="library-eyebrow">YOUR COLLECTION</p>
        <h1 id="saved-title">Saved videos</h1>
        <p className="library-intro">The food moments you want to come back to.</p>

        {isLoading && <p className="library-message" role="status">Loading your saved videos…</p>}
        {!isLoading && errorMessage && (
          <div className="library-message" role="alert">
            <p>{errorMessage}</p>
            {errorMessage.toLowerCase().includes('login') && <Link to="/login">Sign in</Link>}
          </div>
        )}
        {!isLoading && !errorMessage && foodItems.length === 0 && (
          <div className="library-empty">
            <span className="library-empty-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M6 3.5h12v17l-6-4-6 4z" /></svg>
            </span>
            <h2>Your saved list is waiting</h2>
            <p>Tap the save icon on a video and it will show up here.</p>
            <Link className="library-home-button" to="/home">Explore videos</Link>
          </div>
        )}
        {!isLoading && !errorMessage && foodItems.length > 0 && (
          <div className="saved-grid">
            {foodItems.map((food) => (
              <article className="saved-card" key={food._id}>
                <video src={food.video} controls playsInline preload="metadata" aria-label={`${food.name} video`} />
                <div className="saved-card-details">
                  <div>
                    <h2>{food.name}</h2>
                    <p>{food.description || 'A delicious moment worth saving.'}</p>
                  </div>
                  <button type="button" onClick={() => removeSavedVideo(food._id)} aria-label={`Remove ${food.name} from saved`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h12v17l-6-4-6 4z" /></svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Saved
