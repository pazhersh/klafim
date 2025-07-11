import styles from 'ManageDeck.module.css';
import { useParams } from 'react-router';
import useDecksStore from '../../useDecksStore';
import EditableWrapper from '../../Components/Inputs/EditableWrapper';
import { useMemo } from 'react';
import NavBar from '../../Components/NavBar';
import Creatable from '../../Components/Inputs/Creatable';

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

        <h3>
            <EditableWrapper value={deck?.name ?? 'test'} onEdit={onRename} />
        </h3>

        <ul>
            {deck.cardValues.map((value, index) => <li key={`${index}${value}`}>
                <EditableWrapper
                    value={value}
                    onEdit={(newValue) => onEditValue(index, newValue)}
                    onDelete={() => onDeleteValue(index)}
                />
            </li>)}
            <li><Creatable onCreate={onCreateCard} /></li>
        </ul>

        <button onClick={onDelete}>delete deck</button>
    </div>
}