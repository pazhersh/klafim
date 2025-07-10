import { Suspense } from 'react';

import OrbitControls from './OrbitControls';

type TableTopProps = {
    children?: React.ReactNode;
}

export default function TableScene({ children }: TableTopProps) {
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
            {children}
        </Suspense>
    </>;
}