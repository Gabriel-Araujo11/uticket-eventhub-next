import Link from 'next/link'
import Image from 'next/image'

import FavoriteEventButton from '@/components/favorite-event-button'
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

function buildSearchHref(params: {
    keyword?: string
    city?: string
    page: number
}): string {
    const search = new URLSearchParams()

    if (params.keyword) {
        search.set('keyword', params.keyword)
    }

    if (params.city) {
        search.set('city', params.city)
    }

    search.set('page', String(params.page))

    return `/busca?${search.toString()}`
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const keyword = searchParams?.keyword?.trim() || ''
    const city = searchParams?.city?.trim() || ''
    const page = getPageNumber(searchParams?.page)

    const response = await getEvents(
        {
            keyword: keyword || undefined,
            city: city || undefined,
            page,
            size: 12,
            sort: 'date,asc',
        },
        {
            cache: 'no-store',
        }
    )

    const events = extractEvents(response)
    const currentPage = response.page?.number ?? 0
    const totalPages = response.page?.totalPages ?? 1

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

                <h1 className={styles.title}>Buscar eventos</h1>
                <p className={styles.subtitle}>Encontre eventos por nome ou cidade.</p>
            </header>

            <form action="/busca" method="GET" className={styles.form}>
                <div className={styles.fieldGroup}>
                    <label htmlFor="keyword" className={styles.label}>
                        Palavra-chave
                    </label>
                    <input
                        id="keyword"
                        name="keyword"
                        defaultValue={keyword}
                        placeholder="Ex: rock, festival, teatro"
                        className={styles.input}
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label htmlFor="city" className={styles.label}>
                        Cidade
                    </label>
                    <input
                        id="city"
                        name="city"
                        defaultValue={city}
                        placeholder="Ex: Vitória"
                        className={styles.input}
                    />
                </div>

                <div className={styles.buttonWrapper}>
                    <button type="submit" className={styles.submitButton}>
                        Buscar
                    </button>
                </div>
            </form>

            {events.length === 0 ? (
                <p className={styles.emptyState}>
                    Nenhum evento encontrado para os filtros informados.
                </p>
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