import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sneaker Lab + BotShield', description: 'Sneaker release assistant and bot-defense lab' }

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>
}
