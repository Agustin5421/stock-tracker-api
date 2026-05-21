export type Route = 'login' | 'register' | 'home'

export function getRoute(): Route {
  if (typeof window === 'undefined') return 'login'
  const hash = window.location.hash.replace('#/', '')
  if (hash === 'register') return 'register'
  if (hash === 'home') return 'home'
  return 'login'
}

export function navigate(route: Route): void {
  window.location.hash = `/${route}`
}
