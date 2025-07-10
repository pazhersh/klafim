import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Deck, initDecks } from '../decksUtils';
import { Raycaster } from '../../useThree/raycaster';
import useDebounce from '../../useThree/useDebounceToUpdate';
import Card, { boundingBox as cardBoundingBox } from './card';

type useCardDeckProps = {
    canvasElement?: HTMLCanvasElement | null;
    raycaster?: Raycaster;
    scene: THREE.Scene;
    hoverAtMesh: THREE.Mesh;
    world: any;

    deck: Deck;
}

// TODO: move all these to other files
const flipQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
const cardThickness = cardBoundingBox.max.y;
const cardWidth = cardBoundingBox.max.z;
initDecks();
function randOffset() {
    return (0.5 - Math.random()) / 10;
}

export default function useCardDeck({ world, scene, canvasElement, raycaster, hoverAtMesh, deck }: useCardDeckProps) {
    const { debounce, bounce } = useDebounce();
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card>();

    useEffect(() => {
        const initCards = async () => {
            const newCards = await Promise.all(deck.cardValues.map(async (cardValue, cardIndex) => {
                const card = await Card.Create(scene, world, cardValue);
                card.setLocked(true);
                card.rigidBody.setTranslation({ x: randOffset(), y: (cardIndex + 1) * cardThickness, z: randOffset() });
                const randQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), randOffset());
                const rotationQuarternion = flipQuaternion.multiply(randQuaternion);
                card.rigidBody.setRotation(rotationQuarternion);
                return card;
            }));
            setCards(newCards);
        };
        if (deck && world && scene && !cards.length) {
            // console.log(deck, world, scene, !cards.length);
            initCards();
        }
    }, [deck, world, scene]);

    // "Draw" as in drawing from a deck
    function drawCard(deck) {
        if (!deck.length) {
            return;
        }

        const drawnCard = deck.pop();
        drawnCard.rigidBody.setRotation({ w: 1, x: 0, y: 0, z: 0.0 });
        drawnCard.setLocked(false);
    }

    useEffect(() => {
        if (canvasElement && raycaster) {
            canvasElement.addEventListener('mousedown', (event) => {
                if (event.button !== THREE.MOUSE.LEFT)
                    return;

                const intersection = raycaster.getPointedElement();
                const intersectedMesh = intersection?.object;
                const selectedElement = cards.find(element => element.mesh === intersectedMesh);

                if (intersection && selectedElement) {
                    if (selectedElement === cards.at(-1)) {
                        drawCard(cards.at(-1));
                    }

                    debounce(
                        () => selectedElement?.onClick?.(intersection.point),
                        ['mousedown', selectedElement]
                    )
                    setSelectedCard(selectedElement)
                }
            })
            canvasElement.addEventListener('mousemove', (event) => {
                const hoverPlaneIntersection = raycaster.getIntersectionWith(hoverAtMesh);
                debounce(
                    () => selectedCard?.onDrag?.(hoverPlaneIntersection[0].point),
                    ['mousemove', selectedCard]
                );
            })

            canvasElement.addEventListener('mouseup', (event) => {
                debounce(() => {
                    selectedCard?.onRelease?.();
                    setSelectedCard(undefined);
                }, ['mouseup', selectedCard]);
            })
        }
    }, [canvasElement, raycaster])

    return { cards };
}