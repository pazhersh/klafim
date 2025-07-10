import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Deck = {
    name: string;
    cardValues: string[];
}

export type Decks = Map<string, Deck>;

const DECKS_KEY = 'DECKS_STORE';

const defaultDeckValues = [
    'On a scale of 1 to 10, why is there so much dust on the blinds?',
    'On a scale of 90 to 100, how much do you like Paz?',
    'How much money would you pay to have this deck-app on your phone?',
    'On a scale of 0 to 100, how much do you think this deck-app improves the Fun Facts experiance?'
];

const defaultDeck = {
    cardValues: defaultDeckValues,
    name: 'Fun Facts Best Cards'
}

function generateDeckId() {
    return crypto.randomUUID();
}

type DeckStore = {
    decks: Decks;
    createDeck: (deck: Deck) => void;
    updateDeck: (id: string, deck: Deck) => void;
}

export default create<DeckStore>()(persist((set) => ({
    decks: new Map([[generateDeckId(), defaultDeck]]),
    createDeck: (deck: Deck) => set((state) => ({
        decks: new Map(state.decks).set(generateDeckId(), deck)
    })),
    updateDeck: (id: string, deck: Deck) => set((state) => ({
        decks: new Map(state.decks).set(id, deck),
    })),
}), {
    name: DECKS_KEY,
    storage: {
        getItem: (name) => {
            const rawStore = localStorage.getItem(name);
            if (!rawStore) {
                return null;
            }
            const store = JSON.parse(rawStore);
            return {
                ...store,
                state: {
                    decks: new Map(store.state.decks)
                }
            }
        },
        setItem: (name, store) => {
            localStorage.setItem(name, JSON.stringify({
                ...store,
                state: {
                    decks: Array.from(store.state.decks.entries())
                }
            }))
        },
        removeItem: (name) => localStorage.removeItem(name)
    }
}))