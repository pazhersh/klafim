import { RapierRigidBody } from "@react-three/rapier";
import { createContext, useContext, useRef, useState } from "react";
import * as THREE from 'three';

type HoldingContextProps = {
    heldItem?: RapierRigidBody;
    setHeldItem: (newValue?: RapierRigidBody) => void;
    holdingTarget?: THREE.Vector3;
    setHoldingTarget?: (target: THREE.Vector3) => void;
}

const HoldingContext = createContext<HoldingContextProps>({
    heldItem: undefined,
    holdingTarget: undefined,
    setHeldItem: () => { }
});

type HoldingContextProviderProps = {
    children: React.ReactNode;
}

function HoldingContextProvider({ children }: HoldingContextProviderProps) {
    const [heldItem, setHeldItem] = useState<RapierRigidBody | undefined>(undefined);
    const holdingTarget = useRef<THREE.Vector3 | undefined>(undefined);

    return <HoldingContext value={{
        heldItem,
        setHeldItem,
        holdingTarget: holdingTarget.current,
        setHoldingTarget: (target) => {
            holdingTarget.current = target;
        },
    }}>
        {children}
    </HoldingContext>
}

export default Object.assign(HoldingContext, {
    Provider: HoldingContextProvider
})