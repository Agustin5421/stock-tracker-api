'use client'

import { useEffect, useState } from 'react'

import { getToken } from '@/lib/api'
import { navigate, type Route } from '@/lib/routing'
import { LoginView } from '@/components/auth/login-view'
import { RegisterView } from '@/components/auth/register-view'
import { HomeView } from '@/components/home/home-view'

export default function RootPage() {
  const [route, setRoute] = useState<Route>('login')
  const [successMessage, setSuccessMessage] = useState<string | undefined>()

  // Read initial hash and listen for changes
  useEffect(() => {
    function syncRoute() {
      const hash = window.location.hash

      // Detect post-registration redirect: #/login?registered=1
      if (hash.startsWith('#/login')) {
        if (hash.includes('registered=1')) {
          setSuccessMessage('Cuenta creada exitosamente. Ya podes iniciar sesion.')
          // Clean up the flag without triggering another hashchange
          window.history.replaceState(null, '', '#/login')
        } else {
          setSuccessMessage(undefined)
        }
        setRoute('login')
        return
      }

      if (hash === '#/register') {
        setSuccessMessage(undefined)
        setRoute('register')
        return
      }

      if (hash === '#/home') {
        // Guard: redirect to login if no token
        if (!getToken()) {
          navigate('login')
          return
        }
        setRoute('home')
        return
      }

      // Default: go to login (or home if already authenticated)
      if (getToken()) {
        navigate('home')
      } else {
        setRoute('login')
      }
    }

    syncRoute()
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  if (route === 'home') {
    return <HomeView />
  }

  if (route === 'register') {
    return <RegisterView onNavigateLogin={() => navigate('login')} />
  }

  return (
    <LoginView onNavigateRegister={() => navigate('register')} successMessage={successMessage} />
  )
}
