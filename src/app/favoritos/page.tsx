'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { useFavoritesStore } from '@/store/favorites.store'

import styles from './page.module.css'

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
            <main className={styles.page}>
                <p className={styles.loadingText}>Carregando favoritos...</p>
            </main>
        )
    }

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    ← Voltar para a Home
                </Link>

                <h1 className={styles.title}>Meus favoritos</h1>

                <p className={styles.subtitle}>
                    Você salvou {savedEvents.length} de {maxFavorites} eventos.
                </p>

                <p className={styles.subtitle}>
                    Restam {remainingSlots} espaço(s) disponível(is).
                </p>
            </header>

            {savedEvents.length > 0 && (
                <div className={styles.toolbar}>
                    <button
                        type="button"
                        onClick={clearSavedEvents}
                        className={styles.clearButton}
                    >
                        Limpar favoritos
                    </button>
                </div>
            )}

            {savedEvents.length === 0 ? (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Você ainda não salvou nenhum evento.
                    </p>

                    <Link href="/busca" className={styles.emptyLink}>
                        Explorar eventos →
                    </Link>
                </div>
            ) : (
                <ul className={styles.eventsGrid}>
                    {savedEvents.map((event) => {
                        const venue = event._embedded?.venues?.[0]

                        return (
                            <li key={event.id} className={styles.eventCard}>
                                <h2 className={styles.eventTitle}>
                                    <Link
                                        href={`/evento/${event.id}`}
                                        className={styles.eventTitleLink}
                                    >
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
                                    <Link
                                        href={`/evento/${event.id}`}
                                        className={styles.eventDetailsLink}
                                    >
                                        Ver detalhes →
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => removeEvent(event.id)}
                                        className={styles.removeButton}
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