import { useState } from "react";
import TextInput from "./TextInput";

type CreatableProps = {
    defaultValue?: string;
    onCreate: (value: string) => void;
}

export default function Creatable({ defaultValue, onCreate }: CreatableProps) {
    const [isEditting, setIsEditting] = useState(false);

    return !isEditting ?
        <button onClick={() => setIsEditting(true)}>new</button> :
        <TextInput
            startValue={defaultValue}
            onCancel={() => setIsEditting(false)}
            onSave={(newValue) => {
                onCreate(newValue);
                setIsEditting(false);
            }} />
}