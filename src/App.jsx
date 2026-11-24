import { useEffect, useState } from 'react'
import { Landing, SignUp, SignIn, Dashboard, Order, Progress, Stores, Settings } from './screens.jsx'
import { useStore, toast, set } from './store.js'
const routes = { landing: Landing, signin: SignIn, signup: SignUp, home: Dashboard, order: Order, progress: Progress, stores: Stores, settings: Settings }
const open = ['landing', 'signin', 'signup']
const read = () => (location.hash.slice(1) in routes ? location.hash.slice(1) : 'landing')
export default function App() {
  const [, force] = useState(0)
  const { toast: msg, modal, user } = useStore()
  useEffect(() => { const f = () => { set({ toast: '' }); force((n) => n + 1); scrollTo(0, 0) }; addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  const r = read() // read fresh each render: signOut changes the hash before the user, so there is no redirect race
  // route guard: app pages need a signed-in user; sign-in/up pages bounce signed-in users to the dashboard
  const page = !user && !open.includes(r) ? 'signin' : user && (r === 'signin' || r === 'signup') ? 'home' : r
  useEffect(() => { if (page !== r) { location.hash = page; if (!user) toast('Please sign in to continue') } }, [page, r, user])
  const Page = routes[page]
  return <><Page />{modal}{msg && <div className="toast">{msg}</div>}</>
}
