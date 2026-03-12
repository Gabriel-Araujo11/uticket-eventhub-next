import { NextResponse } from 'next/server'
import { getEvents } from '@/lib/ticketmaster'

function getParam(searchParams: URLSearchParams, key: string): string | undefined {
    return searchParams.get(key) ?? undefined
}

function getNumberParam(searchParams: URLSearchParams, key: string): number | undefined {
    const value = searchParams.get(key)
    if (!value) return undefined
    const parsedValue = Number(value)
    return Number.isNaN(parsedValue) ? undefined : parsedValue
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    try {
        const response = await getEvents(
            {
                city: getParam(searchParams, 'city'),
                sort: getParam(searchParams, 'sort'),
                page: getNumberParam(searchParams, 'page'),
                keyword: getParam(searchParams, 'keyword'),
                size: getNumberParam(searchParams, 'size'),
                endDateTime: getParam(searchParams, 'endDateTime'),
                segmentName: getParam(searchParams, 'SsegmentName'),
                startDateTime: getParam(searchParams, 'startDateTime'),
            },
            { cache: 'no-store' }
        )

        return NextResponse.json(response)
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Não foi possível obter os eventos do Ticketmaster.'

        return NextResponse.json({ error: message }, { status: 500 })
    }
}