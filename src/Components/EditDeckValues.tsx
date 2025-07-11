import { useMemo } from "react";
import useDecksStore, { Deck } from "../useDecksStore";
import EditableWrapper from "./Inputs/EditableWrapper";
import Creatable from "./Inputs/Creatable";

type EditDeckValuesProps = {
    deckId: string;
    deck: Deck;
}

export default function EditDeckValues({ deckId, deck }: EditDeckValuesProps) {
    const { updateDeck } = useDecksStore();

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


    return <ul>
        {deck?.cardValues.map((value, index) => <li key={`${index}${value}`}>
            <EditableWrapper
                value={value}
                onEdit={(newValue) => onEditValue(index, newValue)}
                onDelete={() => onDeleteValue(index)}
            />
        </li>)}
        <li><Creatable onCreate={onCreateCard} /></li>
    </ul>
}