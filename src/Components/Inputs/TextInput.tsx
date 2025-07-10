import { useState } from "react";


type TextInputProps = {
    startValue?: string;
    onCancel: () => void;
    onSave?: (value: string) => void;
}

export default function TextInput({ startValue = '', onSave, onCancel }: TextInputProps) {
    const [value, setValue] = useState(startValue);

    return <div>
        <input type="text" value={value} onChange={(event) => setValue(event.target.value)} />
        <button onClick={() => onSave?.(value)} disabled={!onSave}>save</button>
        <button onClick={() => onCancel()}>cancel</button>
    </div>
}