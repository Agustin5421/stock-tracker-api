'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { login, saveToken } from '@/lib/api'
import { authSchema, type AuthFormValues } from '@/lib/auth-schema'
import { navigate } from '@/lib/routing'
import { AuthShell } from '@/components/auth/auth-shell'

export function LoginView({
  onNavigateRegister,
  successMessage,
}: {
  onNavigateRegister: () => void
  successMessage?: string
}) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: AuthFormValues) {
    setApiError(null)
    setIsLoading(true)
    try {
      const { token } = await login({ email: values.email, password: values.password })
      saveToken(token)
      navigate('home')
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al iniciar sesion. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell>
      <div className="w-full max-w-sm space-y-4">
        {successMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-600" aria-hidden />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        <Card className="border-l-4 border-l-[#d4e64d]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">Iniciar sesion</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder a tu portfolio</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* API error */}
                {apiError && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
                    <p className="text-sm text-red-700">{apiError}</p>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                          />
                          <Input
                            type="email"
                            placeholder="tu@ejemplo.com"
                            autoComplete="email"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contrasena</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                          />
                          <Input
                            type="password"
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            autoComplete="current-password"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#d4e64d] text-[#2d2d2d] hover:bg-[#d4e64d]/90 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesion...' : 'Iniciar sesion'}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              ¿No tenes cuenta?{' '}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Crea una
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </AuthShell>
  )
}
