import { useState, useEffect } from 'react'

// ── GLOBAL SHARED STORE ───────────────────────────────────────
// Lives outside React — all roles share the same data
// When Saif adds an order, Super Admin sees it immediately
const G = {
  products:    [],
  tasks:       [],
  orders:      [],
  payments:    [],
  ads:         [],
  expenses:    [],
  salaries:    [],
  activityLog: [],
}

const listeners = new Set()
const notify = () => listeners.forEach(fn => fn())

const make = key => val => {
  G[key] = typeof val === 'function' ? val(G[key]) : val
  notify()
}

export const global_actions = {
  setProducts:    make('products'),
  setTasks:       make('tasks'),
  setOrders:      make('orders'),
  setPayments:    make('payments'),
  setAds:         make('ads'),
  setExpenses:    make('expenses'),
  setSalaries:    make('salaries'),
  setActivityLog: make('activityLog'),
}

export function useStore() {
  const [user,   setUser]   = useState(() => {
    try { const s = sessionStorage.getItem('mbm_user'); return s ? JSON.parse(s) : null } catch { return null }
  })
  const [lang,   setLang]   = useState('en')
  const [tab,    setTab]    = useState('dashboard')
  const [tick,   setTick]   = useState(0)

  // Subscribe to global store changes
  useEffect(() => {
    const fn = () => setTick(n => n + 1)
    listeners.add(fn)
    return () => listeners.delete(fn)
  }, [])

  // Persist user session across refresh
  useEffect(() => {
    if (user) sessionStorage.setItem('mbm_user', JSON.stringify(user))
    else sessionStorage.removeItem('mbm_user')
  }, [user])

  // Apply RTL for Arabic
  useEffect(() => {
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  return {
    user, setUser,
    lang, setLang,
    tab,  setTab,
    // Shared data — same for every logged-in user
    products:    G.products,
    tasks:       G.tasks,
    orders:      G.orders,
    payments:    G.payments,
    ads:         G.ads,
    expenses:    G.expenses,
    salaries:    G.salaries,
    activityLog: G.activityLog,
    ...global_actions,
  }
}
