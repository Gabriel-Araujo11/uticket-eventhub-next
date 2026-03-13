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
                const alreadySaved = savedEvents.some(
                    (savedEvent) => savedEvent.id === event.id
                )
                if (alreadySaved) {
                    return true
                }
                if (savedEvents.length >= maxFavorites) {
                    return false
                }
                set({
                    savedEvents: [...savedEvents, event],
                })

                return true
            },

            removeEvent: (eventId) => {
                const { savedEvents } = get()
                set({
                    savedEvents: savedEvents.filter((event) => event.id !== eventId),
                })
            },

            toggleEvent: (event) => {
                const { isEventSaved, removeEvent, saveEvent } = get()
                if (isEventSaved(event.id)) {
                    removeEvent(event.id)
                    return 'removed'
                }
                const wasSaved = saveEvent(event)
                if (!wasSaved) {
                    return 'limit'
                }

                return 'added'
            },

            isEventSaved: (eventId) => {
                return get().savedEvents.some((event) => event.id === eventId)
            },

            clearSavedEvents: () => {
                set({ savedEvents: [] })
            },
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