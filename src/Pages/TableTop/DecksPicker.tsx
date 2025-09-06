import { useCallback, useEffect, useRef, useState } from 'react';
import type { Deck, Decks } from '../../useDecksStore';
import styles from './DecksPicker.module.css';

type DeckPickerProps = {
    decks: Decks;
    onSelect: (decks: string[]) => void;
}

export default function DecksPicker({ decks, onSelect }: DeckPickerProps) {
    const [pickedDecks, setPickedDecks] = useState<string[]>([]);
    const selectAllRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (selectAllRef.current) {
            if (pickedDecks.length === 0) {
                selectAllRef.current.checked = false;
                selectAllRef.current.indeterminate = false;
            } else if (pickedDecks.length === decks.size) {
                selectAllRef.current.checked = true;
                selectAllRef.current.indeterminate = false;
            } else {
                selectAllRef.current.indeterminate = true;
            }
        }
    }, [pickedDecks])

    const handleSelection = useCallback(() => {
        onSelect(pickedDecks);
    }, [pickedDecks, onSelect]);

    return <div>
        <input
            ref={selectAllRef}
            type='checkbox'
            onChange={(event) => {
                if (event.target.checked) {
                    setPickedDecks([...decks.keys()]);
                }
                if (!event.target.checked) {
                    setPickedDecks([]);
                }
            }}
        /> select all
        <div className={styles.listContainer}>
            {[...decks.entries()].map(([id, deck]) => <div key={id}>
                <input
                    id={id}
                    type='checkbox'
                    checked={pickedDecks.includes(id)}
                    onChange={(event) => {
                        if (event.target.checked && !pickedDecks.includes(id)) {
                            setPickedDecks([...pickedDecks, id]);
                        }

                        if (!event.target.checked) {
                            setPickedDecks(pickedDecks.filter(pickedDeck => pickedDeck !== id));
                        }
                    }}

                />
                <label htmlFor={id}>{deck.name}</label>
            </div>
            )}
        </div>
        <button onClick={handleSelection}>select</button>
    </div>
}