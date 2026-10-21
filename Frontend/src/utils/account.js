const ACCOUNT_STORAGE_KEY = 'zomato-account'

export const saveAccount = (account) => {
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account))
}

export const getAccount = () => {
  try {
    const account = window.localStorage.getItem(ACCOUNT_STORAGE_KEY)
    return account ? JSON.parse(account) : null
  } catch (error) {
    console.error('Could not read saved account:', error)
    return null
  }
}
