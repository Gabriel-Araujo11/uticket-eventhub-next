export interface TicketmasterImage {
    ratio?: string
    url: string
    width?: number
    height?: number
    fallback?: boolean
}

export interface TicketmasterDateStart {
    localDate?: string
    localTime?: string
    dateTime?: string
    dateTBD?: boolean
    dateTBA?: boolean
    timeTBA?: boolean
    noSpecificTime?: boolean
}

export interface TicketmasterDates {
    start?: TicketmasterDateStart
    timezone?: string
    status?: {
        code?: string
    }
}

export interface TicketmasterPriceRange {
    type?: string
    currency?: string
    min?: number
    max?: number
}

export interface TicketmasterClassification {
    segment?: {
        id?: string
        name?: string
    }
    genre?: {
        id?: string
        name?: string
    }
    subGenre?: {
        id?: string
        name?: string
    }
    subType?: {
        id?: string
        name?: string
    }
    type?: {
        id?: string
        name?: string
    }
    family?: boolean
}

export interface TicketmasterVenue {
    id?: string
    name?: string
    type?: string
    url?: string
    city?: {
        name?: string
    }
    state?: {
        name?: string
        stateCode?: string
    }
    country?: {
        name?: string
        countryCode?: string
    }
    address?: {
        line1?: string
    }
}

export interface TicketmasterEvent {
    id: string
    name: string
    type?: string
    url?: string
    info?: string
    pleaseNote?: string
    locale?: string
    images?: TicketmasterImage[]
    dates?: TicketmasterDates
    priceRanges?: TicketmasterPriceRange[]
    classifications?: TicketmasterClassification[]
    seatmap?: {
        staticUrl?: string
    }
    _embedded?: {
        venues?: TicketmasterVenue[]
    }
}

export interface TicketmasterPageInfo {
    size?: number
    totalElements?: number
    totalPages?: number
    number?: number
}

export interface TicketmasterEventsResponse {
    _embedded?: {
        events?: TicketmasterEvent[]
    }
    page?: TicketmasterPageInfo
}

export type EventDetailsPageProps = {
    params: {
        id: string
    }
}