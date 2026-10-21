import { useState } from 'react'
import axios from 'axios'
import SiteHeader from '../../components/SiteHeader'
import '../../auth.css'
import './CreateFood.css'

const CreateFood = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedVideoName, setSelectedVideoName] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    const form = event.currentTarget

    try {
      const formData = new FormData(form)
      await axios.post('http://localhost:3000/api/food', formData, {
        withCredentials: true,
        onUploadProgress: ({ loaded, total }) => {
          if (total) setUploadProgress(Math.round((loaded * 100) / total))
        },
      })
      form.reset()
      setSelectedVideoName('')
      setSuccessMessage('Your food video has been published.')
    } catch (error) {
      console.error('Could not create food video:', error.response?.data || error.message)
      setErrorMessage(
        error.response?.data?.message || 'Could not publish your video. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
      setUploadProgress(null)
    }
  }

  return (
    <main className="create-food-page">
      <SiteHeader className="create-food-header" label="PARTNER PORTAL" />

      <section className="create-food-content" aria-labelledby="create-food-title">
        <div className="create-food-intro">
          <p className="create-food-eyebrow">FROM YOUR KITCHEN</p>
          <h1 id="create-food-title">Share a dish</h1>
          <p>Give your video a name, add a little context, and show customers what you make.</p>
        </div>

        <form className="create-food-form" onSubmit={handleSubmit}>
          <div className="create-food-form-heading">
            <span className="create-food-step">NEW VIDEO</span>
            <h2>Food details</h2>
            <p>Fields marked with * are required.</p>
          </div>

          <div className="create-food-field">
            <label htmlFor="food-name">Video name <span aria-hidden="true">*</span></label>
            <input
              id="food-name"
              name="name"
              type="text"
              placeholder="e.g. Our signature truffle pasta"
              maxLength={100}
              required
            />
          </div>

          <div className="create-food-field">
            <label htmlFor="food-description">Description</label>
            <textarea
              id="food-description"
              name="description"
              placeholder="Tell customers what makes this dish special..."
              rows={4}
              maxLength={500}
            />
            <span className="create-food-hint">Keep it short and appetizing (up to 500 characters).</span>
          </div>

          <div className="create-food-field">
            <label htmlFor="food-video">Video file <span aria-hidden="true">*</span></label>
            <div className="create-food-dropzone">
              <input
                className="create-food-file-input"
                id="food-video"
                name="video"
                type="file"
                accept="video/*"
                aria-describedby="food-video-hint"
                onChange={(event) => setSelectedVideoName(event.target.files?.[0]?.name || '')}
                required
              />
              <div className="create-food-dropzone-content" aria-hidden="true">
                <span className="create-food-upload-icon">
                  <svg viewBox="0 0 32 32">
                    <path d="M16 21V5m0 0-6 6m6-6 6 6M7 20v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" />
                  </svg>
                </span>
                <span className="create-food-file-copy">
                  <strong>{selectedVideoName || 'Choose a video to upload'}</strong>
                  <span>{selectedVideoName ? 'Select a different video' : 'Tap to browse your files'}</span>
                </span>
                <span className="create-food-browse-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </div>
            </div>
            <span className="create-food-hint" id="food-video-hint">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="6" />
                <path d="M8 7v4m0-6h.01" />
              </svg>
              Choose a video file to feature this dish.
            </span>
          </div>

          {errorMessage && <p className="create-food-message create-food-error" role="alert">{errorMessage}</p>}
          {successMessage && <p className="create-food-message create-food-success" role="status">{successMessage}</p>}

          {isSubmitting && (
            <div
              className="create-food-upload"
              role="status"
              aria-label={uploadProgress === null ? 'Uploading video' : `Uploading video: ${uploadProgress}%`}
            >
              <span className="create-food-spinner" aria-hidden="true" />
              <div className="create-food-upload-details">
                <span>{uploadProgress === null ? 'Uploading video…' : `Uploading video… ${uploadProgress}%`}</span>
                <div className="create-food-progress-track">
                  <span
                    className={`create-food-progress-fill${uploadProgress === null ? ' is-indeterminate' : ''}`}
                    style={uploadProgress === null ? undefined : { width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <button className="create-food-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing video…' : 'Publish video'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default CreateFood
