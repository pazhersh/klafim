import { useCallback, useEffect, useState } from "react";
import { addDeck, Deck, Decks, initDecks, loadDecks, saveDecks } from "./decksUtils";

export function useDecks() {
    const [decks, setDecks] = useState<Decks>(new Map());

    const reloadDecks = useCallback(() => {
        setDecks(loadDecks());
    }, [setDecks]);

    useEffect(() => {
        initDecks();
        reloadDecks();
    }, [reloadDecks]);

    const createDeck = useCallback((deck: Deck) => {
        addDeck(deck);
        reloadDecks();
    }, [reloadDecks]);

    const updateDeck = useCallback((id: string, newDeck: Deck) => {
        decks.set(id, newDeck);
        saveDecks(decks);
        reloadDecks();
    }, [decks, reloadDecks])

    return { decks, createDeck, updateDeck };
}