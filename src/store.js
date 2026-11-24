import { useSyncExternalStore } from 'react'
// Demo auth: accounts live in this browser's localStorage (no server). Swap for a real backend before launch.
const ls = { get(k) { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } } }
const ss = { get(k) { try { return JSON.parse(sessionStorage.getItem(k)) } catch { return null } }, set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)) } catch { /* unavailable */ } } }
let users = ls.get('cc_users') || {}
const saveUsers = () => ls.set('cc_users', users)
const seed = { Cappuccino: 1, 'Iced Latte': 1, 'Caramel Macchiato': 1 } // sample items so the order screen matches the Figma
const sess = ls.get('cc_session') || ss.get('cc_session')
const startUser = sess && users[sess] ? users[sess] : null
let state = { user: startUser, cart: startUser ? { ...seed } : {}, q: '', cat: 'All Drinks', toast: '', modal: null, order: null }
const subs = new Set()
export const set = (p) => { state = { ...state, ...(typeof p === 'function' ? p(state) : p) }; subs.forEach((f) => f()) }
export const useStore = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => state)
let t
export const toast = (m) => { set({ toast: m }); clearTimeout(t); t = setTimeout(() => set({ toast: '' }), 2600) }
export const add = (n) => { set((s) => ({ cart: { ...s.cart, [n]: (s.cart[n] || 0) + 1 } })); toast(`${n} added to your order`) }
export const chg = (n, d) => set((s) => { const q = (s.cart[n] || 0) + d; const c = { ...s.cart }; if (q > 0) c[n] = q; else delete c[n]; return { cart: c } })
export const modal = (el) => set({ modal: el })
export const close = () => set({ modal: null })

const hash = async (s) => {
  try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('cupchurts:' + s)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('') } catch { return btoa(unescape(encodeURIComponent(s))) }
}
const today = () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
const norm = (e) => e.trim().toLowerCase()
const login = (email, remember = true) => { (remember ? ls : ss).set('cc_session', email); set({ user: users[email], cart: { ...seed }, order: null }); return null }
export const signUp = async (name, email, pw) => {
  email = norm(email)
  if (users[email]) return 'An account with this email already exists — please sign in'
  users[email] = { name: name.trim(), email, pw: await hash(pw), joined: today(), phone: '', orders: [] }
  saveUsers(); return login(email)
}
export const signIn = async (email, pw, remember = true) => {
  email = norm(email); const u = users[email]
  if (!u) return 'No account found with that email — sign up first'
  if (u.pw !== (await hash(pw))) return 'Incorrect password'
  return login(email, remember)
}
export const socialLogin = (provider) => {
  const email = `${provider.toLowerCase()}.user@demo.cupchurts`
  if (!users[email]) { users[email] = { name: `${provider} User`, email, pw: '', joined: today(), phone: '', orders: [] }; saveUsers() }
  login(email)
}
export const resetPw = async (email, pw) => {
  email = norm(email)
  if (!users[email]) return 'No account found with that email'
  users[email].pw = await hash(pw); saveUsers(); return null
}
export const updateUser = (patch) => { const u = { ...users[state.user.email], ...patch }; users[u.email] = u; saveUsers(); set({ user: u }) }
export const signOut = () => { ls.set('cc_session', null); ss.set('cc_session', null); location.hash = 'landing'; set({ user: null, cart: {}, order: null, q: '', cat: 'All Drinks', modal: null }); toast('You’ve been logged out') }

export const menu = [
  ['Cappuccino', 'Espresso with steamed milk and a velvety foam.', 130, 'Hot Coffee', 'cappuccino'],
  ['Iced Latte', 'Smooth espresso over cold milk and ice.', 150, 'Iced Coffee', 'iced-latte'],
  ['Americano', 'Bold espresso with hot water.', 120, 'Hot Coffee', 'americano'],
  ['Caramel Macchiato', 'Rich espresso with vanilla and caramel.', 170, 'Specialty', 'caramel-macchiato'],
  ['Café Mocha', 'Espresso, chocolate and steamed milk.', 170, 'Specialty', 'cafe-mocha'],
  ['Matcha Latte', 'Ceremonial matcha with steamed milk.', 160, 'Non-Coffee', 'matcha'],
  ['Hot Chocolate', 'Rich cocoa with steamed milk.', 140, 'Non-Coffee', 'hot-chocolate'],
  ['Butter Croissant', 'Flaky and freshly baked.', 90, 'Add-ons', 'croissant'],
  ['Banana Bread', 'Moist, house-baked slice.', 80, 'Add-ons', 'banana-bread'],
]
export const info = (n) => menu.find((m) => m[0] === n)
export const totals = (cart) => { const sub = Object.entries(cart).reduce((a, [n, q]) => a + info(n)[2] * q, 0); const del = sub ? 40 : 0; return { sub, del, total: sub + del } }
