import { NextResponse } from 'next/server'
import { getEventById } from '@/lib/ticketmaster'
import { RouteContext } from '@/types/route.types'

export async function GET(_: Request, { params }: RouteContext) {
    try {
        const event = await getEventById(params.id, { cache: 'no-store' })

        return NextResponse.json(event)
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : 'Não foi possível obter os detalhes do evento.'

        return NextResponse.json({ error: message }, { status: 500 })
    }
}