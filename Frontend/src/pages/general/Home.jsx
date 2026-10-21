import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SiteHeader from '../../components/SiteHeader'
import ReelActions from '../../components/ReelActions'
import ReelsNavigation from '../../components/ReelsNavigation'
import '../../auth.css'
import './Home.css'

const getFeedErrorMessage = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 401
      ? 'Please sign in to watch food videos.'
      : error.response?.data?.message || 'Unable to load food videos. Please try again.'
  }
  return 'Unable to load food videos. Please try again.'
}

const getFoodItems = (response) => {
  if (!Array.isArray(response.data?.food)) {
    throw new Error('Food feed response did not include a food list.')
  }
  return response.data.food
}

const isPlaybackAbort = (error) => error.name === 'AbortError'

const Home = () => {
  const [foodItems, setFoodItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [playingIndex, setPlayingIndex] = useState(null)
  const [actionMessage, setActionMessage] = useState('')
  const feedRef = useRef(null)

  const togglePlayback = (event) => {
    const video = event.currentTarget.closest('.reel-frame')?.querySelector('video')
    if (!video) return
    const index = Number(video.closest('.reel-slide')?.dataset.index)

    if (video.paused) {
      video.play()
        .then(() => setPlayingIndex(index))
        .catch((error) => {
          setPlayingIndex(null)
          if (!isPlaybackAbort(error)) {
            console.error('Could not play food video:', error)
          }
        })
    } else {
      video.pause()
      setPlayingIndex(null)
    }
  }

  const seekVideo = (event, seconds) => {
    const video = event.currentTarget.closest('.reel-frame')?.querySelector('video')
    if (!video) return

    const nextTime = video.currentTime + seconds
    video.currentTime = Math.max(0, Number.isFinite(video.duration) ? Math.min(video.duration, nextTime) : nextTime)
  }

  const updateFoodAction = async (food, action) => {
    const property = action === 'like' ? 'isLiked' : 'isSaved'
    const previousValue = Boolean(food[property])
    const nextFoodItems = foodItems.map((item) => item._id === food._id
      ? {
          ...item,
          [property]: !previousValue,
          ...(action === 'like' ? { likeCount: Math.max(0, (item.likeCount || 0) + (previousValue ? -1 : 1)) } : {}),
          ...(action === 'save' ? { saveCount: Math.max(0, (item.saveCount || 0) + (previousValue ? -1 : 1)) } : {}),
        }
      : item)
    setFoodItems(nextFoodItems)
    setActionMessage('')

    try {
      await axios.post(`http://localhost:3000/api/food/${action}`, { foodId: food._id }, {
        withCredentials: true,
      })
    } catch (error) {
      setFoodItems(foodItems)
      setActionMessage(error.response?.data?.message || `Could not ${previousValue ? 'update' : action} this video.`)
    }
  }

  const openComments = (food) => {
    setActionMessage(`Comments for “${food.name}” are not available yet.`)
  }

  const loadFoodItems = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await axios.get('http://localhost:3000/api/food', {
        withCredentials: true,
      })
      setFoodItems(getFoodItems(response))
    } catch (error) {
      setErrorMessage(getFeedErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isCurrent = true

    axios.get('http://localhost:3000/api/food', { withCredentials: true })
      .then((response) => {
        if (isCurrent) setFoodItems(getFoodItems(response))
      })
      .catch((error) => {
        if (isCurrent) setErrorMessage(getFeedErrorMessage(error))
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    const feed = feedRef.current
    if (!feed || foodItems.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector('video')
          if (!video) return
          const index = Number(entry.target.dataset.index)

          if (entry.isIntersecting) {
            setActiveIndex(index)
            video.play()
              .then(() => {
                if (!video.paused) setPlayingIndex(index)
              })
              .catch((error) => {
                if (!isPlaybackAbort(error)) {
                  console.error('Could not play food video:', error)
                }
              })
          } else {
            video.pause()
            setPlayingIndex((currentIndex) => currentIndex === index ? null : currentIndex)
          }
        })
      },
      { root: feed, threshold: 0.65 },
    )

    feed.querySelectorAll('.reel-slide').forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [foodItems])

  return (
    <main className="reels-page">
      <SiteHeader className="reels-header" label="FOOD, YOUR WAY" />
      <ReelsNavigation />
      {actionMessage && <p className="reels-action-message" role="status">{actionMessage}</p>}

      {isLoading && (
        <div className="reels-state" role="status">
          <span className="reels-loader" />
          <p>Finding something delicious…</p>
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="reels-state" role="alert">
          <p className="reels-state-eyebrow">YOUR FOOD FEED</p>
          <h1>{errorMessage}</h1>
          {errorMessage.startsWith('Please sign in') ? (
            <Link className="reels-state-button" to="/login">Sign in</Link>
          ) : (
            <button className="reels-state-button" type="button" onClick={loadFoodItems}>Try again</button>
          )}
        </div>
      )}

      {!isLoading && !errorMessage && foodItems.length === 0 && (
        <div className="reels-state">
          <p className="reels-state-eyebrow">YOUR FOOD FEED</p>
          <h1>No videos yet</h1>
          <p>When restaurants share something tasty, you’ll find it here.</p>
        </div>
      )}

      {!isLoading && !errorMessage && foodItems.length > 0 && (
        <>
          <div className="reels-feed" ref={feedRef} aria-label="Food videos">
            {foodItems.map((food, index) => (
              <article className="reel-slide" data-index={index} key={food._id}>
                <div className="reel-frame">
                  <ReelActions
                    food={food}
                    liked={food.isLiked}
                    saved={food.isSaved}
                    onLike={() => updateFoodAction(food, 'like')}
                    onComment={() => openComments(food)}
                    onSave={() => updateFoodAction(food, 'save')}
                  />
                  <video
                    className="reel-video"
                    src={food.video}
                    autoPlay={index === 0}
                    loop
                    muted
                    playsInline
                    preload={index === 0 ? 'auto' : 'metadata'}
                    aria-label={`${food.name} video`}
                  />
                  <div className="reel-shade" />
                  <div className="reel-controls" aria-label="Video playback controls">
                    <button
                      className="reel-control-button reel-skip-button"
                      type="button"
                      aria-label="Go back 5 seconds"
                      onClick={(event) => seekVideo(event, -5)}
                    >
                      <svg viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M9 16V7m0 0h9M9 7l6 6a17 17 0 1 1-5 17" />
                      </svg>
                      <span>5</span>
                    </button>
                    <button
                      className="reel-control-button reel-play-button"
                      type="button"
                      aria-label={playingIndex === index ? 'Pause video' : 'Play video'}
                      aria-pressed={playingIndex === index}
                      onClick={togglePlayback}
                    >
                      {playingIndex === index ? (
                        <svg viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M17 13h5v22h-5zm9 0h5v22h-5z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M17 12v24l20-12z" />
                        </svg>
                      )}
                    </button>
                    <button
                      className="reel-control-button reel-skip-button"
                      type="button"
                      aria-label="Go forward 5 seconds"
                      onClick={(event) => seekVideo(event, 5)}
                    >
                      <svg viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M39 16V7m0 0h-9m9 0-6 6a17 17 0 1 0 5 17" />
                      </svg>
                      <span>5</span>
                    </button>
                  </div>
                  <div className="reel-content">
                    <p className="reel-description">{food.description || food.name}</p>
                    <Link to={`/food-partner/${food.foodPartner}`}>
                    <button
                      className="reel-store-button"
                      type="button"
                      aria-label={`Visit store for ${food.name}`}
                    >
                      Visit store <span aria-hidden="true">↗</span>
                    </button>
                    </Link>
                  </div>
                  <span className="reel-counter" aria-label={`Video ${index + 1} of ${foodItems.length}`}>
                    {String(index + 1).padStart(2, '0')} <span>/</span> {String(foodItems.length).padStart(2, '0')}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="reel-pagination" aria-hidden="true">
            {foodItems.map((food, index) => (
              <span className={index === activeIndex ? 'reel-dot is-active' : 'reel-dot'} key={food._id} />
            ))}
          </div>
          <span className="reel-scroll-hint" aria-hidden="true">SCROLL TO EXPLORE <span>↓</span></span>
        </>
      )}
    </main>
  )
}

export default Home
