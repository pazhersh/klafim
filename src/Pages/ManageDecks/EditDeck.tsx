import { NavLink } from "react-router";
import Creatable from "../../Components/Inputs/Creatable";
import EditableWrapper from "../../Components/Inputs/EditableWrapper";
import useDecksStore, { Deck } from "../../useDecksStore";
import styles from './ManageDecks.module.css';

type EditDeckProps = {
    id: string;
    deck: Deck;
}

export function EditDeck({ id, deck }: EditDeckProps) {
    const { updateDeck, removeDeck } = useDecksStore();

    const onDeleteValue = (index: number) => {
        const cardValues = Array.from(deck.cardValues);
        cardValues.splice(index, 1);

        updateDeck(id, {
            ...deck,
            cardValues
        });
    }

    const onDeleteDeck = () => {
        removeDeck(id);
    }

    const onRenameDeck = (name: string) => {
        updateDeck(id, {
            ...deck,
            name
        })
    }

    const onEditValue = (index: number, newValue: string) => {
        const cardValues = Array.from(deck.cardValues);
        cardValues[index] = newValue;

        updateDeck(id, {
            ...deck,
            cardValues
        });
    }

    const onCreateCard = (newValue: string) => {
        const cardValues = Array.from(deck.cardValues);
        cardValues.push(newValue);

        updateDeck(id, {
            ...deck,
            cardValues
        });
    }

    return <div className={styles.container}>
        <h3>
            <EditableWrapper value={deck.name} onEdit={onRenameDeck} onDelete={onDeleteDeck} />
        </h3>
        <sup>
            <NavLink to={`./${id}`}>manage</NavLink>
        </sup>

        <p>cards:</p>
        <ul>
            {deck.cardValues.map((value, index) => <li key={`${index}${value}`}>
                <EditableWrapper
                    value={value}
                    onDelete={() => onDeleteValue(index)}
                    onEdit={(newValue) => onEditValue(index, newValue)}
                />
            </li>)}
            <li><Creatable onCreate={onCreateCard} /></li>
        </ul>
    </div>;
}