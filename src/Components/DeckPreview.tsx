import { Deck } from "../useDecksStore";

type DeckPreviewProps = {
    deck: Deck;
}

export default function DeckPreview({ deck }: DeckPreviewProps) {
    return <ul>
        {deck.cardValues.map((value) => <li>{value}</li>)}
    </ul>;
}