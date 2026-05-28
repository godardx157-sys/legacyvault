// app/api/capsules/[id]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getCapsuleOwned(id: string, userId: string) {
  const capsule = await prisma.capsule.findUnique({
    where: { id },
    include: { recipients: true },
  })
  if (!capsule || capsule.userId !== userId) return null
  return capsule
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const capsule = await getCapsuleOwned(params.id, session.user.id)
  if (!capsule) return NextResponse.json({ error: 'Capsule introuvable' }, { status: 404 })
  return NextResponse.json({ capsule })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const capsule = await getCapsuleOwned(params.id, session.user.id)
  if (!capsule) return NextResponse.json({ error: 'Capsule introuvable' }, { status: 404 })
  if (capsule.status === 'DELIVERED') {
    return NextResponse.json({ error: 'Une capsule livrée ne peut pas être supprimée.' }, { status: 400 })
  }
  await prisma.capsule.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
