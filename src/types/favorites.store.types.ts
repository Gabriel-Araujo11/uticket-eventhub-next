import { TicketmasterEvent } from "./event.types"

export type FavoritesStore = {
    savedEvents: TicketmasterEvent[]
    maxFavorites: number
    saveEvent: (event: TicketmasterEvent) => boolean
    removeEvent: (eventId: string) => void
    toggleEvent: (event: TicketmasterEvent) => 'added' | 'removed' | 'limit'
    isEventSaved: (eventId: string) => boolean
    clearSavedEvents: () => void
}