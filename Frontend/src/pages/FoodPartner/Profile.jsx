import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import SiteHeader from '../../components/SiteHeader'
import { getAccount } from '../../utils/account'
import '../../auth.css'
import './Profile.css'

const Profile = () => {
  const { profile } = useParams()
  const [profileData, setProfileData] = useState(null)
  const [account] = useState(getAccount)
  const canCreateFood = account?.role === 'foodPartner' && account.id === profile

  useEffect(() => {
    if (!profile) return undefined

    let isCurrent = true

    axios.get(`http://localhost:3000/api/food-partner/${profile}`)
      .then((response) => {
        if (isCurrent) {
          setProfileData({
            id: profile,
            foodPartner: response.data.foodPartner,
            videos: response.data.food,
          })
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setProfileData({
            id: profile,
            error: error.response?.data?.message || 'Could not load this restaurant profile.',
          })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [profile])

  return (
    <main className="partner-profile-page">
      <SiteHeader className="partner-profile-header" label="PARTNER PROFILE" />

      <div className="partner-profile-content">
        {!profile ? (
          <p role="alert">A restaurant profile ID is required.</p>
        ) : profileData?.id === profile && profileData.error ? (
          <p role="alert">{profileData.error}</p>
        ) : profileData?.id === profile && profileData.foodPartner ? (
          <>
            <section className="partner-summary" aria-label="Restaurant profile">
              <div className="partner-avatar" role="img" aria-label="Restaurant profile image">
                <svg viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M8 21h32v20H8zM5 21 9 8h30l4 13M17 41V28h14v13M16 15h.01M24 15h.01M32 15h.01" />
                </svg>
              </div>

              <div className="partner-details">
                <div className="partner-detail-card">
                  <span className="partner-detail-label">RESTAURANT</span>
                  <h1>{profileData.foodPartner.resturantName}</h1>
                </div>
                <div className="partner-detail-card">
                  <span className="partner-detail-label">LOCATION</span>
                  <p>{profileData.foodPartner.address}</p>
                </div>
              </div>

              <div className="partner-stats" aria-label="Restaurant statistics">
                <div className="partner-stat-card">
                  <span className="partner-stat-label">Total meals</span>
                  <strong>{profileData.videos.length}</strong>
                </div>
                <div className="partner-stat-card">
                  <span className="partner-stat-label">Customers served</span>
                  <strong>15K</strong>
                </div>
              </div>
            </section>

            <section className="partner-videos-section" aria-labelledby="partner-videos-title">
              <div className="partner-videos-heading">
                <div>
                  <p className="partner-section-eyebrow">FROM YOUR KITCHEN</p>
                  <h2 id="partner-videos-title">Your videos</h2>
                </div>
                <div className="partner-videos-actions">
                  <span className="partner-video-count">{profileData.videos.length} videos</span>
                  {canCreateFood && (
                    <Link className="partner-create-food-button" to="/food-partner/create">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <span>Create food post</span>
                    </Link>
                  )}
                </div>
              </div>
              <div className="partner-video-grid">
                {profileData.videos.map((video) => (
                  <article className="partner-video-tile" key={video._id}>
                    <video
                      className="partner-video"
                      src={video.video}
                      controls
                      preload="metadata"
                      aria-label={`${video.name || 'Restaurant'} video`}
                    />
                  </article>
                ))}
              </div>
              {profileData.videos.length === 0 && <p>No videos have been added yet.</p>}
            </section>
          </>
        ) : (
          <p role="status">Loading restaurant profile...</p>
        )}
      </div>
    </main>
  )
}

export default Profile
