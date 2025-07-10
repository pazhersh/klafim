import EditableWrapper from "../../Components/EditableWrapper";
import { Deck } from "../../decksUtils";
import { useDecks } from "../../useDecks";
import styles from './ManageDecks.module.css';

type EditDeckProps = {
    id: string;
    deck: Deck;
}

export function EditDeck({ id, deck }: EditDeckProps) {
    const { updateDeck } = useDecks();

    const onDeleteValue = (index: number) => {
        const cardValues = Array.from(deck.cardValues);
        cardValues.splice(index, 1);

        updateDeck(id, {
            ...deck,
            cardValues
        });
    }

    return <div className={styles.container}>
        <h3>
            {deck.name}
        </h3>
        <ul>
            {deck.cardValues.map((value, index) => <li key={value}>
                <EditableWrapper value={value} onDelete={() => { onDeleteValue(index) }} onEdit={() => { }} />
            </li>)}
        </ul>
    </div>;
}