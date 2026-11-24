import { useEffect, useState } from 'react'
import { Photo, Btn, Shell, Banner, Toggle, Modal, Icon, GoogleLogo, FacebookLogo, go, join } from './ui.jsx'
import { credits } from './images.js'
import { useStore, set, toast, add, chg, modal, close, menu, info, totals, signUp, signIn, signOut, socialLogin, resetPw, updateUser } from './store.js'

const peso = (n) => `₱${n}`
const first = (u) => u.name.split(' ')[0]
const greet = (u) => `${new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}, ${first(u)}!`
const Story = () => <Modal title="Our Story"><p style={{ lineHeight: 1.7, color: '#5a4636' }}>CUPChurts began with a simple idea: coffee should be slow, honest and local. We source beans from Filipino farms, roast in small batches, and deliver them fresh to your door. (Sample copy — replace with your brand story.)</p></Modal>
const Message = () => {
  const [m, setM] = useState({ name: '', email: '', msg: '' })
  const send = () => { if (!m.msg.trim()) return toast('Please write a message first'); close(); toast('Message sent — we’ll get back to you soon') }
  return <Modal title="Send us a message">{['name', 'email'].map((k) => <label className="lbl" key={k}>{k === 'name' ? 'Your name' : 'Email'}<input value={m[k]} onChange={(e) => setM({ ...m, [k]: e.target.value })} /></label>)}<label className="lbl">Message<textarea rows="4" value={m.msg} onChange={(e) => setM({ ...m, msg: e.target.value })} /></label><Btn solid onClick={send} className="full">Send message</Btn></Modal>
}
const Rate = () => {
  const [s, setS] = useState(0)
  return <Modal title="Rate your delivery"><div className="stars">{[1, 2, 3, 4, 5].map((i) => <span key={i} className={i <= s ? 'on' : ''} onClick={() => setS(i)}>★</span>)}</div><Btn solid className="full" onClick={() => { if (!s) return toast('Tap a star to rate'); close(); toast(`Thanks for rating us ${s}/5!`) }}>Submit rating</Btn></Modal>
}
const Credits = () => <Modal title="Photo credits"><p className="mut">Photos from Unsplash, by:</p><div className="credits">{credits.map((c) => <a key={c[2]} href={`https://unsplash.com/@${c[2]}?utm_source=cupchurts&utm_medium=referral`} target="_blank" rel="noopener noreferrer">{c[1]}</a>)}</div><a className="mut" href="https://unsplash.com/?utm_source=cupchurts&utm_medium=referral" target="_blank" rel="noopener noreferrer">unsplash.com</a></Modal>
const Rewards = () => <Modal title="Rewards Dashboard"><p><b>1,250 pts</b> · Gold Member</p><div className="bar"><i style={{ width: '62%' }} /></div><p className="mut">750 more points to reach Platinum.</p><Btn solid className="full" onClick={() => { close(); location.hash = 'order' }}>Earn more — order now</Btn></Modal>

export const Landing = () => { const { user } = useStore(); return (
  <div className="dark">
    <nav className="nav"><span className="brand" onClick={go('landing')}>CUPChurts</span><a onClick={go('order')}>Coffee</a><a onClick={go('order')}>Menu</a><a onClick={() => modal(<Story />)}>Our Story</a><a onClick={go('stores')}>Locations</a><a onClick={() => toast('Blog is coming soon')}>Blog</a><span className="sp" />{user ? <><a onClick={go('home')}>Hi, {first(user)}</a><a onClick={signOut}>Log out</a></> : <><a onClick={go('signup')}>Sign Up</a><a onClick={go('signin')}>Sign In</a></>}<Btn to="order">Order Now</Btn></nav>
    <div className="hero">
      <div><h1>Brewed bold.<em>Made for slow mornings.</em></h1><p>Specialty coffee, ethically sourced from local farms and roasted to bring out every complex note.</p>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}><Btn to="order">Explore our coffee ›</Btn><a style={{ fontSize: 12, fontWeight: 600, cursor: 'pointer' }} onClick={() => modal(<Story />)}>Our story ›</a></div></div>
      <Photo name="hero-coffee.png" className="cup" />
    </div>
    <div className="perks">{[['Freshly roasted', 'Roasted in small batches'], ['Locally sourced', 'From Filipino coffee farms'], ['Delivered fresh', 'Straight through your doors'], ['Community favorites', 'Loved by our customers']].map(([a, b]) => <div className="perk" key={a}><b>{a}</b><small>{b}</small></div>)}</div>
    <div className="disc"><h2>Discover our coffee</h2><a style={{ color: '#c19266', fontSize: 12, cursor: 'pointer' }} onClick={go('order')}>View all products ›</a></div>
    <div className="prods">{[['Whole Bean', 'For the perfect fresh grind'], ['Ground Coffee', 'Ready to brew, anytime'], ['Drip Coffee', 'Convenient, always satisfying'], ['Bundles', 'Curated sets for every coffee lover']].map(([p, d], i) => <div className="prod" key={p} onClick={go('order')} style={{ cursor: 'pointer' }}><Photo name={`product-${i + 1}.png`} /><b>{p}</b><small>{d}</small><small style={{ color: '#ce9361', marginTop: 8 }}>Shop now ›</small></div>)}</div>
    <p className="credit"><a onClick={() => modal(<Credits />)}>Photo credits · Unsplash</a></p>
  </div>
)}

const Forgot = () => {
  const [e, setE] = useState(''); const [p, setP] = useState('')
  const run = async () => { if (p.length < 8) return toast('New password must be at least 8 characters'); const err = await resetPw(e, p); if (err) return toast(err); close(); toast('Password updated — you can sign in now') }
  return <Modal title="Reset password"><label className="lbl">Email<input value={e} onChange={(x) => setE(x.target.value)} /></label><label className="lbl">New password<input type="password" value={p} onChange={(x) => setP(x.target.value)} /></label><Btn solid className="full" onClick={run}>Update password</Btn></Modal>
}
const Auth = ({ mode }) => {
  const up = mode === 'signup'
  const [f, setF] = useState({ name: '', email: '', pw: '', pw2: '' })
  const [eye, setEye] = useState(false); const [busy, setBusy] = useState(false); const [remember, setRemember] = useState(true)
  const rules = [['At least 8 characters', f.pw.length >= 8], ['One uppercase letter', /[A-Z]/.test(f.pw)], ['One number', /\d/.test(f.pw)]]
  const submit = async () => {
    if (busy) return
    if (up && !f.name.trim()) return toast('Please enter your full name')
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return toast('Please enter a valid email address')
    if (up && rules.some((r) => !r[1])) return toast('Your password doesn’t meet all the requirements')
    if (up && f.pw !== f.pw2) return toast('Passwords don’t match')
    if (!up && !f.pw) return toast('Please enter your password')
    setBusy(true)
    const err = up ? await signUp(f.name, f.email, f.pw) : await signIn(f.email, f.pw, remember)
    setBusy(false)
    if (err) return toast(err)
    toast(up ? 'Account created — welcome!' : 'Welcome back!'); location.hash = 'home'
  }
  const fields = up
    ? [['name', 'Full Name', 'user', 'Enter your full name'], ['email', 'Email Address', 'mail', 'Enter your email address'], ['pw', 'Password', 'lock', 'Create a password'], ['pw2', 'Confirm Password', 'lock', 'Confirm your password']]
    : [['email', 'Email Address', 'mail', 'Enter your email address'], ['pw', 'Password', 'lock', 'Enter your password']]
  return (
    <div className="dark auth"><nav className="nav" style={{ marginBottom: 6 }}><span className="brand" onClick={go('landing')}>CUPChurts</span><span className="sp" /><a onClick={go('landing')}>← Back to home</a></nav>
      <div className="hero" style={{ paddingTop: 20 }}>
        <div><h1>Brewed bold.<em>Made for slow mornings.</em></h1>
          <p>{up ? 'Create an account to unlock exclusive rewards, faster checkout and a richer coffee experience.' : 'Sign in to reorder your favorites, track your orders and keep earning rewards with every cup.'}</p>
          <div style={{ position: 'relative' }}><Photo name="hero-coffee.png" className="cup" /><div className="badge"><b>{up ? 'Good coffee. Great days.' : 'Welcome back!'}</b><small>{up ? 'Let’s get started.' : 'Your favorite brew is waiting.'}</small></div></div></div>
        <div className="form"><div className="logo"><Icon n="cup" size={22} /></div><h2>{up ? 'Create your account' : 'Welcome back'}</h2><p className="sub">{up ? <>Join the <b style={{ color: '#9b673d' }}>CUPChurts</b> community today.</> : <>Sign in to your <b style={{ color: '#9b673d' }}>CUPChurts</b> account.</>}</p>
          {fields.map(([k, l, ic, ph]) => (
            <label key={k}>{l}<span className="inp"><span className="lead"><Icon n={ic} /></span>
              <input type={k.startsWith('pw') && !eye ? 'password' : k === 'email' ? 'email' : 'text'} value={f[k]} placeholder={ph} autoComplete={k === 'email' ? 'email' : k === 'pw' ? (up ? 'new-password' : 'current-password') : 'off'} onChange={(e) => setF({ ...f, [k]: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && submit()} />
              {k.startsWith('pw') && <a className="eye" role="button" aria-label={eye ? 'Hide password' : 'Show password'} onClick={() => setEye(!eye)}><Icon n={eye ? 'eyeOff' : 'eye'} /></a>}</span></label>
          ))}
          {up ? <div className="rules"><b>Password must contain:</b>{rules.map(([t, ok]) => <div key={t} className={ok ? 'ok' : ''}><span className="tick"><Icon n="check" size={9} /></span>{t}</div>)}</div>
            : <div className="opts"><label className="chk"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />Remember me</label><a onClick={() => modal(<Forgot />)}>Forgot password?</a></div>}
          <Btn solid onClick={submit}>{busy ? 'Please wait…' : up ? 'Create Account' : 'Sign In'}</Btn><div className="or">or {up ? 'sign up' : 'sign in'} with</div>
          <div className="two"><Btn className="soc" onClick={() => { socialLogin('Google'); toast('Signed in with Google (demo)') }}><GoogleLogo />Continue with Google</Btn><Btn className="soc" onClick={() => { socialLogin('Facebook'); toast('Signed in with Facebook (demo)') }}><FacebookLogo />Continue with Facebook</Btn></div>
          <div className="or">{up ? 'Already have an account?' : 'Don’t have an account?'} <a className="sw" onClick={go(up ? 'signin' : 'signup')}>{up ? 'Sign in' : 'Sign up'}</a></div></div>
      </div></div>
  )
}
export const SignUp = () => <Auth mode="signup" />
export const SignIn = () => <Auth mode="signin" />

const Pick = ({ d }) => <div className="pick"><Photo name={`${d[4]}.png`} /><div><b>{d[0]}</b><small>{d[1]}</small><span className="pr">{peso(d[2])}<button className="add" onClick={() => add(d[0])}>+</button></span></div></div>

export const Dashboard = () => { const { user } = useStore(); return (
  <Shell active="Home" title={greet(user)} sub="What are we brewing for you today?">
    <div className="heroBanner"><div><h2>Brewed bold.<em>Made for slow mornings.</em></h2><p>Specialty coffee, ethically sourced from local farms.</p><Btn to="order">Explore our coffee ›</Btn></div><Photo name="hero-coffee.png" /></div>
    <div className="sec"><h2>Popular Picks</h2><a onClick={go('order')}>View all menu ›</a></div>
    <div className="picks">{menu.slice(0, 5).map((d) => <Pick key={d[0]} d={d} />)}</div>
    <div className="banners"><Banner title="Join our Rewards Program" text="Earn points with every cup and unlock perks." cta="Join Now" onClick={join} /><Banner title="Fast & Fresh Delivery" text="We deliver your favorites, fresh to your door." cta="Order Now ›" to="order" img="bags.png" /></div>
  </Shell>
)}

export const Order = () => {
  const { cart, q, cat, user } = useStore()
  const [note, setNote] = useState('')
  const list = menu.filter((m) => (cat === 'All Drinks' ? m[3] !== 'Add-ons' : m[3] === cat) && m[0].toLowerCase().includes(q.toLowerCase()))
  const items = Object.entries(cart)
  const t = totals(cart)
  const checkout = () => {
    if (!items.length) return toast('Your order is empty — add something first')
    const id = `CUP${Math.floor(100000 + Math.random() * 899999)}`; set({ order: { items: cart, ...t, id, note }, cart: {} }); updateUser({ orders: [{ id, items: cart, total: t.total, date: new Date().toLocaleDateString() }, ...(user.orders || [])] }); location.hash = 'progress'
  }
  return (
    <Shell active="Order Now" title="Order Your Favorites" sub="Choose your menu and enjoy freshly brewed coffee.">
      <div className="split"><div className="panel"><h2>Menu</h2>
        <div className="chips">{['All Drinks', 'Hot Coffee', 'Iced Coffee', 'Specialty', 'Non-Coffee', 'Add-ons'].map((c) => <span key={c} className={`chip ${c === cat ? 'on' : ''}`} onClick={() => set({ cat: c })}>{c}</span>)}</div>
        {list.length ? list.map((d) => <div className="item" key={d[0]}><Photo name={`${d[4]}.png`} /><div><b>{d[0]}</b><small>{d[1]}</small></div><b>{peso(d[2])}</b><button className="add" onClick={() => add(d[0])}>+</button></div>) : <p className="mut" style={{ padding: 20 }}>No items match “{q}”.</p>}
        <Banner title="Make it a combo!" text="Add a pastry and save more." cta="Browse bake shop ›" img="croissant.png" onClick={() => set({ cat: 'Add-ons', q: '' })} /></div>
      <div className="card"><div className="row"><b>Your Order ({items.reduce((a, [, n]) => a + n, 0)})</b><small style={{ cursor: 'pointer' }} onClick={() => set({ cart: {} })}>Clear all</small></div>
        {items.length ? items.map(([n, qn]) => <div className="item" key={n}><Photo name={`${info(n)[4]}.png`} /><div><b>{n}</b><small>{peso(info(n)[2] * qn)}</small></div><span className="qty"><button onClick={() => chg(n, -1)}>−</button>{qn}<button onClick={() => chg(n, 1)}>+</button></span></div>) : <p className="mut" style={{ padding: '16px 0' }}>Your order is empty.</p>}
        <input className="note" placeholder="Add a note for your order (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="row"><span>Subtotal</span><span>{peso(t.sub)}</span></div><div className="row"><span>Delivery fee</span><span>{peso(t.del)}</span></div><div className="row"><span>Discount</span><span>₱0</span></div>
        <div className="row total"><span>Total</span><span>{peso(t.total)}</span></div><div className="note">You’ll earn {Math.floor(t.total / 10)} points with this order</div>
        <Btn solid onClick={checkout}>Proceed to Checkout</Btn><Btn to="home">Continue Shopping</Btn></div></div>
      <div className="help">{['Fresh & Fast Delivery', 'Quality You Can Taste', 'Brewed with Care', 'Secure Checkout'].map((x) => <div className="card" key={x}><b>{x}</b></div>)}</div>
    </Shell>
  )
}

export const Progress = () => {
  const { order } = useStore()
  const o = order || { items: { Cappuccino: 1, 'Iced Latte': 1, 'Caramel Macchiato': 1 }, sub: 450, del: 40, total: 490, id: 'CUP458729' }
  const [step, setStep] = useState(1)
  useEffect(() => { const i = setInterval(() => setStep((s) => Math.min(s + 1, 3)), 6000); return () => clearInterval(i) }, [])
  const steps = ['Order Confirmed', 'Preparing Your Order', 'Out for Delivery', 'Delivered']
  return (
    <Shell active="Order Now" title="Order Progress" sub="Track your order in real-time from kitchen to doorstep.">
      <div className="panel"><div className="sec"><div><h2>Order #{o.id}</h2><small style={{ color: '#a68a78' }}>Placed on {o.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {step === 3 ? 'Delivered — enjoy!' : 'Updates automatically'}</small></div><Btn onClick={() => toast('Support will contact you shortly')}>Need help? Contact support</Btn></div>
        <div className="steps">{steps.map((s, i) => <div key={s} className={`step ${i <= step ? 'done' : ''}`}><i /><b>{s}</b><small>{i < step ? 'Done' : i === step ? 'In progress' : '—'}</small></div>)}</div></div>
      <div className="split"><div style={{ display: 'grid', gap: 16 }}>
        <div className="card"><h3>Order Items</h3>{Object.entries(o.items).map(([n, qn]) => <div className="item" key={n}><Photo name={`${info(n)[4]}.png`} /><div><b>{n}</b><small>Regular · Hot · Qty {qn}</small></div><b>{peso(info(n)[2] * qn)}</b></div>)}</div>
        <div className="card"><div className="sec"><h3>Delivery Information</h3><a style={{ cursor: 'pointer' }} onClick={() => toast('Address changes aren’t available once an order is placed')}>Change</a></div><div className="g2" style={{ marginTop: 10 }}><div className="fld"><small>Delivery Address</small><div>Sample address, Metro Manila</div></div><div className="fld"><small>Estimated Delivery</small><div>Today, 30–45 min</div></div></div></div></div>
        <div style={{ display: 'grid', gap: 16 }}><div className="card"><h3>Order Summary</h3><div className="row"><span>Subtotal</span><span>{peso(o.sub)}</span></div><div className="row"><span>Delivery</span><span>{peso(o.del)}</span></div><div className="row total"><span>Total</span><span>{peso(o.total)}</span></div><div className="note" style={{ cursor: 'pointer' }} onClick={() => toast('Payment method updated')}>Payment Method · Change</div></div>
        <div className="card"><h3>Need Help?</h3>{[['View Policy', 'Opening our order policy…'], ['Contact Support', 'Support will contact you shortly'], ['Report Order Changes', 'Change request sent']].map(([t, m]) => <div className="row link" key={t} onClick={() => toast(m)}><span>{t}</span><span>›</span></div>)}</div></div></div>
      <Banner title="Love our delivery?" text="Rate your experience and help us brew better." cta="Rate Now ›" img="bags.png" onClick={() => modal(<Rate />)} />
    </Shell>
  )
}

const stores = [['Kapitolyo Café', 20, 30], ['BGC Corner', 55, 22], ['Makati Central', 70, 55], ['Quezon City Hub', 40, 65]]
export const Stores = () => {
  const [sel, setSel] = useState(0)
  return (
    <Shell active="Locations" title="Whereabouts" sub="Find us, reach out, and we’d love to hear from you.">
      <div className="panel" style={{ background: '#f1e4d6' }}><div className="g2"><div><h2>Get in touch</h2><p style={{ color: '#7a5b44', margin: '8px 0 12px' }}>Have a question or suggestion? We’d love to hear from you.</p><Btn solid onClick={() => modal(<Message />)}>Send us a message ›</Btn></div><Photo name="cup-contact.png" style={{ height: 120 }} /></div>
        <div className="help" style={{ marginTop: 14 }}>{[['Email', 'hello@cupchurts.ph', 'mailto:hello@cupchurts.ph'], ['Phone', '+63 900 000 0000', 'tel:+639000000000'], ['Hours', 'Mon–Sun · 7 AM – 10 PM'], ['Follow Us', 'Instagram · Facebook']].map(([a, b, h]) => <div key={a}><b style={{ fontSize: 12 }}>{a}</b>{h ? <a href={h} style={{ display: 'block', color: '#7a5b44', fontSize: 12, marginTop: 2 }}>{b}</a> : <small style={{ display: 'block', color: '#7a5b44', marginTop: 2 }}>{b}</small>}</div>)}</div></div>
      <div className="split stretch sp-stores">
        <div className="card"><h3>Our Stores</h3>{stores.map(([s], i) => <div className={`item sel ${i === sel ? 'on' : ''}`} key={s} onClick={() => setSel(i)}><Photo name={`store-${i + 1}.png`} /><div><b>{s}</b><small>Open · Closes 10 PM</small></div><span>›</span></div>)}</div>
        <div className="card photo map" style={{ position: 'relative', padding: 0, overflow: 'hidden' }}><div className="mapbg" />
          {stores.map(([s, x, y], i) => <span className={`pin ${i === sel ? 'on' : ''}`} key={s} onClick={() => setSel(i)} style={{ left: `${x}%`, top: `${y}%` }} />)}
          <div className="pop"><b>{stores[sel][0]}</b><small>Open · Closes 10 PM</small><a style={{ cursor: 'pointer' }} onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(stores[sel][0] + ' Metro Manila')}`, '_blank', 'noopener')}>Get Directions ›</a></div></div></div>
      <div className="help">{[['Need more help?', 'Visit Help Center', 'Opening the Help Center…'], ['FAQs', 'Find answers fast', 'FAQs are coming soon'], ['Order Support', 'Get support', 'Support will contact you shortly'], ['Feedback', 'Tell us more', null]].map(([a, b, m]) => <div className="card link" key={a} onClick={() => (m ? toast(m) : modal(<Message />))}><b>{a}</b><small>{b}</small></div>)}</div>
    </Shell>
  )
}

const tabs = { Account: ['Email notifications', 'Marketing emails', 'Show profile publicly'], Addresses: ['Home — Metro Manila', 'Office — BGC'], 'Payment Methods': ['Cash on delivery', 'GCash', 'Credit / debit card'], 'Order History': ['Cappuccino + Iced Latte', 'Caramel Macchiato', 'Café Mocha'], Notifications: ['Order updates', 'Rewards & offers', 'New menu items'], Security: ['Two-factor authentication', 'Login alerts'], 'Help & Support': ['Live chat', 'Email support'] }
export const Settings = () => {
  const [tab, setTab] = useState('Profile')
  const { user } = useStore()
  const [p, setP] = useState({ 'Full Name': user.name, 'Email Address': user.email, 'Phone Number': user.phone || '', 'Date Joined': user.joined })
  const [drink, setDrink] = useState('Cappuccino'); const [roast, setRoast] = useState('Medium Roast'); const [tfa, setTfa] = useState(true)
  const [tg, setTg] = useState({})
  const cyc = (arr, v) => arr[(arr.indexOf(v) + 1) % arr.length]
  const profile = <>
    <div className="card"><h3>Profile Information</h3><div style={{ display: 'flex', gap: 16, marginTop: 12 }}><Photo name="avatar.png" style={{ width: 84, height: 84, borderRadius: '50%', flex: 'none', cursor: 'pointer' }} onClick={() => toast('Photo upload is coming soon')} />
      <div className="g2" style={{ flex: 1 }}>{Object.keys(p).map((k) => <div className="fld" key={k}><small>{k}</small><input value={p[k]} readOnly={k === 'Date Joined' || k === 'Email Address'} placeholder={k === 'Phone Number' ? 'Add your phone number' : ''} onChange={(e) => setP({ ...p, [k]: e.target.value })} /></div>)}</div></div><Btn solid className="fit" onClick={() => { if (!p['Full Name'].trim()) return toast('Name can’t be empty'); updateUser({ name: p['Full Name'].trim(), phone: p['Phone Number'] }); toast('Profile saved') }}>Save Changes</Btn></div>
    <div className="card"><h3>Preferences</h3><div className="row link" onClick={() => setDrink(cyc(menu.slice(0, 5).map((m) => m[0]), drink))}><span>Favorite Drink</span><span>{drink} ›</span></div><div className="row link" onClick={() => setRoast(cyc(['Light Roast', 'Medium Roast', 'Dark Roast'], roast))}><span>Preferred Roast</span><span>{roast} ›</span></div></div>
    <div className="g2"><div className="card"><h3>Rewards Summary</h3><div className="row"><b>1,250 pts</b><b>Gold Member</b></div><Btn onClick={() => modal(<Rewards />)}>View Rewards Dashboard</Btn></div>
      <div className="card"><h3>Account Overview</h3><div className="row link" onClick={() => toast('Password reset link sent to your email')}><span>Password</span><span>Change ›</span></div><div className="row"><span>Two-Factor Authentication</span><Toggle on={tfa} onChange={setTfa} /></div><div className="row link" onClick={signOut}><span>Log Out</span><span>›</span></div></div></div></>
  const hist = (user.orders || []).map((o) => [`#${o.id} · ${Object.entries(o.items).map(([n, q]) => `${n} ×${q}`).join(', ')} · ₱${o.total}`, Object.keys(o.items)])
  const rows = tab === 'Order History' ? (hist.length ? hist : [['No orders yet — your past orders will show up here', []]]) : (tabs[tab] || []).map((r) => [r, [r.split(' + ')[0]]])
  const other = <div className="card"><h3>{tab}</h3>{rows.map(([r, its]) => <div className="row" key={r} style={{ padding: '10px 0', gap: 10 }}><span>{r}</span>{tab === 'Order History' ? (its.length ? <Btn onClick={() => { its.forEach((n) => add(n)); location.hash = 'order' }}>Reorder</Btn> : null) : <Toggle on={tg[r] ?? true} onChange={(v) => setTg({ ...tg, [r]: v })} />}</div>)}</div>
  return (
    <Shell active="Rewards" title="Settings" sub="Manage your profile, preferences, and account.">
      <div className="split sp-set">
        <div className="card sub2">{['Profile', ...Object.keys(tabs)].map((t) => <a key={t} className={t === tab ? 'on' : ''} onClick={() => setTab(t)}>{t}</a>)}</div>
        <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>{tab === 'Profile' ? profile : other}</div></div>
      <Banner title="Spread the love!" text="Refer a friend and you’ll both get ₱50 off." cta="Invite Friends ›" img="bags.png" onClick={() => { navigator.clipboard?.writeText('https://cupchurts.ph/invite/CUSTOMER50').catch(() => {}); toast('Invite link copied!') }} />
    </Shell>
  )
}
