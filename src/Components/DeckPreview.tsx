import useTableSelectionStore from "../useTableSelectionStore";

type DeckPreviewProps = {
    values: string[];
}

export default function DeckPreview({ values }: DeckPreviewProps) {
    return <ul>
        {values.map((value) => <li>{value}</li>)}
    </ul>;
}