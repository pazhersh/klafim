import { useState } from "react";
import TextInput from "./TextInput";

type EditableWrapperProps = {
    value: string;
    onEdit?: (newValue) => void;
    onDelete?: () => void;
};

export default function EditableWrapper({ value, onEdit, onDelete }: EditableWrapperProps) {
    const [isEditting, setIsEditting] = useState(false);

    return !isEditting ? <div>
        {value}
        {onEdit && <button onClick={() => setIsEditting(true)}>edit</button>}
        {onDelete && <button onClick={() => {
            const userConfirmed = window.confirm(`Delete "${value}"?`);
            if (userConfirmed) onDelete();
        }}>delete</button>}
    </div> :
        <TextInput
            startValue={value}
            onCancel={() => setIsEditting(false)}
            onSave={!!onEdit ? (newValue) => {
                onEdit(newValue);
                setIsEditting(false);
            } : undefined}
        />;
};