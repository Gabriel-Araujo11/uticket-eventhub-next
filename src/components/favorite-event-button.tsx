'use client'

import { useEffect, useState } from 'react'

import { useFavoritesStore } from '@/store/favorites.store'
import type { TicketmasterEvent } from '@/types/event.types'

type FavoriteEventButtonProps = {
    event: TicketmasterEvent
}

export default function FavoriteEventButton({
    event,
}: FavoriteEventButtonProps) {
    const [isHydrated, setIsHydrated] = useState(false)

    const toggleEvent = useFavoritesStore((state) => state.toggleEvent)
    const isEventSaved = useFavoritesStore((state) => state.isEventSaved)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    if (!isHydrated) {
        return (
            <button
                type="button"
                disabled
                style={{
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    background: '#f9fafb',
                    color: '#6b7280',
                    fontWeight: 600,
                    cursor: 'not-allowed',
                }}
            >
                Carregando favoritos...
            </button>
        )
    }

    const saved = isEventSaved(event.id)

    function handleClick() {
        const result = toggleEvent(event)

        if (result === 'limit') {
            alert('Você pode salvar até 5 eventos.')
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            style={{
                padding: '12px 16px',
                border: saved ? '1px solid #fecaca' : '1px solid #d1d5db',
                borderRadius: '10px',
                background: saved ? '#fef2f2' : '#ffffff',
                color: saved ? '#dc2626' : '#111827',
                fontWeight: 600,
                cursor: 'pointer',
            }}
        >
            {saved ? 'Salvo nos favoritos!' : 'Salvar evento'}
        </button>
    )
}