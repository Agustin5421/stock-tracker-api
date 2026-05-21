# Frontend Mock Agent Guidelines

Guia reutilizable para crear pantallas mock modernas, profesionales, responsive y visualmente consistentes con el estilo del Portfolio Tracker de Kiwii.

---

## 1. Resumen del Estilo Visual

### Estetica General

El estilo visual del Portfolio Tracker es **financiero profesional con toques de marca sutiles**. La interfaz transmite confianza, claridad y precision - cualidades esenciales para aplicaciones que manejan datos financieros.

### Caracteristicas Principales

| Aspecto | Descripcion |
|---------|-------------|
| **Nivel de formalidad** | Alto - profesional pero accesible |
| **Tipo de producto** | Apps financieras, dashboards de datos, SaaS B2B |
| **Sensacion visual** | Limpio, organizado, confiable, moderno |
| **Grado de minimalismo** | Alto - sin elementos decorativos innecesarios |
| **Uso de color** | Restringido - colores funcionales predominan, marca como acento sutil |
| **Densidad de informacion** | Media-alta - mucha data bien organizada |

### Principios Reutilizables

1. **Jerarquia clara**: Cada seccion tiene un proposito obvio. Titulos, subtitulos y contenido tienen niveles visuales distintos.

2. **Color funcional**: Los colores comunican significado (verde = positivo, rojo = negativo, ambar = advertencia) antes que estetica.

3. **Espaciado generoso**: El "aire" entre elementos mejora la legibilidad y reduce la carga cognitiva.

4. **Consistencia absoluta**: Los mismos patrones se repiten en toda la interfaz. Un badge siempre luce igual, una card siempre tiene la misma estructura.

5. **Datos primero**: El diseno sirve a los datos, no al reves. La informacion es protagonista.

---

## 2. Design Tokens Inferidos

### Colores Principales

```css
/* Kiwii Brand */
--kiwii-green: #d4e64d;        /* Verde lima - acento principal de marca */
--kiwii-gold: #c38f42;         /* Dorado/marron - acento secundario */

/* Fondos */
--background: oklch(0.98 0.005 90);   /* Fondo principal - casi blanco cremoso */
--card: oklch(1 0 0);                  /* Fondo de cards - blanco puro */
--muted: oklch(0.95 0.01 90);          /* Fondo de elementos secundarios */

/* Texto */
--foreground: oklch(0.18 0.02 60);       /* Texto principal - gris muy oscuro */
--muted-foreground: oklch(0.5 0.02 60);  /* Texto secundario - gris medio */

/* Bordes */
--border: oklch(0.9 0.01 90);    /* Bordes sutiles - gris muy claro */
```

### Colores de Estado

```css
/* Positivo */
--success-bg: bg-green-50
--success-border: border-green-200
--success-text: text-green-600 / text-green-700

/* Negativo */
--error-bg: bg-red-50
--error-border: border-red-200  
--error-text: text-red-600 / text-red-700

/* Advertencia */
--warning-bg: bg-amber-50
--warning-border: border-amber-200
--warning-text: text-amber-600 / text-amber-700

/* Informativo */
--info-bg: bg-blue-50
--info-border: border-blue-200
--info-text: text-blue-600 / text-blue-700
```

### Bordes y Radios

```css
--radius: 0.5rem;              /* 8px - radio base */
--radius-sm: 0.25rem;          /* 4px - elementos pequenos */
--radius-lg: 0.5rem;           /* 8px - cards y contenedores */
--border-width: 1px;           /* Bordes siempre de 1px */
```

### Sombras

El proyecto usa **sombras minimas o nulas**. La separacion visual se logra mediante:
- Bordes sutiles (`border-border`)
- Cambios de fondo (`bg-muted/30`, `bg-muted/50`)
- Espaciado

### Espaciados (Escala Tailwind)

```
Micro:    gap-1, p-1         (4px)
Pequeno:  gap-2, p-2, py-2   (8px)
Base:     gap-3, p-3, py-3   (12px)
Medio:    gap-4, p-4, py-4   (16px)
Grande:   gap-6, p-6, py-6   (24px)
XL:       gap-8, space-y-8   (32px)
```

### Tipografia

```css
/* Font Family */
--font-sans: 'Geist', 'Geist Fallback';
--font-mono: 'Geist Mono', 'Geist Mono Fallback';

/* Tamanos usados */
text-xs:   0.75rem  (12px) - disclaimers, fechas, labels secundarios
text-sm:   0.875rem (14px) - cuerpo secundario, badges, botones
text-base: 1rem     (16px) - cuerpo principal
text-lg:   1.125rem (18px) - subtitulos, nombres destacados
text-xl:   1.25rem  (20px) - titulos de seccion
text-2xl:  1.5rem   (24px) - metricas grandes, valores destacados

/* Pesos */
font-medium:   500 - labels, texto enfatizado
font-semibold: 600 - titulos, valores importantes
font-bold:     700 - tickers, logos, elementos de marca
```

---

## 3. Sistema de Layout

### Estructura General de Pagina

```
┌──────────────────────────────────────────┐
│  HEADER (sticky, border-b)               │
├──────────────────────────────────────────┤
│  MAIN (max-w-7xl, mx-auto, px-4/6/8)     │
│  ┌────────────────────────────────────┐  │
│  │  Seccion 1 (space-y-4 interno)     │  │
│  ├────────────────────────────────────┤  │
│  │  Seccion 2                         │  │
│  ├────────────────────────────────────┤  │
│  │  Grid 2 columnas (lg:grid-cols-2)  │  │
│  │  ┌──────────┐  ┌──────────┐        │  │
│  │  │  Card A  │  │  Card B  │        │  │
│  │  └──────────┘  └──────────┘        │  │
│  ├────────────────────────────────────┤  │
│  │  Seccion N                         │  │
│  └────────────────────────────────────┘  │
│  (space-y-8 entre secciones)             │
├──────────────────────────────────────────┤
│  FOOTER (border-t)                       │
└──────────────────────────────────────────┘
```

### Clases de Layout Principales

```tsx
// Pagina completa
<div className="min-h-screen bg-background">

// Contenedor principal
<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

// Espaciado entre secciones
<div className="space-y-8">

// Grid responsivo 2 columnas
<div className="grid gap-6 lg:grid-cols-2">

// Grid responsivo 4 columnas (para summary cards)
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
```

### Anchos Maximos

| Contexto | Clase |
|----------|-------|
| Contenedor principal | `max-w-7xl` (1280px) |
| Modales/Sheets | `w-72` (288px) para mobile menu |
| Cards | Sin max-width (fluidas dentro del grid) |

### Separacion Entre Bloques

- Entre secciones principales: `space-y-8` (32px)
- Dentro de una seccion (titulo + contenido): `space-y-4` (16px)
- Entre items de lista: `space-y-3` (12px)
- Entre elementos de un grid: `gap-4` o `gap-6`

---

## 4. Patrones Responsive

### Breakpoints Utilizados

```
sm: 640px   - Tablets pequenas, mobiles landscape
md: 768px   - Tablets
lg: 1024px  - Desktop
```

### Que Cambia en Mobile

| Elemento | Desktop | Mobile |
|----------|---------|--------|
| Header nav | Botones visibles | Menu hamburguesa (Sheet) |
| Summary cards | 4 columnas | 2 columnas, luego 1 |
| Tables | Tabla completa | Cards apiladas |
| Grids 2-col | Lado a lado | Apiladas |
| Botones | Texto + icono | Solo icono o texto corto |
| Padding contenedor | `px-8` | `px-4` |

### Transformacion de Tablas a Cards

**Patron critico**: Las tablas de datos se ocultan en mobile y se reemplazan por cards.

```tsx
{/* Desktop: tabla */}
<Card className="hidden md:block">
  <Table>...</Table>
</Card>

{/* Mobile: cards */}
<div className="md:hidden">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>
```

### Estructura de Card Mobile

```tsx
<Card className="mb-3">
  <CardContent className="p-4">
    {/* Header: identificador + estado/valor principal */}
    <div className="flex items-start justify-between">
      <div>
        <span className="text-lg font-semibold">{ticker}</span>
        <Badge>...</Badge>
      </div>
      <ValorDestacado />
    </div>

    {/* Grid de datos: 2 columnas */}
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
      <DataPair label="Label" value="Value" />
      ...
    </div>

    {/* Acciones */}
    <div className="mt-4 flex gap-2">
      <Button className="flex-1">Accion 1</Button>
      <Button className="flex-1">Accion 2</Button>
    </div>
  </CardContent>
</Card>
```

### Reglas Responsive Concretas

1. **Botones**: Minimo 44x44px area tactil. Usar `size="sm"` con padding adecuado.

2. **Texto**: Nunca menor a `text-xs` (12px). Labels importantes en `text-sm`.

3. **Iconos en botones**: En mobile, preferir solo icono con sr-only text.

4. **Flex direction**: Usar `flex-col sm:flex-row` para elementos que deben apilarse.

5. **Espaciado**: `px-4 sm:px-6 lg:px-8` para padding horizontal de contenedores.

6. **Ocultar elementos**: Usar `hidden sm:inline` o `hidden md:block` para elementos secundarios.

### Evitar en Mobile

- Tablas con mas de 3 columnas
- Hover states como unica forma de interaccion
- Texto que requiera scroll horizontal
- Botones demasiado pequenos o juntos
- Multiples niveles de anidacion visual

---

## 5. Componentes Reutilizables

### 5.1 Header / Topbar

**Cuando usarlo**: Siempre. Es el ancla de navegacion y branding.

**Estructura**:
```tsx
<header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
  <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
    {/* Logo + Brand */}
    {/* Nav (hidden md:flex) */}
    {/* User menu + Mobile menu trigger */}
  </div>
</header>
```

**Variantes**:
- Con navegacion lateral (tabs)
- Con buscador central
- Simplificado (solo logo + accion)

### 5.2 Summary Cards (Metric Cards)

**Cuando usarlo**: Para mostrar KPIs, totales, metricas principales al inicio de un dashboard.

**Estructura**:
```tsx
<Card className="border-l-4 border-l-[#d4e64d]">
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Label
    </CardTitle>
    <Icon className="h-4 w-4 text-[#c38f42]" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-foreground">$12,345.67</div>
    <p className="mt-1 text-xs text-muted-foreground">Descripcion contextual</p>
  </CardContent>
</Card>
```

**Variantes**:
- Neutral: `border-l-[#d4e64d]` o `border-l-[#c38f42]`
- Positivo: `border-l-green-500`
- Negativo: `border-l-red-500`

### 5.3 Data Table

**Cuando usarlo**: Para listas de datos con multiples atributos que necesitan compararse.

**Estructura clave**:
```tsx
<Table>
  <TableHeader>
    <TableRow className="bg-muted/50">
      <TableHead>Columna</TableHead>
      <TableHead className="text-right">Valor</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-semibold">Texto principal</TableCell>
      <TableCell className="text-right">Valor alineado</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Reglas**:
- Valores numericos siempre `text-right`
- Header con `bg-muted/50`
- Primera columna (identificador) en `font-semibold`

### 5.4 Badges de Estado

**Cuando usarlo**: Para indicar estados, categorias, o tipos.

**Patron base**:
```tsx
<Badge variant="outline" className="gap-1 border-{color}-200 bg-{color}-50 text-{color}-700">
  <Icon className="h-3 w-3" />
  Texto
</Badge>
```

**Variantes de color**:
| Estado | Border | Background | Text |
|--------|--------|------------|------|
| Success | green-200 | green-50 | green-700 |
| Error | red-200 | red-50 | red-700 |
| Warning | amber-200 | amber-50 | amber-700 |
| Info | blue-200 | blue-50 | blue-700 |
| Neutral | border | muted | muted-foreground |
| Brand | [#d4e64d] | [#d4e64d]/10 | foreground |

### 5.5 List Items / Activity Feed

**Cuando usarlo**: Para historiales, listas de actividad, items de watchlist.

**Estructura**:
```tsx
<div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
  {/* Izquierda: icono + info principal */}
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card">
      <span className="text-sm font-bold">{codigo}</span>
    </div>
    <div>
      <div className="flex items-center gap-2">
        <Badge />
        <span className="font-medium">{titulo}</span>
      </div>
      <p className="text-xs text-muted-foreground">{subtitulo}</p>
    </div>
  </div>
  
  {/* Derecha: valor + estado */}
  <div className="flex items-center justify-between gap-3 sm:justify-end">
    <span className="font-semibold">{valor}</span>
    <Badge>{estado}</Badge>
  </div>
</div>
```

### 5.6 Info Boxes / Disclaimers

**Cuando usarlo**: Para mensajes contextuales, advertencias, informacion adicional.

**Estructura**:
```tsx
<div className="flex items-center gap-2 rounded-lg border border-[#d4e64d]/50 bg-[#d4e64d]/10 px-4 py-3">
  <Icon className="h-4 w-4 shrink-0 text-[#c38f42]" />
  <p className="text-sm text-foreground">{mensaje}</p>
</div>
```

**Variantes**:
- Informativo (Kiwii): `border-[#d4e64d]/50 bg-[#d4e64d]/10`
- Warning: `border-amber-200 bg-amber-50`
- Error: `border-red-200 bg-red-50`

### 5.7 Botones de Accion

**Patron principal**:
```tsx
{/* Accion primaria - usar color de marca */}
<Button className="bg-[#d4e64d] text-[#2d2d2d] hover:bg-[#d4e64d]/90">
  <Icon className="h-4 w-4" />
  Texto
</Button>

{/* Accion secundaria */}
<Button variant="outline" className="gap-1.5">
  <Icon className="h-4 w-4" />
  Texto
</Button>

{/* Accion destructiva */}
<Button variant="outline" className="text-destructive hover:text-destructive">
  <Trash2 className="h-4 w-4" />
</Button>
```

### 5.8 Gain/Loss Display

**Cuando usarlo**: Para mostrar cambios de valor con indicador visual de direccion.

```tsx
function GainLossDisplay({ value, percent }: { value: number; percent: number }) {
  const isPositive = value >= 0
  return (
    <div className="flex flex-col items-end">
      <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
      <span className={`flex items-center gap-0.5 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {isPositive ? '+' : ''}{percent.toFixed(2)}%
      </span>
    </div>
  )
}
```

---

## 6. Reglas para Dashboards Financieros/Mock

### Mostrar Metricas Importantes

1. **Jerarquia de tamano**: El valor mas importante va en `text-2xl font-bold`. Labels en `text-sm text-muted-foreground`.

2. **Contexto siempre**: Cada metrica debe tener una descripcion o label que explique que significa.

3. **Agrupacion logica**: Metricas relacionadas juntas. Summary cards al inicio.

### Ganancias y Perdidas

1. **Verde para positivo**: `text-green-600` con `+` explicito.
2. **Rojo para negativo**: `text-red-600` sin signo (el `-` es parte del numero).
3. **Iconos direccionales**: `TrendingUp` / `TrendingDown` de lucide-react.
4. **Mostrar absoluto Y porcentaje**: Ambos valores son importantes.

### Valores Positivos vs Negativos

```tsx
const isPositive = value >= 0
const colorClass = isPositive ? 'text-green-600' : 'text-red-600'
const prefix = isPositive ? '+' : ''
const Icon = isPositive ? TrendingUp : TrendingDown
```

### Fechas de Actualizacion

Siempre visible. Patrones:
```tsx
{/* Como badge */}
<Badge variant="outline" className="gap-1.5">
  <Clock className="h-3 w-3" />
  Ultima actualizacion: {fecha}
</Badge>

{/* Como texto secundario */}
<p className="text-xs text-muted-foreground">
  Actualizado: {fecha}
</p>
```

### Datos Mock sin Parecer Falso

1. **Datos realistas**: Usar valores de mercado reales o cercanos.
2. **Consistencia interna**: Si AAPL tiene 15 acciones a $189, el valor total debe ser exactamente $2,835.
3. **Fechas coherentes**: No usar fechas futuras. Mantener orden cronologico.
4. **Indicar estado mock sutilmente**: Un badge o disclaimer al final, no en cada elemento.

```tsx
<Badge variant="outline" className="gap-1 border-amber-200 bg-amber-50 text-amber-700">
  <AlertCircle className="h-3 w-3" />
  Datos mockeados
</Badge>
```

### Evitar Exceso de Color

- Maximo 2 colores de marca visibles simultaneamente
- Estados (verde/rojo/ambar) solo donde hay significado semantico
- Fondos neutros para 90% de la interfaz
- Color de marca como acento, no como protagonista

### Ordenar Informacion Densa

1. **Seccionado claro**: Cada bloque de datos en su propia card o seccion.
2. **Titulos descriptivos**: "Posiciones del Portfolio", no "Datos".
3. **Espaciado generoso**: `space-y-8` entre secciones.
4. **Progressive disclosure**: Informacion mas importante arriba, detalles abajo.

---

## 7. Reglas para Identidad Visual Kiwii

### Colores de Marca

```css
--kiwii-green: #d4e64d;  /* Verde lima vibrante */
--kiwii-gold: #c38f42;   /* Dorado/marron calido */
```

### Donde Aplicar Verde Kiwii (#d4e64d)

**SI**:
- Logo/branding en header
- Botones de accion principal (`bg-[#d4e64d] text-[#2d2d2d]`)
- Border-left de cards destacadas (`border-l-[#d4e64d]`)
- Fondos de info boxes (`bg-[#d4e64d]/10`)
- Badges de estado positivo de marca
- Fondos de iconos destacados (`bg-[#d4e64d]/20`)
- Barras de graficos principales

**NO**:
- Fondos grandes
- Texto corrido
- Bordes de tablas completas
- Multiples elementos simultaneos

### Donde Aplicar Dorado Kiwii (#c38f42)

**SI**:
- Iconos secundarios en cards (`text-[#c38f42]`)
- Fondos de avatares/iconos (`bg-[#c38f42]/20`)
- Bordes de cards secundarias (`border-l-[#c38f42]`)
- Barras secundarias en graficos
- Acentos sutiles

**NO**:
- Botones principales
- Texto importante
- Grandes superficies

### Uso Sutil

```tsx
{/* Correcto: verde como acento */}
<Card className="border-l-4 border-l-[#d4e64d]">

{/* Correcto: fondo sutil */}
<div className="bg-[#d4e64d]/10">

{/* Correcto: icono secundario */}
<Icon className="text-[#c38f42]" />

{/* INCORRECTO: demasiado color */}
<div className="bg-[#d4e64d] text-[#d4e64d]"> // NO
```

### Mantener Estetica Financiera

1. El 85% de la interfaz debe ser neutro (blancos, grises).
2. Kiwii colors son acentos, no protagonistas.
3. Los estados semanticos (verde/rojo ganancias) tienen prioridad sobre marca.
4. El profesionalismo viene de la estructura y tipografia, no del color.

---

## 8. Do / Don't

### DO (Buenas Practicas)

- Usar cards con buena separacion (`gap-4`, `space-y-4`)
- Priorizar jerarquia visual con tamanos de texto claros
- Mostrar estados de datos (actualizado, pendiente, error)
- Usar colores de acento con moderacion (max 10-15% de superficie)
- Convertir tablas en cards en mobile
- Incluir siempre `text-muted-foreground` para texto secundario
- Usar iconos de lucide-react consistentemente
- Indicar claramente que es un mock/prototipo
- Mantener datos mock realistas y coherentes
- Usar `font-semibold` para valores importantes
- Incluir indicadores de direccion para cambios (+/-, flechas)
- Usar badges para estados y categorias
- Alinear numeros a la derecha en tablas
- Incluir disclaimer de datos mock al final

### DON'T (Malas Practicas)

- No usar colores fuertes en toda la pantalla
- No depender de hover para acciones importantes
- No mostrar tablas comprimidas en mobile
- No inventar logica real si la pantalla es mock
- No mezclar estilos visuales inconsistentes
- No usar mas de 2 fonts
- No usar sombras grandes o gradientes
- No crear botones muy pequenos (< 44px tactil)
- No ocultar informacion critica detras de tooltips
- No usar emojis
- No usar bordes gruesos (> 1px)
- No centrar texto de datos tabulares
- No usar colores de marca para estados semanticos (verde/rojo)
- No omitir labels de metricas
- No usar `text-xs` para informacion importante

---

## 9. Prompt Base para el Futuro Agente

```markdown
# Rol

Eres un agente frontend especializado en crear pantallas mock para aplicaciones financieras con el estilo visual de Kiwii.

# Objetivo

Generar interfaces de usuario modernas, profesionales y responsive que muestren datos financieros mockeados de forma clara y atractiva.

# Stack Tecnico

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- lucide-react icons
- Recharts (si hay graficos)

# Restricciones

1. **Sin backend**: Todo es mock data definido en archivos .ts
2. **Sin APIs externas**: No fetch, no llamadas HTTP
3. **Sin autenticacion real**: UI solo, sin logica de auth
4. **Sin localStorage/estado persistente**: Estado local de React unicamente
5. **Datos realistas**: Valores de mercado coherentes y actuales

# Estilo Visual

- Paleta neutra con acentos Kiwii (#d4e64d verde, #c38f42 dorado)
- Minimalismo profesional - sin decoracion innecesaria
- Jerarquia clara con tipografia
- Espaciado generoso (space-y-8 entre secciones)
- Cards con border-l-4 para destacar
- Badges para estados
- Colores semanticos: verde positivo, rojo negativo, ambar advertencia

# Responsive

- Mobile-first
- Tablas se convierten en cards en mobile
- Navigation en Sheet para mobile
- Minimo 44px area tactil para botones
- No depender de hover

# Identidad Kiwii

- Logo: Cuadrado verde (#d4e64d) con letra "K"
- Verde kiwii: solo como acento (botones principales, borders, fondos sutiles al 10%)
- Dorado kiwii: iconos secundarios, fondos de avatares
- Nunca saturar de color - 85% interfaz neutra

# Mock Data

- Definir tipos TypeScript para los datos
- Crear archivo lib/mock-data.ts con exports
- Valores realistas y coherentes
- Fechas no futuras
- Indicar sutilmente que son datos mock

# Que Entregar

1. Componentes React funcionales
2. Mock data en archivo separado
3. Responsive completo (mobile y desktop)
4. Accesibilidad basica (alt, aria-labels, sr-only)
5. Codigo limpio y comentado donde sea necesario

# Que Evitar

- Gradientes y sombras grandes
- Mas de 2 fonts
- Colores fuera de la paleta
- Logica de negocio compleja
- Dependencias adicionales innecesarias
- Emojis
- Placeholder images (usar fondos de color si es necesario)
```

---

## 10. Checklist de Validacion

### Estructura y Layout

- [ ] Pagina tiene header sticky con branding
- [ ] Contenido centrado con max-w-7xl
- [ ] Secciones separadas con space-y-8
- [ ] Cards usadas para agrupar informacion relacionada
- [ ] Footer presente con disclaimer de mock

### Desktop

- [ ] Grids de 2-4 columnas funcionan correctamente
- [ ] Tablas muestran todas las columnas
- [ ] Navegacion horizontal visible
- [ ] Espaciado correcto en todos los elementos

### Mobile (< 768px)

- [ ] Navegacion se convierte en menu hamburguesa
- [ ] Tablas se convierten en cards apiladas
- [ ] Botones tienen area tactil de 44px+
- [ ] No hay scroll horizontal
- [ ] Texto legible sin zoom
- [ ] Grids se apilan en una columna

### Datos Mock

- [ ] Valores son realistas y coherentes
- [ ] Calculos internos son correctos (total = precio * cantidad)
- [ ] Fechas son pasadas o presentes, no futuras
- [ ] Hay indicador de que son datos mock
- [ ] Tipos TypeScript definidos para los datos

### Jerarquia Visual

- [ ] Metricas principales en text-2xl font-bold
- [ ] Labels en text-sm text-muted-foreground
- [ ] Titulos de seccion en text-xl font-semibold
- [ ] Texto secundario en text-muted-foreground

### Colores

- [ ] Kiwii green usado como acento (< 15% superficie)
- [ ] Kiwii gold usado para iconos secundarios
- [ ] Verde para valores positivos
- [ ] Rojo para valores negativos
- [ ] Ambar para advertencias
- [ ] 85%+ de la interfaz es neutra

### Componentes

- [ ] Badges consistentes (outline + color de fondo sutil)
- [ ] Botones primarios con bg-[#d4e64d]
- [ ] Iconos de lucide-react
- [ ] Cards de shadcn/ui

### Accesibilidad

- [ ] Todos los botones tienen texto o aria-label
- [ ] Iconos decorativos tienen aria-hidden
- [ ] Contraste de color adecuado
- [ ] sr-only text para elementos que lo necesiten
- [ ] Links y botones distinguibles

### Codigo

- [ ] Sin console.log de debug
- [ ] Sin TODO comments
- [ ] Sin llamadas a APIs externas
- [ ] Sin localStorage
- [ ] Componentes separados en archivos propios
- [ ] Mock data en lib/mock-data.ts

---

*Documento generado para el proyecto Portfolio Tracker de Kiwii*
*Version: 1.0*
*Fecha: Mayo 2024*
