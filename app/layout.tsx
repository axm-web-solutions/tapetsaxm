import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-montserrat', display: 'swap' })

export const metadata: Metadata = {
  title: 'AXM Tapetes | Diseños que dejan huella',
  description: 'Tapetes atrapamugres personalizados para empresas y hogares. Diseña el tuyo y recibe envíos a todo Colombia.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'AXM Tapetes | Diseños que dejan huella',
    description: 'Tapetes atrapamugres personalizados en fibra PVC. Envíos a todo Colombia.',
    images: ['/icon-512.png'],
    locale: 'es_CO',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#141316' },
    { media: '(prefers-color-scheme: dark)', color: '#141316' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
