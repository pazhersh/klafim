import styles from 'ManageDeck.module.css';
import { useParams } from 'react-router';
import useDecksStore from '../../useDecksStore';
import EditableWrapper from '../../Components/Inputs/EditableWrapper';
import { useMemo } from 'react';
import NavBar from '../../Components/NavBar';
import Creatable from '../../Components/Inputs/Creatable';
import EditDeckTitle from '../../Components/EditDeckTitle';
import EditDeckValues from '../../Components/EditDeckValues';

export default function ManageDeck() {
    const { deckId } = useParams();
    const { decks, updateDeck, removeDeck } = useDecksStore();

    const deck = useMemo(() => !deckId ? undefined : decks.get(deckId), [decks])

    if (!deckId || !deck) {
        return 'not found'; // TODO: redirect
    }

    const onRename = (newName: string) => updateDeck(deckId, {
        ...deck,
        name: newName
    });

    const onDelete = () => removeDeck(deckId);

    const onEditValue = (index: number, newValue: string) => {
        const cardValues = deck.cardValues;
        cardValues[index] = newValue;

        updateDeck(deckId, {
            ...deck,
            cardValues,
        });
    }

    const onDeleteValue = (index: number) => {
        const cardValues = deck.cardValues;
        cardValues.splice(index, 1);

        updateDeck(deckId, {
            ...deck,
            cardValues,
        });
    }

    const onCreateCard = (newValue: string) => updateDeck(deckId, {
        ...deck,
        cardValues: [...deck.cardValues, newValue]
    })


    console.log(deck);
    return <div>
        <NavBar />

        <h1>
            <EditDeckTitle deckId={deckId} allowDelete={false} />
        </h1>

        <EditDeckValues deckId={deckId} deck={deck} />

        <button onClick={onDelete}>delete deck</button>
    </div>
}