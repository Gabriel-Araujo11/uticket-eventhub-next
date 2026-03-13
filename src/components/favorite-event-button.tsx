'use client'

import { useEffect, useState } from 'react'

import { useFavoritesStore } from '@/store/favorites.store'
import type { TicketmasterEvent } from '@/types/event.types'

type FavoriteEventButtonProps = {
    event: TicketmasterEvent
    compact?: boolean
}

export default function FavoriteEventButton({
    event,
    compact = false,
}: FavoriteEventButtonProps) {
    const [isHydrated, setIsHydrated] = useState(false)

    const savedEvents = useFavoritesStore((state) => state.savedEvents)
    const toggleEvent = useFavoritesStore((state) => state.toggleEvent)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const saved = savedEvents.some((savedEvent) => savedEvent.id === event.id)

    function handleClick() {
        const result = toggleEvent(event)

        if (result === 'limit') {
            alert('Você pode salvar até 5 eventos.')
        }
    }

    if (!isHydrated) {
        return (
            <button
                type="button"
                disabled
                style={{
                    padding: compact ? '8px 12px' : '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    background: '#f9fafb',
                    color: '#6b7280',
                    fontWeight: 600,
                    cursor: 'not-allowed',
                }}
            >
                Carregando...
            </button>
        )
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            style={{
                padding: compact ? '8px 12px' : '12px 16px',
                border: saved ? '1px solid #fecaca' : '1px solid #d1d5db',
                borderRadius: '10px',
                background: saved ? '#fef2f2' : '#ffffff',
                color: saved ? '#dc2626' : '#111827',
                fontWeight: 600,
                cursor: 'pointer',
            }}
        >
            {saved ? 'Remover dos favoritos' : 'Salvar evento'}
        </button>
    )
}