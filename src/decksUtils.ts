export type Deck = {
    name: string;
    cardValues: string[];
}

export type Decks = Map<string, Deck>;

const defaultDeckValues = [
    'On a scale of 1 to 10, why is there so much dust on the blinds?',
    'On a scale of 90 to 100, how much do you like Paz?',
    'How much money would you pay to have this deck-app on your phone?',
    'On a scale of 0 to 100, how much do you think this deck-app improves the Fun Facts experiance?'
];

const DECKS_KEY = 'decks';

function generateDeckId() {
    return crypto.randomUUID();
}

export function loadDecks(): Decks {
    const rawDecks = localStorage.getItem(DECKS_KEY);
    return new Map(rawDecks && JSON.parse(rawDecks));
}

export function saveDecks(decks: Decks) {
    const rawDecks = JSON.stringify(Array.from(decks.entries()));
    localStorage.setItem(DECKS_KEY, rawDecks);
}

export function initDecks(): Decks {
    if (!(DECKS_KEY in localStorage)) {
        const defaultDeck = {
            cardValues: defaultDeckValues,
            name: 'Fun Facts Best Cards'
        };

        saveDecks(new Map([[generateDeckId(), defaultDeck]]));
    }

    return loadDecks();
}
