// app/api/checkin/settings/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({ intervalDays: z.number().min(30).max(730) })

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { intervalDays } = schema.parse(await req.json())

  await prisma.deadManSwitch.upsert({
    where: { userId: session.user.id },
    update: { intervalDays },
    create: { userId: session.user.id, intervalDays, lastCheckIn: new Date() },
  })

  return NextResponse.json({ success: true })
}
