import { NavLink } from 'react-router-dom'
import './ReelsNavigation.css'

const navigationItems = [
  {
    to: '/home',
    label: 'Home',
    icon: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  },
  {
    to: '/saved',
    label: 'Saved',
    icon: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  },
]

const ReelsNavigation = () => (
  <nav className="reels-navigation" aria-label="Main navigation">
    {navigationItems.map(({ to, label, icon }) => (
      <NavLink
        className={({ isActive }) => `reels-navigation-link${isActive ? ' is-active' : ''}`}
        end={to === '/home'}
        key={to}
        to={to}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {icon}
        </svg>
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
)

export default ReelsNavigation
