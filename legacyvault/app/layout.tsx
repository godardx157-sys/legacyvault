// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'LegacyVault — Capsules Temporelles Numériques',
  description: 'Créez des messages, vidéos et souvenirs à transmettre à vos proches à la date de votre choix, ou après votre décès. Votre héritage, préservé.',
  keywords: 'capsule temporelle, héritage numérique, message posthume, testament numérique',
  openGraph: {
    title: 'LegacyVault',
    description: 'Transmettez votre héritage à travers le temps',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
