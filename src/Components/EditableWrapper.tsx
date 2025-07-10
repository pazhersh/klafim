import { useState } from "react";

type EditableWrapperProps = {
    value: string;
    onEdit?: (newValue) => void;
    onDelete?: () => void;
};

export default function EditableWrapper({ value, onEdit, onDelete }: EditableWrapperProps) {
    const [isEditting, setIsEditting] = useState(false);

    return isEditting ?
        <EditValue startValue={value} onCancel={() => setIsEditting(false)} onSave={onEdit} /> :
        <DisplayValue value={value} onDelete={onDelete} onEnterEdit={!!onEdit ? () => setIsEditting(true) : undefined} />;
};

type DisplayValueProps = {
    value: string;
    onEnterEdit?: () => void;
    onDelete?: () => void;
}

function DisplayValue({ value, onEnterEdit, onDelete }: DisplayValueProps) {
    return <div>
        {onDelete && <button onClick={() => onDelete()}>X</button>}
        {value}
        {onEnterEdit && <button onClick={() => onEnterEdit()}>edit</button>}
    </div>
}

type EditValueProps = {
    startValue: string;
    onCancel: () => void;
    onSave?: (value: string) => void;
}

function EditValue({ startValue, onSave, onCancel }: EditValueProps) {
    const [value, setValue] = useState(startValue);

    return <div>
        <input type="text" value={value} onChange={(event) => setValue(event.target.value)} />
        <button onClick={() => onSave?.(value)} disabled={!!onSave}>save</button>
        <button onClick={() => onCancel()}>cancel</button>
    </div>
}