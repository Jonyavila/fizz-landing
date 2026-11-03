'use client'

import { useEffect, useMemo, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowDown, ArrowRight, Check, Menu, Plus, ShoppingBag, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

type Flavor = { id: string; name: string; note: string; color: string; accent: string; price: number; fruit: string; image: string }
type CartLine = Flavor & { quantity: number }

const flavors: Flavor[] = [
  { id: 'orange', name: 'Orange', note: 'sunny citrus / soft sparkle', color: '#ff6500', accent: '#ffd000', price: 3.5, fruit: 'ORANGE', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fanta-rdYPuVVzcilD5tfwZcXRLGvrjl5bIi.png' },
  { id: 'cola', name: 'Cola', note: 'deep fizz / classic rush', color: '#c81d35', accent: '#ffb08c', price: 3.5, fruit: 'COLA', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cocacola-uUTYjZLipWb9DawyYeWTMqIF3ahQle.png' },
  { id: 'pepsi', name: 'Blue Pop', note: 'electric berry / cool finish', color: '#0d78d7', accent: '#8be8ff', price: 3.75, fruit: 'BLUE', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pepsi-fhTpnDR61FdyUrGO5ftqKB36FRd1gW.png' },
  { id: 'lime', name: 'Lime Leaf', note: 'green zing / tropical lift', color: '#79b82a', accent: '#eaff94', price: 3.25, fruit: 'LIME', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leaf-Kg0po6hNGDFnap6clzITVYlaT3ubvp.webp' },
]

function ProductImage({ flavor, small = false }: { flavor: Flavor; small?: boolean }) {
  return <div className={`product-image ${small ? 'product-image-small' : ''}`} style={{ '--product-color': flavor.color } as React.CSSProperties}>
    <div className="product-halo" />
    <img src={flavor.image} alt={`${flavor.name} FIZZ can`} />
  </div>
}

export default function Page() {
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedFlavor, setSelectedFlavor] = useState(flavors[0])
  const [mix, setMix] = useState<string[]>([])
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const mixLabel = useMemo(() => mix.length ? mix.map((id) => flavors.find((flavor) => flavor.id === id)?.fruit).join(' + ') : 'Select your notes', [mix])

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 })
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    const cursor = document.querySelector('.cursor-dot') as HTMLElement | null
    const moveCursor = (event: MouseEvent) => { if (cursor) { cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px` } }
    window.addEventListener('mousemove', moveCursor)
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro.from('.hero-kicker, .hero-title span, .hero-copy > p:not(.hero-kicker), .hero-actions', { y: 34, stagger: 0.08, duration: 0.8 })
      .from('.hero-scene', { scale: 0.76, duration: 1.1 }, '-=0.55')
    gsap.to('.hero-product', { yPercent: 18, rotation: 2, scale: 0.94, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    gsap.to('.hero-orange', { rotation: 360, duration: 8, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
    gsap.to('.hero-orange', { yPercent: -28, scale: 1.08, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => gsap.from(element, { y: 38, duration: 0.8, scrollTrigger: { trigger: element, start: 'top 84%' } }))
    return () => { lenis.destroy(); window.removeEventListener('mousemove', moveCursor); intro.kill(); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()) }
  }, [])

  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2400); return () => window.clearTimeout(timer) }, [toast])

  function addToCart(flavor: Flavor) {
    setCart((current) => current.some((item) => item.id === flavor.id) ? current.map((item) => item.id === flavor.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...flavor, quantity: 1 }])
    setToast(`${flavor.name} added to your crate`); setCartOpen(true)
  }
  function updateCart(id: string, delta: number) { setCart((current) => current.flatMap((item) => item.id === id ? item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : [] : [item])) }

  return <main className="site-shell" id="top">
    <div className="cursor-dot" aria-hidden="true" />
    <header className="nav"><a className="wordmark" href="#top">FIZZ<span>.</span></a><nav className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'}><a href="#flavors" onClick={() => setMenuOpen(false)}>Flavors</a><a href="#signal" onClick={() => setMenuOpen(false)}>The signal</a><a href="#story" onClick={() => setMenuOpen(false)}>The vibe</a></nav><div className="nav-actions"><button className="icon-button mobile-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu"><Menu size={20} /></button><button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}><ShoppingBag size={18} /><span>Crate</span>{count > 0 && <b>{count}</b>}</button></div></header>

    <section className="hero"><div className="hero-grid" /><div className="hero-copy"><p className="hero-kicker">FIZZ CLUB / 001 <span>built for bright days</span></p><h1 className="hero-title"><span>OPEN</span><span className="title-accent">THE FIZZ.</span></h1><p>Turn the ordinary<br /><strong>all the way up.</strong></p><div className="hero-actions"><a className="button button-dark" href="#flavors">Explore the drop <ArrowRight size={17} /></a><button className="text-link" onClick={() => addToCart(flavors[0])}>Grab a can ↗</button></div></div><div className="hero-scene"><div className="scene-ring ring-a" /><div className="scene-ring ring-b" /><div className="scene-label">ORANGE / 00<span>4</span></div><div className="hero-product"><ProductImage flavor={flavors[0]} /></div><div className="scene-glow" aria-hidden="true" /></div><img className="hero-leaf" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coconoutleaf-8kXfWQw65JwWipowgBqhd5ZZA9UDtp.png" alt="Tropical palm leaf" /><img className="hero-orange" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orange2-AKuw0g5wERldvvnrPDwxV2IF2YxTC5.png" alt="Orange slice" /><div className="scroll-cue"><ArrowDown size={15} /> scroll to sip</div></section>

    <section className="signal-bar"><span>100% GOOD ENERGY</span><span>ZERO STALE VIBES</span><span>∞ BUBBLES PER SIP</span><span>DESIGNED TO POP</span></section>

    <section className="flavors-section" id="flavors"><div className="section-heading reveal"><div><p className="eyebrow">01 / THE DROP</p><h2>Choose your<br /><i>frequency.</i></h2></div><p className="section-intro">Four bright flavors.<br />One very good mood.</p></div><div className="flavor-rail">{flavors.map((flavor, index) => <article className={`flavor-card ${selectedFlavor.id === flavor.id ? 'flavor-card-active' : ''}`} key={flavor.id} style={{ '--card': flavor.color, '--accent': flavor.accent } as React.CSSProperties} onMouseEnter={() => setSelectedFlavor(flavor)}><div className="card-index">0{index + 1} / 04</div><ProductImage flavor={flavor} /><div className="flavor-info"><div><h3>{flavor.name}</h3><p>{flavor.note}</p></div><button className="add-button" onClick={() => addToCart(flavor)} aria-label={`Add ${flavor.name}`}><Plus size={18} /></button></div></article>)}</div></section>

    <section className="signal-section" id="signal"><div className="signal-copy reveal"><p className="eyebrow">02 / THE SIGNAL</p><h2>Find your<br /><i>bright side.</i></h2><p>Tap a flavor to tune the room. Every can has its own color, pulse, and little hit of chaos.</p><div className="signal-tabs" role="tablist" aria-label="Choose a flavor">{flavors.map((flavor) => <button key={flavor.id} className={selectedFlavor.id === flavor.id ? 'signal-tab signal-tab-active' : 'signal-tab'} onClick={() => setSelectedFlavor(flavor)} role="tab" aria-selected={selectedFlavor.id === flavor.id}><span style={{ background: flavor.color }} />{flavor.name}</button>)}</div><button className="button button-light" onClick={() => addToCart(selectedFlavor)}>Add {selectedFlavor.name} to crate <ArrowRight size={17} /></button></div><div className="signal-console" style={{ '--signal-color': selectedFlavor.color } as React.CSSProperties}><div className="console-top"><span>LIVE FLAVOR FEED</span><span>00{flavors.findIndex((flavor) => flavor.id === selectedFlavor.id) + 1} / 04</span></div><div className="signal-scanlines" /><div className="signal-orbit orbit-one" /><div className="signal-orbit orbit-two" /><div className="signal-can"><ProductImage flavor={selectedFlavor} /></div><div className="console-caption"><strong>{selectedFlavor.fruit}</strong><span>{selectedFlavor.note}</span></div></div></section>

    <section className="story-section" id="story"><div className="story-art reveal"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orange-ULv48kzuz3krgSjNHNBjKEJPFLyfbQ.webp" alt="Fresh oranges" /><span>FIZZ<br />YOUR<br />DAY</span></div><div className="story-copy reveal"><p className="eyebrow">03 / THE PHILOSOPHY</p><h2>Life&apos;s too short<br />for <i>flat.</i></h2><p>We make loud, bright drinks for the small moments that deserve a little more sparkle. Open one. Turn it up. Let the good stuff out.</p><a className="text-link" href="#footer">Join the bright side <ArrowRight size={16} /></a></div></section>

    <footer id="footer"><div className="footer-top"><a className="wordmark" href="#top">FIZZ<span>.</span></a><h2>Stay <i>fizzy.</i></h2><form onSubmit={(event) => { event.preventDefault(); setToast('You are on the fizz list') }}><label htmlFor="email">Fresh drops, no boring emails</label><div className="email-row"><input id="email" type="email" required placeholder="your@email.com" /><button aria-label="Subscribe"><ArrowRight /></button></div></form></div><div className="footer-bottom"><span>© 2026 FIZZ CLUB</span><div><a href="#story">Instagram</a><a href="#story">TikTok</a><a href="#story">Terms</a></div><span>Made for the bright side</span></div></footer>

    {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping crate" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow">YOUR CRATE</p><h2>Ready to fizz?</h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button></div>{cart.length === 0 ? <div className="empty-cart"><h3>Your crate is empty.</h3><p>Pick a flavor and let&apos;s fix that.</p><button className="button button-dark" onClick={() => { setCartOpen(false); document.getElementById('flavors')?.scrollIntoView({ behavior: 'smooth' }) }}>Shop flavors</button></div> : <><div className="cart-lines">{cart.map((item) => <div className="cart-line" key={item.id}><ProductImage flavor={item} small /><div><h3>{item.name}</h3><p>${item.price.toFixed(2)} / can</p><div className="quantity"><button onClick={() => updateCart(item.id, -1)} aria-label="Decrease quantity">−</button><span>{item.quantity}</span><button onClick={() => updateCart(item.id, 1)} aria-label="Increase quantity">+</button></div></div><button className="remove-line" onClick={() => updateCart(item.id, -item.quantity)} aria-label={`Remove ${item.name}`}><X size={15} /></button></div>)}</div><div className="drawer-total"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><button className="button button-dark checkout" onClick={() => setToast('Checkout is coming soon — stay thirsty')}>Checkout <ArrowRight size={17} /></button></>}</aside></div>}
  </main>
}
