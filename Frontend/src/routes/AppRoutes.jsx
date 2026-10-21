import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import FoodPartnerLoginPage from '../pages/auth/FoodPartnerLoginPage'
import FoodPartnerRegisterPage from '../pages/auth/FoodPartnerRegisterPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import { ThemeProvider } from '../components/ThemeProvider'
import Home from '../pages/general/Home'
import Saved from '../pages/general/Saved'
import AccountProfile from '../pages/general/AccountProfile'
import FoodPartner from '../pages/FoodPartner/FoodPartner'
import Profile from '../pages/FoodPartner/Profile'
import CreateFood from '../pages/FoodPartner/CreateFood'

const AppRoutes = () => {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/food-partner/register" element={<FoodPartnerRegisterPage />} />
          <Route path="/food-partner/login" element={<FoodPartnerLoginPage />} />
          <Route path="/food-partner/create" element={<CreateFood />} />
          <Route path="/home" element={<Home />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile" element={<AccountProfile />} />
          <Route path="/food-partner" element={<FoodPartner />} />
          <Route path="/food-partner/:profile" element={<Profile />} />
        </Routes>

      </ThemeProvider>
    </Router>
  )
}

export default AppRoutes
