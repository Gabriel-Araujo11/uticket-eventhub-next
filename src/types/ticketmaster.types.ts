export type GetEventsParams = {
    keyword?: string
    city?: string
    segmentName?: string
    page?: number
    size?: number
    sort?: string
    startDateTime?: string
    endDateTime?: string
    locale?: string
}

export type TicketmasterFetchOptions = RequestInit & {
    next?: {
        revalidate?: number
        tags?: string[]
    }
}

export type RawParams = Record<string, string | number | undefined>
