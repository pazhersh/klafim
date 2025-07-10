import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';

import Ground from '../Elements/Ground';
import HoldingContext from '../Elements/HoldingContext';
import HoldingPlane from '../Elements/HoldingPlane';
import OrbitControls from '../Elements/OrbitControls';

type TableTopProps = {
    children: React.ReactNode;
}

export default function TableTop({ children }: TableTopProps) {
    return <>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <OrbitControls />

        <Suspense
            fallback={<mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={'orange'} />
            </mesh>}
        >
            <HoldingContext.Provider>
                <Physics timeStep="vary">
                    {children}
                    <HoldingPlane width={100} height={100} meshProps={{ position: [0, 1.5, 0] }} />
                    <Ground meshProps={{ position: [0, 0, 0] }} />
                </Physics>
            </HoldingContext.Provider>
        </Suspense>
    </>;
}