# 🚀 Guía de Configuración — Wedding Gallery App

## 1. Configurar Supabase

### Crear el proyecto
1. Ve a [supabase.com](https://supabase.com) → New Project
2. Anota tu **Project URL** y **anon key** (Settings → API)

### Crear la base de datos
1. Ve a **SQL Editor** en tu proyecto de Supabase
2. Copia y pega el contenido de `supabase/setup.sql` y ejecuta

### Crear el bucket de Storage
1. Ve a **Storage** → **New bucket**
2. Nombre: `wedding-gallery`
3. Marca la casilla **Public bucket** ✅
4. Crea el bucket

---

## 2. Configurar variables de entorno

Copia `.env.local.example` a `.env.local` y rellena:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU-ANON-KEY
```

---

## 3. Correr la app localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 4. Desplegar en Vercel

1. Sube el repositorio a GitHub
2. Ve a [vercel.com](https://vercel.com) → Import Project
3. Agrega las variables de entorno en el panel de Vercel
4. ¡Deploy! Vercel te da una URL para el QR

---

## Arquitectura Rápida

```
📱 Invitado escanea QR
        ↓
🌐 Next.js App (Vercel)
        ↓
🗜️ browser-image-compression (~300KB)
        ↓
☁️ Supabase Storage (wedding-gallery bucket)
        ↓
🗄️ Supabase DB (photos table)
        ↓
📡 Realtime → todos ven la foto en vivo
```
