import { useState } from 'react'
import { Link } from 'react-router-dom'
import ReelsNavigation from '../../components/ReelsNavigation'
import SiteHeader from '../../components/SiteHeader'
import { getAccount } from '../../utils/account'
import '../../auth.css'
import './Library.css'

const AccountProfile = () => {
  const [account] = useState(getAccount)
  const displayName = account?.name || account?.email || 'Your profile'
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  return (
    <main className="library-page">
      <SiteHeader className="library-header" label="YOUR PROFILE" />
      <ReelsNavigation />
      <section className="profile-content" aria-labelledby="profile-title">
        <p className="library-eyebrow">YOUR ACCOUNT</p>
        {account ? (
          <>
            <div className="profile-avatar" aria-hidden="true">{initials}</div>
            <h1 id="profile-title">{displayName}</h1>
            <p className="profile-email">{account.email}</p>
            <span className="profile-role">{account.role === 'foodPartner' ? 'Food partner' : 'Food lover'}</span>
            <div className="profile-links">
              <Link to="/saved">View saved videos <span aria-hidden="true">↗</span></Link>
              {account.role === 'foodPartner' && (
                <Link to="/food-partner/create">Create a food video <span aria-hidden="true">↗</span></Link>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 id="profile-title">Sign in to your profile</h1>
            <p className="library-intro">Your saved food videos and account details will be here.</p>
            <Link className="library-home-button" to="/login">Sign in</Link>
          </>
        )}
      </section>
    </main>
  )
}

export default AccountProfile
