import { extend, ThreeElement, useThree } from '@react-three/fiber'
import { MOUSE, TOUCH } from 'three'
import { OrbitControls as ThreeOrbitControls } from 'three-stdlib'

extend({ ThreeOrbitControls })

declare module '@react-three/fiber' {
    interface ThreeElements {
        threeOrbitControls: ThreeElement<typeof ThreeOrbitControls>
    }
}

export default function OrbitControls(props: Partial<ThreeElement<typeof ThreeOrbitControls>>) {
    const { gl, camera } = useThree();
    return <threeOrbitControls
        args={[camera, gl.domElement]}
        mouseButtons={{
            LEFT: undefined,
            MIDDLE: MOUSE.PAN,
            RIGHT: MOUSE.ROTATE,
        }}
        touches={{
            ONE: undefined,
            TWO: TOUCH.DOLLY_PAN,
        }}
        {...props}
    />
}