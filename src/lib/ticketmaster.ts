import 'server-only'

import type {
    TicketmasterEvent,
    TicketmasterEventsResponse,
    TicketmasterVenue,
    TicketmasterImage,
} from '@/types/event.types'
import type { GetEventsParams, RawParams, TicketmasterFetchOptions } from '@/types/ticketmaster.types'
import { TICKETMASTER_BASE_URL } from '@/utils/consts'


function getApiKey(): string {
    const apiKey = process.env.TICKETMASTER_API_KEY
    if (!apiKey) throw new Error('A variável de ambiente TICKETMASTER_API_KEY não foi definida')
    return apiKey
}

function paramHasValue(value: string | number | undefined): value is string | number {
    return value !== undefined && value !== null && value !== ''
}

function filterValidParams(params: RawParams): Record<string, string> {
    const validParams: Record<string, string> = {}

    Object.entries(params).forEach(([key, value]) => {
        if (paramHasValue(value)) {
            validParams[key] = String(value)
        }
    })

    return validParams
}

function buildUrl(path: string, params: RawParams = {}): string {
    const url = new URL(`${TICKETMASTER_BASE_URL}${path}`)
    const allParams = { apikey: getApiKey(), ...filterValidParams(params) }

    Object.entries(allParams).forEach(([key, value]) => {
        url.searchParams.set(key, value)
    })

    return url.toString()
}

async function ticketmasterFetch<T>(
    path: string,
    params: RawParams = {},
    options?: TicketmasterFetchOptions
): Promise<T> {
    const response = await fetch(buildUrl(path, params), {
        ...options,
        headers: { Accept: 'application/json', ...options?.headers },
    })

    if (!response.ok) {
        throw new Error(`Falha na requisição à Ticketmaster. Status: ${response.status}`)
    }

    return response.json() as Promise<T>
}

export async function getEvents(
    params: GetEventsParams = {},
    options?: TicketmasterFetchOptions
): Promise<TicketmasterEventsResponse> {
    const defaultParams = { size: 12, locale: '*' }
    return ticketmasterFetch('/events.json', { ...defaultParams, ...params }, options)
}

export async function getEventById(
    eventId: string,
    options?: TicketmasterFetchOptions
): Promise<TicketmasterEvent> {
    return ticketmasterFetch(`/events/${eventId}.json`, { locale: '*' }, options)
}

export function extractEvents(response: TicketmasterEventsResponse): TicketmasterEvent[] {
    return response._embedded?.events ?? []
}

export function extractFirstVenue(event: TicketmasterEvent): TicketmasterVenue | undefined {
    return event._embedded?.venues?.[0]
}

export function extractEventImage(event: TicketmasterEvent): TicketmasterImage | undefined {
    return event.images?.[0]
}