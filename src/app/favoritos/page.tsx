'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { useFavoritesStore } from '@/store/favorites.store'

function formatEventDate(date?: string): string {
    if (!date) return 'Data não informada'

    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
    }).format(new Date(`${date}T00:00:00`))
}

export default function FavoritesPage() {
    const [isHydrated, setIsHydrated] = useState(false)

    const savedEvents = useFavoritesStore((state) => state.savedEvents)
    const maxFavorites = useFavoritesStore((state) => state.maxFavorites)
    const removeEvent = useFavoritesStore((state) => state.removeEvent)
    const clearSavedEvents = useFavoritesStore((state) => state.clearSavedEvents)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const remainingSlots = useMemo(() => {
        return Math.max(0, maxFavorites - savedEvents.length)
    }, [maxFavorites, savedEvents.length])

    if (!isHydrated) {
        return (
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
                <p style={{ color: '#4b5563' }}>Carregando favoritos...</p>
            </main>
        )
    }

    return (
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 48px' }}>
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

                <h1 style={{ margin: '0 0 12px' }}>Meus favoritos</h1>

                <p style={{ margin: '0 0 8px', color: '#4b5563' }}>
                    Você salvou {savedEvents.length} de {maxFavorites} eventos.
                </p>

                <p style={{ margin: 0, color: '#4b5563' }}>
                    Restam {remainingSlots} espaço(s) disponível(is).
                </p>
            </header>

            {savedEvents.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <button
                        type="button"
                        onClick={clearSavedEvents}
                        style={{
                            padding: '10px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '10px',
                            background: '#ffffff',
                            color: '#111827',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Limpar favoritos
                    </button>
                </div>
            )}

            {savedEvents.length === 0 ? (
                <div
                    style={{
                        padding: '24px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        background: '#ffffff',
                    }}
                >
                    <p style={{ margin: '0 0 16px', color: '#4b5563' }}>
                        Você ainda não salvou nenhum evento.
                    </p>

                    <Link
                        href="/busca"
                        style={{
                            color: '#2563eb',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        Explorar eventos →
                    </Link>
                </div>
            ) : (
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
                    {savedEvents.map((event) => {
                        const venue = event._embedded?.venues?.[0]

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

                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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

                                    <button
                                        type="button"
                                        onClick={() => removeEvent(event.id)}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#dc2626',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            padding: 0,
                                        }}
                                    >
                                        Remover
                                    </button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </main>
    )
}