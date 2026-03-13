import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import FavoriteEventButton from '@/components/favorite-event-button'
import SearchFiltersForm from '@/components/search-filters-form'
import {
    extractEventImage,
    extractEvents,
    extractFirstVenue,
    getEvents,
} from '@/lib/ticketmaster'

import styles from './page.module.css'
import { SearchPageProps } from '@/types/search.types'

function formatEventDate(date?: string): string {
    if (!date) return 'Data não informada'

    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
    }).format(new Date(`${date}T00:00:00`))
}

function getPageNumber(page?: string): number {
    const parsedPage = Number(page)

    if (Number.isNaN(parsedPage) || parsedPage < 0) {
        return 0
    }

    return parsedPage
}

function toStartDateTime(date?: string): string | undefined {
    if (!date) return undefined
    return `${date}T00:00:00Z`
}

function toEndDateTime(date?: string): string | undefined {
    if (!date) return undefined
    return `${date}T23:59:59Z`
}

function buildSearchHref(params: {
    keyword?: string
    city?: string
    segmentName?: string
    startDate?: string
    endDate?: string
    page?: number
}): string {
    const search = new URLSearchParams()

    if (params.keyword) {
        search.set('keyword', params.keyword)
    }

    if (params.city) {
        search.set('city', params.city)
    }

    if (params.segmentName) {
        search.set('segmentName', params.segmentName)
    }

    if (params.startDate) {
        search.set('startDate', params.startDate)
    }

    if (params.endDate) {
        search.set('endDate', params.endDate)
    }

    if (typeof params.page === 'number') {
        search.set('page', String(params.page))
    }

    const queryString = search.toString()

    return queryString ? `/busca?${queryString}` : '/busca'
}

function getEmptyStateTitle(params: {
    hasDateFilter: boolean
    hasAnyFilters: boolean
}) {
    if (params.hasDateFilter) {
        return 'Nenhum evento encontrado nesse período'
    }

    if (params.hasAnyFilters) {
        return 'Nenhum evento encontrado para os filtros informados'
    }

    return 'Nenhum evento encontrado no momento'
}

function getEmptyStateDescription(params: {
    hasDateFilter: boolean
    hasAnyFilters: boolean
}) {
    if (params.hasDateFilter) {
        return 'Tente ampliar o período selecionado ou remover alguns filtros para visualizar mais resultados.'
    }

    if (params.hasAnyFilters) {
        return 'Tente ajustar a cidade, a categoria ou a palavra-chave para encontrar mais eventos.'
    }

    return 'Tente novamente em alguns instantes para ver novos eventos disponíveis.'
}

export async function generateMetadata({
    searchParams,
}: SearchPageProps): Promise<Metadata> {
    const query = searchParams as Partial<Record<string, string | undefined>> | undefined

    const keyword = query?.keyword?.trim() || ''
    const city = query?.city?.trim() || ''
    const segmentName = query?.segmentName?.trim() || ''

    const filters = [keyword, city, segmentName].filter(Boolean)
    const filterLabel = filters.join(' • ')

    if (filterLabel) {
        return {
            title: `Busca: ${filterLabel} | EventHub`,
            description: `Confira os resultados de busca para ${filterLabel} no EventHub.`,
            alternates: {
                canonical: '/busca',
            },
        }
    }

    return {
        title: 'Buscar eventos | EventHub',
        description: 'Busque eventos por nome, categoria ou cidade no EventHub.',
        alternates: {
            canonical: '/busca',
        },
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams as Partial<Record<string, string | undefined>> | undefined

    const keyword = query?.keyword?.trim() || ''
    const city = query?.city?.trim() || ''
    const segmentName = query?.segmentName?.trim() || ''
    const startDate = query?.startDate?.trim() || ''
    const endDate = query?.endDate?.trim() || ''
    const page = getPageNumber(query?.page)

    const hasDateFilter = Boolean(startDate || endDate)
    const hasAnyFilters = Boolean(
        keyword || city || segmentName || startDate || endDate
    )

    const retryHref = buildSearchHref({
        keyword: keyword || undefined,
        city: city || undefined,
        segmentName: segmentName || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
    })

    let events: any[] = []
    let currentPage = 0
    let totalPages = 1
    let searchError = false

    try {
        const response = await getEvents(
            {
                keyword: keyword || undefined,
                city: city || undefined,
                segmentName: segmentName || undefined,
                startDateTime: toStartDateTime(startDate),
                endDateTime: toEndDateTime(endDate),
                page,
                size: 12,
                sort: 'date,asc',
            },
            {
                cache: 'no-store',
            }
        )

        events = extractEvents(response)
        currentPage = response.page?.number ?? 0
        totalPages = response.page?.totalPages ?? 1
    } catch {
        searchError = true
    }

    const hasPreviousPage = currentPage > 0
    const hasNextPage = currentPage + 1 < totalPages

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerTopBar}>
                    <Link href="/" className={styles.backLink}>
                        ← Voltar para a Home
                    </Link>

                    <Link href="/favoritos" className={styles.favoritesLink}>
                        Meus favoritos
                    </Link>
                </div>

                <h1 className={styles.title}>Buscar Eventos</h1>
            </header>

            <SearchFiltersForm
                keyword={keyword}
                city={city}
                segmentName={segmentName}
                startDate={startDate}
                endDate={endDate}
            />

            {searchError ? (
                <div className={styles.feedbackCard}>
                    <h2 className={styles.feedbackTitle}>
                        Não foi possível carregar os eventos
                    </h2>

                    <p className={styles.feedbackText}>
                        Ocorreu um problema ao consultar a Ticketmaster. Tente novamente em alguns instantes ou revise os filtros informados.
                    </p>

                    <Link href={retryHref} className={styles.retryLink}>
                        Tentar novamente
                    </Link>
                </div>
            ) : events.length === 0 ? (
                <div className={styles.feedbackCard}>
                    <h2 className={styles.feedbackTitle}>
                        {getEmptyStateTitle({ hasDateFilter, hasAnyFilters })}
                    </h2>

                    <p className={styles.feedbackText}>
                        {getEmptyStateDescription({ hasDateFilter, hasAnyFilters })}
                    </p>
                </div>
            ) : (
                <>
                    <ul className={styles.eventsGrid}>
                        {events.map((event) => {
                            const venue = extractFirstVenue(event)
                            const eventImage = extractEventImage(event)

                            return (
                                <li key={event.id} className={styles.eventCard}>
                                    <div className={styles.eventImageWrapper}>
                                        <Image
                                            src={eventImage?.url ?? '/event-placeholder.svg'}
                                            alt={event.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className={styles.eventImage}
                                        />
                                    </div>

                                    <div className={styles.eventContent}>
                                        <h2 className={styles.eventTitle}>
                                            <Link href={`/evento/${event.id}`} className={styles.eventTitleLink}>
                                                {event.name}
                                            </Link>
                                        </h2>

                                        <p className={styles.eventText}>
                                            <strong>Data:</strong> {formatEventDate(event.dates?.start?.localDate)}
                                        </p>

                                        <p className={styles.eventText}>
                                            <strong>Local:</strong> {venue?.name ?? 'Local não informado'}
                                        </p>

                                        <p className={styles.eventText}>
                                            <strong>Cidade:</strong> {venue?.city?.name ?? 'Cidade não informada'}
                                        </p>

                                        <div className={styles.eventActions}>
                                            <Link href={`/evento/${event.id}`} className={styles.eventDetailsLink}>
                                                Ver detalhes →
                                            </Link>

                                            <FavoriteEventButton event={event} compact />
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>

                    <nav className={styles.pagination}>
                        {hasPreviousPage ? (
                            <Link
                                href={buildSearchHref({
                                    keyword: keyword || undefined,
                                    city: city || undefined,
                                    segmentName: segmentName || undefined,
                                    startDate: startDate || undefined,
                                    endDate: endDate || undefined,
                                    page: currentPage - 1,
                                })}
                                className={styles.paginationLink}
                            >
                                ← Página anterior
                            </Link>
                        ) : (
                            <span className={styles.paginationDisabled}>← Página anterior</span>
                        )}

                        <span className={styles.paginationInfo}>
                            Página {currentPage + 1} de {Math.max(totalPages, 1)}
                        </span>

                        {hasNextPage ? (
                            <Link
                                href={buildSearchHref({
                                    keyword: keyword || undefined,
                                    city: city || undefined,
                                    segmentName: segmentName || undefined,
                                    startDate: startDate || undefined,
                                    endDate: endDate || undefined,
                                    page: currentPage + 1,
                                })}
                                className={styles.paginationLink}
                            >
                                Próxima página →
                            </Link>
                        ) : (
                            <span className={styles.paginationDisabled}>Próxima página →</span>
                        )}
                    </nav>
                </>
            )}
        </main>
    )
}