'use client'

import { useState } from 'react'

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false)
  const [showJoke, setShowJoke] = useState(false)

  function continueToWebsite() {
    setShowJoke(true)
    window.setTimeout(() => setIsOpen(true), 900)
  }

  if (isOpen) {
    return (
      <main className="min-h-screen bg-[#090b10] text-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" />
            <span className="text-sm font-semibold tracking-[0.28em] text-white/80 uppercase">solara</span>
          </div>
          <span className="text-xs tracking-[0.2em] text-white/40 uppercase">Welcome in</span>
        </nav>
        <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl flex-col justify-center px-6 pb-20 lg:px-10">
          <p className="mb-6 text-sm font-medium tracking-[0.3em] text-cyan-300 uppercase">The website is open</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-balance sm:text-7xl lg:text-8xl">
            Make room for brighter ideas.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
            Solara is a calm place for curious people, thoughtful work, and whatever comes next.
          </p>
          <div className="mt-12 flex flex-wrap gap-3">
            <button className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-[#071014] transition hover:bg-cyan-200">
              Explore Solara
            </button>
            <button className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/75 transition hover:border-white/30 hover:text-white">
              Learn more
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090b10] px-6 text-center text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative flex max-w-md flex-col items-center">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-cyan-950/40">
          <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(103,232,249,0.9)]" />
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Sorry, the website is closed</h1>
        <p className="mt-4 text-sm text-white/45">(Pls press continue)</p>
        <button
          type="button"
          onClick={continueToWebsite}
          className="mt-9 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#090b10] transition hover:scale-[1.03] hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-4 focus:ring-offset-[#090b10]"
        >
          Continue
        </button>
        <p className={`mt-5 h-5 text-sm font-medium text-cyan-300 transition-opacity duration-300 ${showJoke ? 'opacity-100' : 'opacity-0'}`} aria-live="polite">
          jk
        </p>
      </div>
    </main>
  )
}
