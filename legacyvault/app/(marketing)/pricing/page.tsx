// app/(marketing)/pricing/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PLANS } from '@/lib/stripe'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    { key: 'FREE', ...PLANS.FREE },
    { key: 'PRO', ...PLANS.PRO },
    { key: 'ETERNAL', ...PLANS.ETERNAL },
  ] as const

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-paper)' }}>
      <nav className="border-b border-vault-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏺</span>
            <span className="font-display text-xl text-vault-800">LegacyVault</span>
          </Link>
          <Link href="/login" className="text-vault-600 hover:text-vault-800 transition-colors text-base">Connexion</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="font-display text-6xl text-vault-900 mb-4">Tarifs simples & honnêtes</h1>
          <p className="text-vault-500 text-lg mb-8">Commencez gratuitement. Payez si vous avez besoin de plus.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl border border-vault-200 bg-white/60">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${!annual ? 'text-white shadow' : 'text-vault-500'}`}
              style={!annual ? { background: 'var(--gold)' } : {}}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${annual ? 'text-white shadow' : 'text-vault-500'}`}
              style={annual ? { background: 'var(--gold)' } : {}}
            >
              Annuel <span className="ml-1 text-xs opacity-80">-17%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(plan => {
            const price = annual && plan.price > 0 ? Math.round(plan.price * 10 / 12) : plan.price
            const isHighlighted = plan.key === 'PRO'

            return (
              <div
                key={plan.key}
                className={`paper-card rounded-2xl p-8 flex flex-col ${isHighlighted ? 'border-2 border-gold-400 relative' : ''}`}
              >
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-medium" style={{ background: 'var(--gold)' }}>
                    ✨ Populaire
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-2xl text-vault-800 mb-1">{plan.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="font-display text-5xl text-vault-900">{price === 0 ? 'Gratuit' : `${price}€`}</span>
                    {price > 0 && <span className="text-vault-400 mb-1">/mois</span>}
                  </div>
                  {annual && price > 0 && (
                    <p className="text-vault-400 text-xs mt-1">Facturé {Math.round(price * 12)}€/an</p>
                  )}
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-vault-600 text-sm">
                      <Check size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.price === 0 ? '/register' : `/register?plan=${plan.key}`}
                  className={`w-full py-3 rounded-xl text-center text-sm font-medium transition-all ${isHighlighted ? 'text-white hover:opacity-90' : 'border border-vault-300 text-vault-700 hover:bg-vault-50'}`}
                  style={isHighlighted ? { background: 'var(--gold)' } : {}}
                >
                  {plan.price === 0 ? 'Commencer gratuitement' : 'Choisir ce plan'}
                </Link>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="font-display text-4xl text-vault-800 text-center mb-10">Questions fréquentes</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              { q: 'Mes données sont-elles sécurisées ?', a: 'Oui. Vos messages peuvent être chiffrés côté serveur. Nous utilisons Cloudinary pour le stockage des médias, sécurisé par SSL.' },
              { q: 'Que se passe-t-il si je résilie ?', a: 'Vos capsules déjà scellées seront livrées normalement. Vous ne pourrez plus en créer de nouvelles au-delà des limites du plan gratuit.' },
              { q: 'Le Dead Man\'s Switch est-il fiable ?', a: 'Notre système vérifie quotidiennement les switches en attente via un cron job. Des rappels vous sont envoyés 30, 14 et 7 jours avant le déclenchement.' },
              { q: 'Puis-je modifier une capsule après l\'avoir scellée ?', a: 'Non. Une capsule scellée est figée dans le temps, ce qui garantit l\'authenticité du message. Vous pouvez la supprimer et en recréer une.' },
            ].map(({ q, a }) => (
              <div key={q} className="paper-card rounded-xl p-6">
                <h4 className="font-display text-lg text-vault-800 mb-2">{q}</h4>
                <p className="text-vault-600 text-base leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
