import Link from 'next/link'

import { extractEvents, extractFirstVenue, getEvents } from '@/lib/ticketmaster'

type SearchPageProps = {
    searchParams?: {
        keyword?: string
        city?: string
        page?: string
    }
}

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
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
            <header style={{ marginBottom: '32px' }}>
                <Link
                    href="/"
                    style={{
                        display: 'inline-block',
                        marginBottom: '16px',
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                >
                    ← Voltar para a Home
                </Link>

                <h1 style={{ margin: '0 0 12px' }}>Buscar eventos</h1>
                <p style={{ margin: 0, color: '#4b5563' }}>
                    Encontre eventos por nome ou cidade.
                </p>
            </header>

            <form
                action="/busca"
                method="GET"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '16px',
                    marginBottom: '32px',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    background: '#ffffff',
                }}
            >
                <div>
                    <label
                        htmlFor="keyword"
                        style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}
                    >
                        Palavra-chave
                    </label>
                    <input
                        id="keyword"
                        name="keyword"
                        defaultValue={keyword}
                        placeholder="Ex: rock, festival, teatro"
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '10px',
                        }}
                    />
                </div>

                <div>
                    <label
                        htmlFor="city"
                        style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}
                    >
                        Cidade
                    </label>
                    <input
                        id="city"
                        name="city"
                        defaultValue={city}
                        placeholder="Ex: Vitória"
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '10px',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            borderRadius: '10px',
                            background: '#2563eb',
                            color: '#ffffff',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Buscar
                    </button>
                </div>
            </form>

            {events.length === 0 ? (
                <p
                    style={{
                        padding: '24px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        background: '#ffffff',
                        color: '#4b5563',
                    }}
                >
                    Nenhum evento encontrado para os filtros informados.
                </p>
            ) : (
                <>
                    <ul
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                            gap: '20px',
                            padding: 0,
                            margin: 0,
                            listStyle: 'none',
                        }}
                    >
                        {events.map((event) => {
                            const venue = extractFirstVenue(event)

                            return (
                                <li
                                    key={event.id}
                                    style={{
                                        padding: '20px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '16px',
                                        background: '#ffffff',
                                        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
                                    }}
                                >
                                    <h2 style={{ margin: '0 0 16px', fontSize: '1.125rem' }}>
                                        <Link
                                            href={`/evento/${event.id}`}
                                            style={{ color: 'inherit', textDecoration: 'none' }}
                                        >
                                            {event.name}
                                        </Link>
                                    </h2>

                                    <p style={{ margin: '0 0 10px', color: '#4b5563' }}>
                                        <strong>Data:</strong> {formatEventDate(event.dates?.start?.localDate)}
                                    </p>

                                    <p style={{ margin: '0 0 10px', color: '#4b5563' }}>
                                        <strong>Local:</strong> {venue?.name ?? 'Local não informado'}
                                    </p>

                                    <p style={{ margin: '0 0 16px', color: '#4b5563' }}>
                                        <strong>Cidade:</strong> {venue?.city?.name ?? 'Cidade não informada'}
                                    </p>

                                    <Link
                                        href={`/evento/${event.id}`}
                                        style={{
                                            color: '#2563eb',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Ver detalhes →
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    <nav
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '16px',
                            marginTop: '32px',
                        }}
                    >
                        {hasPreviousPage ? (
                            <Link
                                href={buildSearchHref({
                                    keyword: keyword || undefined,
                                    city: city || undefined,
                                    page: currentPage - 1,
                                })}
                                style={{
                                    color: '#2563eb',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                ← Página anterior
                            </Link>
                        ) : (
                            <span style={{ color: '#9ca3af' }}>← Página anterior</span>
                        )}

                        <span style={{ color: '#4b5563' }}>
                            Página {currentPage + 1} de {Math.max(totalPages, 1)}
                        </span>

                        {hasNextPage ? (
                            <Link
                                href={buildSearchHref({
                                    keyword: keyword || undefined,
                                    city: city || undefined,
                                    page: currentPage + 1,
                                })}
                                style={{
                                    color: '#2563eb',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                Próxima página →
                            </Link>
                        ) : (
                            <span style={{ color: '#9ca3af' }}>Próxima página →</span>
                        )}
                    </nav>
                </>
            )}
        </main>
    )
}