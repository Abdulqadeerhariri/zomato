import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { getAccount } from '../utils/account'
import './SiteHeader.css'

const SiteHeader = ({ className = '', label = 'FOOD, YOUR WAY' }) => {
  const [account] = useState(getAccount)
  const accountName = account?.name || account?.email || 'My account'
  const initials = accountName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <header className={`site-header ${className}`.trim()}>
      <Link className="brand" to="/home" aria-label="Go to Zomato home">
        <span className="brand-mark" aria-hidden="true">z</span>
        <span>zomato</span>
      </Link>
      <nav className="site-header-actions" aria-label="Main navigation">
        <Link className="site-home-link" to="/home">Home</Link>
        {account && (
          <span className="site-account" title={account.email || accountName}>
            <span className="site-account-avatar" aria-hidden="true">{initials}</span>
            <span className="site-account-name">{accountName}</span>
          </span>
        )}
        {account?.role === 'foodPartner' && (
          <Link className="site-create-link" to="/food-partner/create">
            <span aria-hidden="true">＋</span> Create video
          </Link>
        )}
        {label && <span className="site-header-label">{label}</span>}
        <ThemeToggle />
      </nav>
    </header>
  )
}

export default SiteHeader
