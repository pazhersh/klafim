import { RapierRigidBody } from "@react-three/rapier";
import { createContext, RefObject, useContext, useRef, useState } from "react";
import * as THREE from 'three';

type HoldingContextProps = {
    heldItem?: RapierRigidBody;
    setHeldItem: (newValue?: RapierRigidBody) => void;
    holdingTarget?: RefObject<THREE.Vector3 | undefined>;
    setHoldingTarget: (target?: THREE.Vector3) => void;
}

const HoldingContext = createContext<HoldingContextProps>({
    heldItem: undefined,
    holdingTarget: undefined,
    setHeldItem: () => { },
    setHoldingTarget: () => { }
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
        holdingTarget: holdingTarget,
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