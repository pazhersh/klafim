import { useState } from "react";

export default function useDebounceToUpdate() {
    const [debounceValues, setDebounceValues] = useState(new Map<unknown, () => void>());

    const debounceToUpdate = (inputFunction: () => void, key) => {
        setDebounceValues((currentValues) => new Map(currentValues).set(key, inputFunction));
    };

    const onUpdate = () => {
        for (const debouncedFunction of debounceValues.values()) {
            debouncedFunction();
        }
        debounceValues.clear();
    }

    return { debounceToUpdate, onUpdate };
}