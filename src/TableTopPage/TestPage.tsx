import { Canvas, extend, ThreeElement, useThree } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import React, { Suspense, useMemo, useReducer, useRef } from 'react';
import Ground from '../ElementComponents/Ground';
import { TestElementComponent } from '../ElementComponents/testElementComponent';
import { TestElementComponentWithPhysics } from '../ElementComponents/testElementComponentWithPhsycs';
import styles from './TableTopPage.module.css';
import * as THREE from 'three';

import { OrbitControls } from 'three-stdlib'

extend({ OrbitControls })

declare module '@react-three/fiber' {
    interface ThreeElements {
        orbitControls: ThreeElement<typeof OrbitControls>
    }
}

const camera = new THREE.PerspectiveCamera(75);
camera.position.copy(new THREE.Vector3(0.0, 4.0, 10.0));

type CanvasWrapperProps = {
    children: React.ReactNode;
}
export default function CanvasWrapper({ children }: CanvasWrapperProps) {
    return <div className={styles.container} >
        <Canvas camera={camera}>
            <TestPage />
        </Canvas>
    </div>;
}

function TestPage() {
    const { gl } = useThree();
    const canvasElement = useMemo(() => gl.domElement, [gl]);

    return <>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {canvasElement && <orbitControls args={[camera, canvasElement]} />}

        <Suspense fallback={<TestElementComponent />}>
            <Physics timeStep="vary">
                <TestElementComponentWithPhysics />
                <Ground meshProps={{ position: [0, 0, 0] }} />
            </Physics>
        </Suspense>
    </>;
}