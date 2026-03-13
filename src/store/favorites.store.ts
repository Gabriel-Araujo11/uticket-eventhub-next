'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { FavoritesStore } from '@/types/favorites.store.types'

const MAX_FAVORITES = 5

export const useFavoritesStore = create<FavoritesStore>()(
    persist(
        (set, get) => ({
            savedEvents: [],
            maxFavorites: MAX_FAVORITES,

            saveEvent: (event) => {
                const { savedEvents, maxFavorites } = get()

                if (savedEvents.some((e) => e.id === event.id)) return true
                if (savedEvents.length >= maxFavorites) return false

                set({ savedEvents: [...savedEvents, event] })
                return true
            },

            removeEvent: (eventId) => {
                set({ savedEvents: get().savedEvents.filter((e) => e.id !== eventId) })
            },

            toggleEvent: (event) => {
                const { isEventSaved, removeEvent, saveEvent } = get()

                if (isEventSaved(event.id)) {
                    removeEvent(event.id)
                    return 'removed'
                }

                return saveEvent(event) ? 'added' : 'limit'
            },

            isEventSaved: (eventId) => get().savedEvents.some((e) => e.id === eventId),

            clearSavedEvents: () => set({ savedEvents: [] }),
        }),
        {
            name: 'eventhub-favorites',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                savedEvents: state.savedEvents,
            }),
        }
    )
)