import 'server-only'

import type {
    TicketmasterEvent,
    TicketmasterEventsResponse,
    TicketmasterVenue,
    TicketmasterImage,
} from '@/types/event.types'
import type {
    GetEventsParams,
    RawParams,
    TicketmasterFetchOptions,
} from '@/types/ticketmaster.types'
import { TICKETMASTER_BASE_URL } from '@/utils/consts'
import {
    findMockEventById,
    mockEventsResponse,
} from '@/mocks/ticketmaster.mock'

function getApiKey(): string {
    const apiKey = process.env.TICKETMASTER_API_KEY
    if (!apiKey) throw new Error('A variável de ambiente TICKETMASTER_API_KEY não foi definida')
    return apiKey
}

function shouldUseMockData(): boolean {
    return !process.env.TICKETMASTER_API_KEY && process.env.NODE_ENV === 'development'
}

function paramHasValue(value: string | number | undefined): value is string | number {
    return value !== undefined && value !== ''
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

function matchesKeyword(event: TicketmasterEvent, keyword?: string): boolean {
    if (!keyword) return true

    const normalizedKeyword = keyword.trim().toLowerCase()
    if (!normalizedKeyword) return true

    return (
        event.name.toLowerCase().includes(normalizedKeyword) ||
        event.info?.toLowerCase().includes(normalizedKeyword) ||
        false
    )
}

function matchesCity(event: TicketmasterEvent, city?: string): boolean {
    if (!city) return true

    const normalizedCity = city.trim().toLowerCase()
    if (!normalizedCity) return true

    const eventCity = event._embedded?.venues?.[0]?.city?.name?.toLowerCase()

    return eventCity?.includes(normalizedCity) ?? false
}

function getMockEvents(params: GetEventsParams = {}): TicketmasterEventsResponse {
    const allEvents = mockEventsResponse._embedded?.events ?? []

    const filteredEvents = allEvents.filter((event) => {
        return matchesKeyword(event, params.keyword) && matchesCity(event, params.city)
    })

    const size = params.size ?? 12
    const page = params.page ?? 0

    const startIndex = page * size
    const endIndex = startIndex + size

    const paginatedEvents = filteredEvents.slice(startIndex, endIndex)

    return {
        _embedded: {
            events: paginatedEvents,
        },
        page: {
            size,
            totalElements: filteredEvents.length,
            totalPages: Math.max(1, Math.ceil(filteredEvents.length / size)),
            number: page,
        },
    }
}

function getMockEventById(eventId: string): TicketmasterEvent {
    const event = findMockEventById(eventId)

    if (!event) {
        throw new Error('Evento não encontrado nos dados mockados.')
    }

    return event
}

export async function getEvents(
    params: GetEventsParams = {},
    options?: TicketmasterFetchOptions
): Promise<TicketmasterEventsResponse> {
    if (shouldUseMockData()) {
        return getMockEvents(params)
    }

    const defaultParams = { size: 12, locale: '*' }

    return ticketmasterFetch('/events.json', { ...defaultParams, ...params }, options)
}

export async function getEventById(
    eventId: string,
    options?: TicketmasterFetchOptions
): Promise<TicketmasterEvent> {
    if (shouldUseMockData()) {
        return getMockEventById(eventId)
    }

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