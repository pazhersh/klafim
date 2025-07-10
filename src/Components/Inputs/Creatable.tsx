import { useState } from "react";
import TextInput from "./TextInput";

type CreatableProps = {
    onCreate: (value: string) => void;
}

export default function Creatable({ onCreate }: CreatableProps) {
    const [isEditting, setIsEditting] = useState(false);

    return !isEditting ?
        <button onClick={() => setIsEditting(true)}>new</button> :
        <TextInput
            onCancel={() => setIsEditting(false)}
            onSave={(newValue) => {
                onCreate(newValue);
                setIsEditting(false);
            }} />
}