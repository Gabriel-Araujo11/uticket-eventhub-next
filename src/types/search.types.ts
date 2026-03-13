export type SearchPageProps = {
    searchParams?: {
        keyword?: string
        city?: string
        segmentName?: string
        page?: string
    }
}

export type SearchFiltersFormProps = {
    keyword: string
    city: string
    segmentName: string
}