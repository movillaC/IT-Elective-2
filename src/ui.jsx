import { useState } from 'react'
import placeholder from './assets/placeholder.png'
import { photoUrl } from './images.js'
import { useStore, set, toast, close, modal, signOut } from './store.js'
export const go = (to) => () => { location.hash = to }
// Shows the Unsplash photo mapped in images.js; falls back to the checkerboard placeholder if it can't load.
export function Photo({ name, className = '', style, ...rest }) {
  const [src, setSrc] = useState(photoUrl(name.replace(/\.\w+$/, '')) || placeholder)
  return (
    <div className={`photo ${className}`} style={style} {...rest}>
      <img src={src} alt="" loading="lazy" onError={() => src !== placeholder && setSrc(placeholder)} />
    </div>
  )
}
export const Btn = ({ children, solid, to, onClick, className = '' }) => (
  <button className={`btn ${solid ? 'solid' : ''} ${className}`} onClick={onClick || (to ? go(to) : undefined)}>{children}</button>
)
export const Toggle = ({ on, onChange }) => <button className={`tg ${on ? 'on' : ''}`} onClick={() => onChange(!on)}><i /></button>
export const join = () => { toast('Welcome to CUPChurts Rewards!'); location.hash = 'settings' }
export const Modal = ({ title, children }) => (
  <div className="overlay" onClick={close}><div className="modal" onClick={(e) => e.stopPropagation()}><div className="sec"><h2>{title}</h2><a onClick={close} style={{ fontSize: 18 }}>✕</a></div>{children}</div></div>
)
const links = [['home', 'Home', '⌂'], ['order', 'Menu', '☕'], ['order', 'Order Now', '🛍'], ['settings', 'Rewards', '★'], ['stores', 'Locations', '⌖']]
export function Shell({ active, title, sub, children }) {
  const { q, cart } = useStore()
  const n = Object.values(cart).reduce((a, b) => a + b, 0)
  return (
    <div className="app">
      <aside className="side">
        <div className="brand" onClick={go('landing')} style={{ cursor: 'pointer' }}><b>CUPChurts</b><small>Brewed bold.</small></div>
        {links.map(([to, label, ic]) => (
          <a key={label} className={label === active ? 'on' : ''} onClick={go(to)}><span>{ic}</span>{label}{label === 'Order Now' && n > 0 && <em className="cnt">{n}</em>}</a>
        ))}
        <a onClick={signOut}><span>⎋</span>Log out</a>
        <div className="promo"><Photo name="cup-small.png" className="mini" /><p>Enjoy exclusive perks and rewards!</p><Btn onClick={join}>Join Rewards</Btn></div>
      </aside>
      <section className="main">
        <header className="top">
          <div><h1>{title}</h1><p>{sub}</p></div>
          <input className="search" placeholder="Search coffee, blends, and more…" value={q} onChange={(e) => set({ q: e.target.value, cat: 'All Drinks' })} onKeyDown={(e) => e.key === 'Enter' && go('order')()} />
          <Photo name="avatar.png" className="avatar" onClick={go('settings')} style={{ cursor: 'pointer' }} />
        </header>
        {children}
      </section>
    </div>
  )
}
export const Banner = ({ title, text, cta, img, to, onClick }) => (
  <div className="banner"><div><h3>{title}</h3><p>{text}</p>{cta && <Btn solid to={to} onClick={onClick}>{cta}</Btn>}</div>{img && <Photo name={img} className="bimg" />}</div>
)
export { modal, toast }

const P = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path d="M3 3l18 18" /></>,
  check: <path d="M5 12l5 5 9-10" />,
  cup: <><path d="M5 9h12v5a5 5 0 01-5 5h-2a5 5 0 01-5-5V9z" /><path d="M17 10h2a2 2 0 010 4h-2" /><path d="M9 3c0 1.5 1 1.5 1 3M13 3c0 1.5 1 1.5 1 3" /></>,
}
export const Icon = ({ n, size = 16 }) => <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>
export const GoogleLogo = () => <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.5v2.9h3.9c2.3-2.1 3.5-5.2 3.5-8.6z" /><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-2.9c-1.1.7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3C3.3 21.4 7.3 24 12 24z" /><path fill="#FBBC05" d="M5.3 14.4c-.2-.7-.4-1.4-.4-2.4s.2-1.7.4-2.4v-3H1.3C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l4-3z" /><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.6 1.3 6.6l4 3c.9-2.9 3.6-4.8 6.7-4.8z" /></svg>
export const FacebookLogo = () => <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1877F2" /><path fill="#fff" d="M16.7 15.5l.5-3.5h-3.4V9.8c0-1 .5-1.9 2-1.9h1.5V4.9s-1.4-.2-2.7-.2c-2.8 0-4.6 1.7-4.6 4.8V12H6.9v3.5H10V24h3.8v-8.5z" /></svg>
