import { useEffect, useRef } from 'react';
import styles from './TableTopPage.module.css';
import useThree from '../useThree/useThree';

export default function TableTopPage() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { canvasElement } = useThree();

    useEffect(() => {
        console.log(canvasElement)
        canvasElement && containerRef.current?.appendChild(canvasElement);
    }, [canvasElement]);

    return <div ref={containerRef} className={styles.container}>
        test
    </div>;
}