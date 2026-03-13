import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import FavoriteEventButton from '@/components/favorite-event-button'
import {
    extractEventImage,
    extractFirstVenue,
    getEventById,
} from '@/lib/ticketmaster'
import { mockEventsResponse } from '@/mocks/ticketmaster.mock'
import { EventDetailsPageProps } from '@/types/event.types'

import styles from './page.module.css'

function formatEventDate(date?: string): string {
    if (!date) return 'Data não informada'

    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'full',
    }).format(new Date(`${date}T00:00:00`))
}

export async function generateStaticParams() {
    const events = mockEventsResponse._embedded?.events ?? []

    return events.map((event) => ({
        id: event.id,
    }))
}

export async function generateMetadata(
    { params }: EventDetailsPageProps
): Promise<Metadata> {
    try {
        const event = await getEventById(params.id)

        return {
            title: `${event.name} | EventHub`,
            description:
                event.info ?? `Confira os detalhes do evento ${event.name} no EventHub.`,
            openGraph: {
                title: event.name,
                description:
                    event.info ?? `Confira os detalhes do evento ${event.name} no EventHub.`,
                type: 'website',
            },
            alternates: {
                canonical: `/evento/${event.id}`,
            },
        }
    } catch {
        return {
            title: 'Evento | EventHub',
            description: 'Confira os detalhes deste evento no EventHub.',
        }
    }
}

export default async function EventDetailsPage({
    params,
}: EventDetailsPageProps) {
    try {
        const event = await getEventById(params.id)
        const venue = extractFirstVenue(event)
        const eventImage = extractEventImage(event)

        return (
            <main className={styles.page}>
                <Link href="/" className={styles.backLink}>
                    ← Voltar para a Home
                </Link>

                <section className={styles.heroCard}>
                    <div className={styles.imageWrapper}>
                        {eventImage?.url ? (
                            <Image
                                src={eventImage.url}
                                alt={event.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 960px"
                                className={styles.image}
                            />
                        ) : (
                            <div className={styles.imagePlaceholder}>
                                <span className={styles.imagePlaceholderText}>EventHub</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.content}>
                        <header className={styles.header}>
                            <p className={styles.eyebrow}>Detalhes do evento</p>
                            <h1 className={styles.title}>{event.name}</h1>
                        </header>

                        <section className={styles.metaGrid}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Data</span>
                                <span className={styles.metaValue}>
                                    {formatEventDate(event.dates?.start?.localDate)}
                                </span>
                            </div>

                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Horário</span>
                                <span className={styles.metaValue}>
                                    {event.dates?.start?.localTime ?? 'Não informado'}
                                </span>
                            </div>

                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Local</span>
                                <span className={styles.metaValue}>
                                    {venue?.name ?? 'Local não informado'}
                                </span>
                            </div>

                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Cidade</span>
                                <span className={styles.metaValue}>
                                    {venue?.city?.name ?? 'Cidade não informada'}
                                </span>
                            </div>
                        </section>

                        <section className={styles.infoCard}>
                            <h2 className={styles.sectionTitle}>Sobre o evento</h2>

                            <p className={styles.description}>
                                {event.info ?? 'Este evento não possui descrição disponível.'}
                            </p>

                            <p className={styles.notes}>
                                <strong>Observações:</strong>{' '}
                                {event.pleaseNote ?? 'Nenhuma observação adicional informada.'}
                            </p>
                        </section>

                        <section className={styles.actions}>
                            <FavoriteEventButton event={event} />
                        </section>
                    </div>
                </section>
            </main>
        )
    } catch {
        notFound()
    }
}