import { useId } from 'react';
import styles from './FileUpload.module.css';

type FileUploadProps = {
    onUpload?: (files: File[]) => void;
}
export default function FileUpload({ onUpload }: FileUploadProps) {
    const id = useId();

    return <label
        htmlFor={id}
        className={styles.container}
        onDragOver={event => event.preventDefault()}
        onDrop={(event) => {
            event.preventDefault();
            const files = [...event.dataTransfer.items]
                .map(item => item.getAsFile())
                .filter(file => file !== null);
            onUpload?.(files);
        }}
    >
        <input
            id={id}
            className={styles.upload}
            type='file' onChange={event => {
                const fileList = event.target.files;
                const files: File[] = [];
                for (let i = 0; i < (fileList?.length ?? 0); i++) {
                    const file = fileList?.item(i);
                    if (file) {
                        files.push(file);
                    }
                }
                onUpload?.(files);
            }}
        />
        <div className={styles.label}>
            Click or drag an excel file to upload
        </div>
    </label>
}