import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { extractFirstVenue, getEventById } from '@/lib/ticketmaster'
import { mockEventsResponse } from '@/mocks/ticketmaster.mock'

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

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
    try {
        const event = await getEventById(params.id)
        const venue = extractFirstVenue(event)

        return (
            <main style={{ padding: '32px', maxWidth: '960px', margin: '0 auto' }}>
                <Link
                    href="/"
                    style={{
                        display: 'inline-block',
                        marginBottom: '24px',
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                >
                    ← Voltar para a Home
                </Link>

                <header style={{ marginBottom: '32px' }}>
                    <h1 style={{ marginBottom: '12px' }}>{event.name}</h1>

                    <p style={{ margin: '0 0 8px', color: '#4b5563' }}>
                        <strong>Data:</strong> {formatEventDate(event.dates?.start?.localDate)}
                    </p>

                    <p style={{ margin: '0 0 8px', color: '#4b5563' }}>
                        <strong>Horário:</strong> {event.dates?.start?.localTime ?? 'Não informado'}
                    </p>

                    <p style={{ margin: 0, color: '#4b5563' }}>
                        <strong>Local:</strong> {venue?.name ?? 'Local não informado'}
                    </p>
                </header>

                <section
                    style={{
                        padding: '24px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        background: '#ffffff',
                    }}
                >
                    <p style={{ marginTop: 0, color: '#374151', lineHeight: 1.7 }}>
                        {event.info ?? 'Este evento não possui descrição disponível.'}
                    </p>

                    <p style={{ marginBottom: 0, color: '#6b7280', lineHeight: 1.7 }}>
                        <strong>Observações:</strong>{' '}
                        {event.pleaseNote ?? 'Nenhuma observação adicional informada.'}
                    </p>
                </section>
            </main>
        )
    } catch {
        notFound()
    }
}