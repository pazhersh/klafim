import { useCallback, useEffect, useState } from "react";
import { addDeck, Deck, Decks, initDecks, loadDecks } from "./decksUtils";

export function useDecks() {
    const [decks, setDecks] = useState<Decks>(new Map());

    useEffect(() => {
        initDecks();
        setDecks(loadDecks());
    }, []);

    const createDeck = useCallback((deck: Deck) => {
        addDeck(deck);
        setDecks(loadDecks());
    }, [])

    return { decks, createDeck };
}