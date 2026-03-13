'use client'

import { ErrorPageProps } from "@/types/error.types"

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    console.error(error)

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
                <h1
                    style={{
                        margin: '0 0 12px',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#111827',
                    }}
                >
                    Algo deu errado
                </h1>

                <p
                    style={{
                        margin: '0 0 20px',
                        color: '#4b5563',
                        lineHeight: 1.6,
                    }}
                >
                    Ocorreu um erro inesperado ao carregar esta página.
                </p>

                <button
                    onClick={reset}
                    style={{
                        padding: '12px 18px',
                        border: 'none',
                        borderRadius: '10px',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    Tentar novamente
                </button>
            </div>
        </main>
    )
}