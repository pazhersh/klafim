import { useMemo } from "react";
import useDecksStore from "../useDecksStore";
import EditableWrapper from "./Inputs/EditableWrapper";

type EditDeckTitleProps = {
    deckId: string;
    allowDelete?: boolean
}

export default function EditDeckTitle({ deckId, allowDelete = true }: EditDeckTitleProps) {
    const { decks, updateDeck, removeDeck } = useDecksStore();
    const deck = useMemo(() => decks.get(deckId), [decks])


    const onDeleteDeck = !allowDelete ? undefined : () => {
        removeDeck(deckId);
    };

    const onRenameDeck = (name: string) => deck && updateDeck(deckId, {
        ...deck,
        name
    });

    return <EditableWrapper value={deck?.name ?? 'deck not found'} onEdit={onRenameDeck} onDelete={onDeleteDeck} />
}