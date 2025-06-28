import { useState } from "react";

export default function useDebounce() {
    const [debounceValues, setDebounceValues] = useState(new Map<unknown, () => void>());

    const debounce = (inputFunction: () => void, key) => {
        setDebounceValues((currentValues) => new Map(currentValues).set(key, inputFunction));
    };

    const bounce = () => {
        for (const debouncedFunction of debounceValues.values()) {
            debouncedFunction();
        }
        debounceValues.clear();
    }

    return { debounce, bounce };
}