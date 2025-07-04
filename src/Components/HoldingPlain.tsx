import { useContext } from "react"
import { MeshProps } from "./types"
import HoldingContext from "./HoldingContext";

type HoldingPlainProps = {
    width: number,
    height: number,
    meshProps?: MeshProps,
}

export default function HoldingPlain({ width, height, meshProps }: HoldingPlainProps) {
    const { setHoldingTarget, setHeldItem } = useContext(HoldingContext);

    return <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false} {...meshProps}
        onPointerMove={(event) => {
            setHoldingTarget(event.point);
        }}
        onPointerUp={() => {
            setHoldingTarget(undefined);
            setHeldItem(undefined);
        }}
    >
        <planeGeometry args={[width, height]} />
    </mesh>
}