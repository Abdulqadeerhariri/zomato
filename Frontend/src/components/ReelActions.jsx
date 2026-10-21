const ReelActions = ({ food, liked, saved, onLike, onComment, onSave }) => (
  <div className="reel-actions" aria-label={`Actions for ${food.name}`}>
    <button
      className={`reel-action-button${liked ? ' is-liked' : ''}`}
      type="button"
      aria-label={`${liked ? 'Unlike' : 'Like'} video, ${food.likeCount || 0} likes`}
      aria-pressed={liked}
      onClick={onLike}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 8.7c0 4.2-8.8 10-8.8 10s-8.8-5.8-8.8-10a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z" />
      </svg>
      <span>{food.likeCount || 0}</span>
    </button>
    <button
      className="reel-action-button"
      type="button"
      aria-label={`Open comments, ${food.commentCount || 0} comments`}
      onClick={onComment}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 11.5a8 8 0 0 1-8 8 8.7 8.7 0 0 1-3.5-.7L4 20l1.2-3.4A8 8 0 1 1 20 11.5Z" />
      </svg>
      <span>{food.commentCount || 0}</span>
    </button>
    <button
      className={`reel-action-button${saved ? ' is-saved' : ''}`}
      type="button"
      aria-label={`${saved ? 'Remove from saved' : 'Save video'}, ${food.saveCount || 0} saves`}
      aria-pressed={saved}
      onClick={onSave}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3.5h12v17l-6-4-6 4z" />
      </svg>
      <span>{food.saveCount || 0}</span>
    </button>
  </div>
)

export default ReelActions
