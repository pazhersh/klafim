import { NavLink } from "react-router";
import Creatable from "../../Components/Inputs/Creatable";
import EditableWrapper from "../../Components/Inputs/EditableWrapper";
import useDecksStore, { Deck } from "../../useDecksStore";
import styles from './ManageDecks.module.css';
import EditDeckTitle from "../../Components/EditDeckTitle";
import EditDeckValues from "../../Components/EditDeckValues";

type EditDeckProps = {
    id: string;
    deck: Deck;
}

export function EditDeck({ id, deck }: EditDeckProps) {
    return <div className={styles.container}>
        <h3>
            <EditDeckTitle deckId={id} />
        </h3>
        <sup>
            <NavLink to={`./${id}`}>manage</NavLink>
        </sup>

        <p>cards:</p>
        <EditDeckValues deckId={id} deck={deck} />

    </div>;
}