// app/(dashboard)/dashboard/capsules/[id]/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DeleteCapsuleButton } from '@/components/capsule/DeleteCapsuleButton'

export default async function CapsuleDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const capsule = await prisma.capsule.findUnique({
    where: { id: params.id },
    include: { recipients: true },
  })
  if (!capsule || capsule.userId !== session?.user.id) notFound()

  const statusConfig = {
    DRAFT:     { label: 'Brouillon', color: 'text-vault-600 bg-vault-100 border-vault-200' },
    SEALED:    { label: 'Scellée', color: 'text-gold-700 bg-gold-50 border-gold-300' },
    DELIVERED: { label: 'Livrée', color: 'text-green-700 bg-green-50 border-green-300' },
    FAILED:    { label: 'Échec', color: 'text-red-700 bg-red-50 border-red-300' },
  }
  const sc = statusConfig[capsule.status]

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/capsules" className="text-vault-500 hover:text-vault-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <span className={`text-xs px-3 py-1 rounded-full border ${sc.color}`}>{sc.label}</span>
      </div>

      <div className="paper-card rounded-2xl p-8 space-y-6">
        <div>
          <h2 className="font-display text-3xl text-vault-900 mb-2">{capsule.title}</h2>
          <p className="text-vault-400 text-sm">Créée le {formatDate(capsule.createdAt)}</p>
        </div>

        {/* Message */}
        <div className="p-6 rounded-xl border border-vault-200 bg-white/50">
          <p className="text-vault-700 leading-relaxed whitespace-pre-wrap">{capsule.message}</p>
        </div>

        {/* Media */}
        {capsule.mediaUrls.length > 0 && (
          <div>
            <p className="text-vault-600 text-sm font-medium mb-3">📎 Médias attachés ({capsule.mediaUrls.length})</p>
            <div className="grid grid-cols-3 gap-2">
              {capsule.mediaUrls.map((url, i) => (
                url.match(/\.(jpg|jpeg|png|gif|webp)/i)
                  ? <img key={i} src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
                  : <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-24 bg-vault-100 rounded-lg text-vault-500 text-xs hover:bg-vault-200 transition-colors">📄 Fichier</a>
              ))}
            </div>
          </div>
        )}

        {/* Trigger */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl border border-vault-200 bg-white/40">
            <p className="text-vault-400 text-xs mb-1">Déclencheur</p>
            <p className="text-vault-700 font-medium">
              {capsule.triggerType === 'DEADMAN' ? '⚙️ Dead Man\'s Switch' : '📅 Date programmée'}
            </p>
            {capsule.deliverAt && <p className="text-vault-500 text-xs mt-0.5">{formatDate(capsule.deliverAt)}</p>}
          </div>
          <div className="p-4 rounded-xl border border-vault-200 bg-white/40">
            <p className="text-vault-400 text-xs mb-1">Sécurité</p>
            <p className="text-vault-700 font-medium">{capsule.isEncrypted ? '🔒 Chiffrée' : '🔓 Non chiffrée'}</p>
          </div>
        </div>

        {/* Recipients */}
        <div>
          <p className="text-vault-600 text-sm font-medium mb-3">👥 Destinataires ({capsule.recipients.length})</p>
          <div className="space-y-2">
            {capsule.recipients.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-vault-200 bg-white/40">
                <div>
                  <p className="text-vault-800 text-sm font-medium">{r.name}</p>
                  <p className="text-vault-400 text-xs">{r.email}{r.relation ? ` · ${r.relation}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {capsule.status !== 'DELIVERED' && (
          <div className="pt-2 border-t border-vault-200">
            <DeleteCapsuleButton capsuleId={capsule.id} />
          </div>
        )}
      </div>
    </div>
  )
}
