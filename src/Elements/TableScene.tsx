import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';

import Table from '../Elements/Table';
import HoldContext from './HoldContext';
import HoldPlane from './HoldPlane';
import OrbitControls from '../Elements/OrbitControls';

type TableSceneProps = {
    children: React.ReactNode;
}

export default function TableScene({ children }: TableSceneProps) {
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
            <HoldContext.Provider>
                <Physics timeStep="vary">
                    {children}
                    <HoldPlane width={100} height={100} />
                    <Table meshProps={{ position: [0, 0, 0] }} />
                </Physics>
            </HoldContext.Provider>
        </Suspense>
    </>;
}