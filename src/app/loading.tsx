'use client'

export default function Loading() {
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
                    maxWidth: '480px',
                    padding: '32px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '20px',
                    background: '#ffffff',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        width: '48px',
                        height: '48px',
                        margin: '0 auto 16px',
                        border: '4px solid #dbeafe',
                        borderTopColor: '#2563eb',
                        borderRadius: '9999px',
                        animation: 'spin 0.9s linear infinite',
                    }}
                />

                <h1
                    style={{
                        margin: '0 0 8px',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#111827',
                    }}
                >
                    Carregando...
                </h1>

                <p
                    style={{
                        margin: 0,
                        color: '#4b5563',
                        lineHeight: 1.6,
                    }}
                >
                    Estamos preparando os dados para você.
                </p>

                <style>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
            </div>
        </main>
    )
}