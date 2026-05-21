import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Ingresa un email valido'),
  password: z.string().min(1, 'La contrasena es obligatoria'),
})

export type AuthFormValues = z.infer<typeof authSchema>
