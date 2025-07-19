import { RapierRigidBody } from "@react-three/rapier";
import { createContext, RefObject, useContext, useRef, useState } from "react";
import * as THREE from 'three';

type HoldContextProps = {
    heldItem?: RapierRigidBody;
    setHeldItem: (newValue?: RapierRigidBody) => void;
    holdTarget?: RefObject<THREE.Vector3 | undefined>;
    setHoldTarget: (target?: THREE.Vector3) => void;
    holdHeight: number;
    setHoldHeight: (height?: number) => void;
}

const HoldContext = createContext<HoldContextProps>({
    heldItem: undefined,
    holdTarget: undefined,
    holdHeight: 0,
    setHeldItem: () => { },
    setHoldTarget: () => { },
    setHoldHeight: () => { },
});

type HoldContextProviderProps = {
    children: React.ReactNode;
}

function HoldContextProvider({ children }: HoldContextProviderProps) {
    const [heldItem, setHeldItem] = useState<RapierRigidBody | undefined>(undefined);
    const [holdHeight, setHoldHeight] = useState<number>(0);
    const holdTarget = useRef<THREE.Vector3 | undefined>(undefined);

    return <HoldContext value={{
        heldItem,
        setHeldItem,
        holdTarget: holdTarget,
        setHoldTarget: (target) => {
            holdTarget.current = target;
        },
        holdHeight: holdHeight,
        setHoldHeight: (height) => {
            if (typeof height === 'number') {
                setHoldHeight(height);
            }
        },
    }}>
        {children}
    </HoldContext>
}

export default Object.assign(HoldContext, {
    Provider: HoldContextProvider
})