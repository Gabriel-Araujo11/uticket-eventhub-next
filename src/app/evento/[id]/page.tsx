import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import FavoriteEventButton from '@/components/favorite-event-button'
import {
    extractEventImage,
    extractEvents,
    extractFirstVenue,
    getEventById,
    getEvents,
} from '@/lib/ticketmaster'
import { mockEventsResponse } from '@/mocks/ticketmaster.mock'

import styles from './page.module.css'

type EventDetailsPageProps = {
    params: {
        id: string
    }
}

function formatEventDate(date?: string): string {
    if (!date) return 'Data não informada'

    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'full',
    }).format(new Date(`${date}T00:00:00`))
}

async function getStaticEventIds(): Promise<string[]> {
    try {
        const response = await getEvents(
            {
                size: 12,
                sort: 'date,asc',
            },
            {
                next: {
                    revalidate: 3600,
                },
            }
        )

        const events = extractEvents(response)

        if (events.length > 0) {
            return events.map((event) => event.id)
        }
    } catch {
        // fallback para mocks
    }

    return mockEventsResponse._embedded?.events?.map((event) => event.id) ?? []
}

export async function generateStaticParams() {
    const eventIds = await getStaticEventIds()

    return eventIds.map((id) => ({
        id,
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

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
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
                        <Image
                            src={eventImage?.url ?? '/event-placeholder.svg'}
                            alt={event.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 960px"
                            className={styles.image}
                        />
                    </div>

                    <div className={styles.content}>
                        <header className={styles.header}>
                            <h1 className={styles.title}>{event.name}</h1>

                            <p className={styles.metaText}>
                                <strong>Data:</strong> {formatEventDate(event.dates?.start?.localDate)}
                            </p>

                            <p className={styles.metaText}>
                                <strong>Horário:</strong> {event.dates?.start?.localTime ?? 'Não informado'}
                            </p>

                            <p className={styles.metaText}>
                                <strong>Local:</strong> {venue?.name ?? 'Local não informado'}
                            </p>

                            <p className={styles.metaText}>
                                <strong>Cidade:</strong> {venue?.city?.name ?? 'Cidade não informada'}
                            </p>
                        </header>

                        <section className={styles.infoCard}>
                            <p className={styles.description}>
                                {event.info ?? 'Este evento não possui descrição disponível.'}
                            </p>

                            <p className={styles.notes}>
                                <strong>Observações:</strong>{' '}
                                {event.pleaseNote ?? 'Nenhuma observação adicional informada.'}
                            </p>
                        </section>

                        <div className={styles.actions}>
                            <FavoriteEventButton event={event} />
                        </div>
                    </div>
                </section>
            </main>
        )
    } catch {
        notFound()
    }
}