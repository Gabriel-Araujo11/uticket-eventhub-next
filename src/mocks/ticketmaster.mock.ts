import type {
    TicketmasterEvent,
    TicketmasterEventsResponse,
} from '@/types/event.types'

const mockEvents: TicketmasterEvent[] = [
    {
        id: 'mock-event-1',
        name: 'Festival de Música em Vitória',
        info: 'Um evento fictício.',
        pleaseNote: 'Evento exibido apenas em ambiente de dev.',
        dates: {
            start: {
                localDate: '2026-04-20',
                localTime: '20:00:00',
            },
            status: {
                code: 'onsale',
            },
        },
        images: [],
        priceRanges: [
            {
                type: 'standard',
                currency: 'BRL',
                min: 80,
                max: 180,
            },
        ],
        classifications: [
            {
                segment: {
                    name: 'Music',
                },
                genre: {
                    name: 'Pop',
                },
            },
        ],
        _embedded: {
            venues: [
                {
                    id: 'mock-venue-1',
                    name: 'Arena Vitória',
                    city: {
                        name: 'Vitória',
                    },
                    state: {
                        name: 'Espírito Santo',
                        stateCode: 'ES',
                    },
                    country: {
                        name: 'Brasil',
                        countryCode: 'BR',
                    },
                    address: {
                        line1: 'Av. Beira Mar, 1000',
                    },
                },
            ],
        },
    },
    {
        id: 'mock-event-2',
        name: 'Tech Atitude Day',
        info: 'Conferência fictícia.',
        pleaseNote: 'Conteúdo mockado para desenvolvimento local.',
        dates: {
            start: {
                localDate: '2026-05-10',
                localTime: '09:00:00',
            },
            status: {
                code: 'onsale',
            },
        },
        images: [],
        priceRanges: [
            {
                type: 'standard',
                currency: 'BRL',
                min: 120,
                max: 350,
            },
        ],
        classifications: [
            {
                segment: {
                    name: 'Miscellaneous',
                },
                genre: {
                    name: 'Conference',
                },
            },
        ],
        _embedded: {
            venues: [
                {
                    id: 'mock-venue-2',
                    name: 'Igreja Atitude Vitória',
                    city: {
                        name: 'Vitória',
                    },
                    state: {
                        name: 'Espírito Santo',
                        stateCode: 'ES',
                    },
                    country: {
                        name: 'Brasil',
                        countryCode: 'BR',
                    },
                    address: {
                        line1: 'Avenida da Igreja, 1000',
                    },
                },
            ],
        },
    },
    {
        id: 'mock-event-3',
        name: 'Feira Gastronômica Capixaba',
        info: 'Evento de gastronomia usado como fallback local.',
        pleaseNote: 'Mock para continuar o desenvolvimento sem depender da API.',
        dates: {
            start: {
                localDate: '2026-06-01',
                localTime: '18:30:00',
            },
            status: {
                code: 'onsale',
            },
        },
        images: [],
        priceRanges: [
            {
                type: 'standard',
                currency: 'BRL',
                min: 0,
                max: 60,
            },
        ],
        classifications: [
            {
                segment: {
                    name: 'Miscellaneous',
                },
                genre: {
                    name: 'Food & Drink',
                },
            },
        ],
        _embedded: {
            venues: [
                {
                    id: 'mock-venue-3',
                    name: 'Praça do Papa',
                    city: {
                        name: 'Vitória',
                    },
                    state: {
                        name: 'Espírito Santo',
                        stateCode: 'ES',
                    },
                    country: {
                        name: 'Brasil',
                        countryCode: 'BR',
                    },
                    address: {
                        line1: 'Enseada do Suá',
                    },
                },
            ],
        },
    },
]

export const mockEventsResponse: TicketmasterEventsResponse = {
    _embedded: {
        events: mockEvents,
    },
    page: {
        size: 12,
        totalElements: mockEvents.length,
        totalPages: 1,
        number: 0,
    },
}

export function findMockEventById(eventId: string): TicketmasterEvent | undefined {
    return mockEvents.find((event) => event.id === eventId)
}