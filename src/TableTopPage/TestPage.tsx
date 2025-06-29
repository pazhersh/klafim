import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './TableTopPage.module.css';
import useThree from '../useThree/useThree';
import useOrbitControls from '../useThree/useOrbitControls';
import useLightSource from '../useThree/useLightSource';
import Ground from '../elements/ground';
import * as THREE from 'three';
import { Element } from '../elements/types';
import useCardDeck from '../elements/useCardDeck';
import { Canvas } from '@react-three/fiber';
import { TestElementComponent } from '../ElementComponents/testElementComponent';

export default function TestPage() {
    return <div className={styles.container} >
        <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <TestElementComponent />
        </Canvas>
    </div>;
}