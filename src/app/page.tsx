import { extractEvents, extractFirstVenue, getEvents } from '@/lib/ticketmaster'

export const revalidate = 3600

function formatEventDate(date?: string): string {
  if (!date) return 'Data não informada'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
  }).format(new Date(`${date}T00:00:00`))
}

export default async function HomePage() {
  const response = await getEvents(
    {
      size: 12,
      sort: 'date,asc',
    },
    {
      next: {
        revalidate,
      },
    }
  )

  const events = extractEvents(response)

  return (
    <main style={{ padding: '32px' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1>EventHub</h1>
        <p>Confira alguns eventos disponíveis.</p>
      </header>

      {events.length === 0 ? (
        <p>Nenhum evento encontrado no momento.</p>
      ) : (
        <ul
          style={{
            display: 'grid',
            gap: '16px',
            padding: 0,
            listStyle: 'none',
          }}
        >
          {events.map((event) => {
            const venue = extractFirstVenue(event)

            return (
              <li
                key={event.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <h2 style={{ marginTop: 0 }}>{event.name}</h2>

                <p>
                  <strong>Data:</strong>{' '}
                  {formatEventDate(event.dates?.start?.localDate)}
                </p>

                <p>
                  <strong>Local:</strong>{' '}
                  {venue?.name ?? 'Local não informado'}
                </p>

                <p>
                  <strong>Cidade:</strong>{' '}
                  {venue?.city?.name ?? 'Cidade não informada'}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}