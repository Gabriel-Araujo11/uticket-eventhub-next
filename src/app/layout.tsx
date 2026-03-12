import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EventHub',
  description: 'Sistema de gerenciamento de eventos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}