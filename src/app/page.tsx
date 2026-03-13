import Image from 'next/image'
import Link from 'next/link'

import FavoriteEventButton from '@/components/favorite-event-button'
import {
  extractEventImage,
  extractEvents,
  extractFirstVenue,
  getEvents,
} from '@/lib/ticketmaster'

import styles from './page.module.css'

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
  const currentYear = new Date().getFullYear()

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarContent}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandIcon}>🎉</span>
            <span className={styles.brandText}>EventHub</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={`${styles.navLink} ${styles.navLinkActive}`}>
              Início
            </Link>

            <Link href="/busca" className={styles.navLink}>
              Buscar Eventos
            </Link>

            <Link href="/favoritos" className={styles.navLink}>
              Meus Eventos
            </Link>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Descubra eventos incríveis perto de você</h1>

          <p className={styles.heroSubtitle}>
            Encontre shows, festivais, esportes e muito mais
          </p>

          <Link href="/busca" className={styles.primaryButton}>
            Explorar Eventos
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Eventos Populares</h2>

          <Link href="/busca" className={styles.secondaryLink}>
            Ver todos →
          </Link>
        </div>

        {events.length === 0 ? (
          <p className={styles.emptyState}>Nenhum evento encontrado no momento.</p>
        ) : (
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
                    <h3 className={styles.eventTitle}>
                      <Link
                        href={`/evento/${event.id}`}
                        className={styles.eventTitleLink}
                      >
                        {event.name}
                      </Link>
                    </h3>

                    <p className={styles.eventText}>
                      <strong>Data:</strong>{' '}
                      {formatEventDate(event.dates?.start?.localDate)}
                    </p>

                    <p className={styles.eventText}>
                      <strong>Local:</strong>{' '}
                      {venue?.name ?? 'Local não informado'}
                    </p>

                    <p className={styles.eventText}>
                      <strong>Cidade:</strong>{' '}
                      {venue?.city?.name ?? 'Cidade não informada'}
                    </p>

                    <div className={styles.eventActions}>
                      <Link
                        href={`/evento/${event.id}`}
                        className={styles.eventDetailsLink}
                      >
                        Ver detalhes →
                      </Link>

                      <FavoriteEventButton event={event} compact />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className={`${styles.section} ${styles.featuresSection}`}>
        <h2 className={`${styles.sectionTitle} ${styles.featuresTitle}`}>
          Por que usar o EventHub?
        </h2>

        <div className={styles.featuresGrid}>
          <article className={styles.featureCard}>
            <span className={styles.featureIcon}>🎫</span>
            <h3 className={styles.featureTitle}>Variedade de Eventos</h3>
            <p className={styles.featureText}>
              Shows, esportes, teatro e muito mais em um só lugar
            </p>
          </article>

          <article className={styles.featureCard}>
            <span className={styles.featureIcon}>📍</span>
            <h3 className={styles.featureTitle}>Eventos Locais</h3>
            <p className={styles.featureText}>
              Descubra o que está acontecendo na sua cidade
            </p>
          </article>

          <article className={styles.featureCard}>
            <span className={styles.featureIcon}>❤️</span>
            <h3 className={styles.featureTitle}>Salve Favoritos</h3>
            <p className={styles.featureText}>
              Guarde seus eventos preferidos para não perder
            </p>
          </article>

          <article className={styles.featureCard}>
            <span className={styles.featureIcon}>🔔</span>
            <h3 className={styles.featureTitle}>Fácil de Usar</h3>
            <p className={styles.featureText}>
              Interface simples e intuitiva para encontrar eventos
            </p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {currentYear} EventHub - Todos os direitos reservados
        </p>

        <p className={styles.footerText}>
          Dados fornecidos pela Ticketmaster Discovery API
        </p>
      </footer>
    </main>
  )
}