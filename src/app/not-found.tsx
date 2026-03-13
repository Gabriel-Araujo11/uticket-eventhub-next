import Link from 'next/link'

export default function NotFoundPage() {
    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                padding: '32px 24px',
                background: '#f8fafc',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '520px',
                    padding: '32px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '20px',
                    background: '#ffffff',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                    textAlign: 'center',
                }}
            >
                <p
                    style={{
                        margin: '0 0 8px',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#2563eb',
                    }}
                >
                    EventHub
                </p>

                <h1
                    style={{
                        margin: '0 0 12px',
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: '#111827',
                    }}
                >
                    Página não encontrada
                </h1>

                <p
                    style={{
                        margin: '0 0 24px',
                        color: '#4b5563',
                        lineHeight: 1.6,
                    }}
                >
                    Não conseguimos encontrar o conteúdo que você tentou acessar.
                </p>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                    }}
                >
                    <Link
                        href="/"
                        style={{
                            padding: '12px 18px',
                            borderRadius: '10px',
                            background: '#2563eb',
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Ir para a Home
                    </Link>

                    <Link
                        href="/busca"
                        style={{
                            padding: '12px 18px',
                            border: '1px solid #d1d5db',
                            borderRadius: '10px',
                            background: '#ffffff',
                            color: '#111827',
                            textDecoration: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Buscar eventos
                    </Link>
                </div>
            </div>
        </main>
    )
}