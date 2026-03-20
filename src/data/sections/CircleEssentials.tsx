/**
 * Section 1: Circle Essentials
 *
 * Interactive introduction to circle parts using a "draw your own" approach.
 * Students drag points to create radius, chord, and diameter.
 */

import { type ReactElement, useCallback } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableH2,
    EditableParagraph,
    InlineLinkedHighlight,
    InlineClozeChoice,
    InlineFeedback,
    Cartesian2D,
    InteractionHintSequence,
    TriggeredHintOverlay,
} from "@/components/atoms";
import {
    getVariableInfo,
    choicePropsFromDefinition,
    linkedHighlightPropsFromDefinition,
} from "../variables";
import { useVar, useSetVar } from "@/stores";

// ─────────────────────────────────────────────────────────────────────────────
// Reactive Visualization: Draw Your Own Circle Parts
// ─────────────────────────────────────────────────────────────────────────────

function DrawCirclePartsVisualization() {
    const setVar = useSetVar();
    const activeHighlight = useVar('circleHighlight', '') as string;

    const RADIUS = 3;
    const CENTER: [number, number] = [0, 0];

    // Colors for different parts
    const colors = {
        circle: '#94a3b8',
        centre: '#F7B23B',
        radius: '#62D0AD',
        diameter: '#8E90F5',
        chord: '#AC8BF9',
        arc: '#F8A0CD',
        circumference: '#62CCF9',
    };

    // Get opacity based on highlight state
    const getOpacity = useCallback((partId: string) => {
        if (!activeHighlight) return 1;
        return activeHighlight === partId ? 1 : 0.2;
    }, [activeHighlight]);

    // Constrain point to circle
    const constrainToCircle = useCallback((point: [number, number]): [number, number] => {
        const angle = Math.atan2(point[1], point[0]);
        return [RADIUS * Math.cos(angle), RADIUS * Math.sin(angle)];
    }, []);

    // Dynamic plots based on movable points
    const dynamicPlots = useCallback((points: [number, number][]) => {
        const radiusEnd = points[0] || [RADIUS, 0];
        const chordStart = points[1] || [RADIUS * Math.cos(Math.PI * 0.7), RADIUS * Math.sin(Math.PI * 0.7)];
        const chordEnd = points[2] || [RADIUS * Math.cos(-Math.PI * 0.3), RADIUS * Math.sin(-Math.PI * 0.3)];

        // Calculate diameter endpoint (opposite side of radius)
        const radiusAngle = Math.atan2(radiusEnd[1], radiusEnd[0]);
        const diameterEnd: [number, number] = [
            RADIUS * Math.cos(radiusAngle + Math.PI),
            RADIUS * Math.sin(radiusAngle + Math.PI)
        ];

        // Calculate arc angle for chord
        const chordStartAngle = Math.atan2(chordStart[1], chordStart[0]);
        const chordEndAngle = Math.atan2(chordEnd[1], chordEnd[0]);

        return [
            // Main circle
            {
                type: "circle" as const,
                center: CENTER,
                radius: RADIUS,
                color: colors.circumference,
                fillOpacity: 0.05,
                highlightId: 'circumference',
            },
            // Centre point
            {
                type: "point" as const,
                x: 0,
                y: 0,
                color: colors.centre,
                highlightId: 'centre',
            },
            // Radius line
            {
                type: "segment" as const,
                point1: CENTER,
                point2: radiusEnd,
                color: colors.radius,
                weight: 3,
                highlightId: 'radius',
            },
            // Diameter line (full)
            {
                type: "segment" as const,
                point1: diameterEnd,
                point2: radiusEnd,
                color: colors.diameter,
                weight: 2,
                style: "dashed" as const,
                highlightId: 'diameter',
            },
            // Chord line
            {
                type: "segment" as const,
                point1: chordStart,
                point2: chordEnd,
                color: colors.chord,
                weight: 3,
                highlightId: 'chord',
            },
            // Arc (parametric curve between chord endpoints)
            {
                type: "parametric" as const,
                xy: (t: number): [number, number] => {
                    // Interpolate angle for the minor arc
                    let startA = chordStartAngle;
                    let endA = chordEndAngle;
                    // Ensure we go the shorter way
                    if (endA < startA) endA += 2 * Math.PI;
                    if (endA - startA > Math.PI) {
                        startA += 2 * Math.PI;
                        [startA, endA] = [endA, startA];
                    }
                    const angle = startA + t * (endA - startA);
                    return [RADIUS * Math.cos(angle), RADIUS * Math.sin(angle)];
                },
                tRange: [0, 1] as [number, number],
                color: colors.arc,
                weight: 4,
                highlightId: 'arc',
            },
        ];
    }, [colors, getOpacity]);

    return (
        <div className="relative">
            <Cartesian2D
                height={380}
                viewBox={{ x: [-4.5, 4.5], y: [-4.5, 4.5] }}
                showGrid={false}
                highlightVarName="circleHighlight"
                movablePoints={[
                    {
                        initial: [RADIUS, 0],
                        color: colors.radius,
                        constrain: constrainToCircle,
                    },
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 0.7), RADIUS * Math.sin(Math.PI * 0.7)],
                        color: colors.chord,
                        constrain: constrainToCircle,
                    },
                    {
                        initial: [RADIUS * Math.cos(-Math.PI * 0.3), RADIUS * Math.sin(-Math.PI * 0.3)],
                        color: colors.chord,
                        constrain: constrainToCircle,
                    },
                ]}
                dynamicPlots={dynamicPlots}
            />
            <InteractionHintSequence
                hintKey="circle-essentials-drag"
                steps={[
                    {
                        gesture: "drag-circular",
                        label: "Drag the teal point around the circle to move the radius",
                        position: { x: "75%", y: "50%" },
                        dragPath: { type: "arc", startAngle: 0, endAngle: 60, radius: 35 },
                    },
                ]}
            />
            {/* Triggered hint overlays for feedback-guided discovery */}
            <TriggeredHintOverlay hintKey="feedback-radius-hint" color="#62D0AD" />
            <TriggeredHintOverlay hintKey="feedback-diameter-hint" color="#8E90F5" />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Blocks
// ─────────────────────────────────────────────────────────────────────────────

export const circleEssentialsBlocks: ReactElement[] = [
    // Title
    <StackLayout key="layout-essentials-title" maxWidth="xl">
        <Block id="essentials-title" padding="lg">
            <EditableH1 id="h1-essentials-title" blockId="essentials-title">
                Circle Theorems
            </EditableH1>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-essentials-intro" maxWidth="xl">
        <Block id="essentials-intro" padding="sm">
            <EditableParagraph id="para-essentials-intro" blockId="essentials-intro">
                Here's something surprising: no matter where you place a point on a circle's edge and draw lines to both ends of a diameter, you'll always create a perfect right angle. Always. This isn't a coincidence. It's one of several beautiful patterns hidden in circles that mathematicians have known for over two thousand years. In this lesson, you'll discover these patterns yourself by dragging points around circles and watching the angles change. Or rather, watching some angles stubbornly refuse to change.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Section heading
    <StackLayout key="layout-essentials-heading" maxWidth="xl">
        <Block id="essentials-heading" padding="md">
            <EditableH2 id="h2-essentials-heading" blockId="essentials-heading">
                The Parts of a Circle
            </EditableH2>
        </Block>
    </StackLayout>,

    // Explanation with vocabulary
    <StackLayout key="layout-essentials-vocab-intro" maxWidth="xl">
        <Block id="essentials-vocab-intro" padding="sm">
            <EditableParagraph id="para-essentials-vocab-intro" blockId="essentials-vocab-intro">
                Before we can explore circle theorems, we need to know the names of the parts we'll be working with. The diagram on the right is interactive. Drag the coloured points around and watch how the different parts move. Hover over any term below to see it highlighted on the diagram.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive diagram with vocabulary
    <SplitLayout key="layout-essentials-diagram" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="essentials-vocab-centre" padding="sm">
                <EditableParagraph id="para-essentials-vocab-centre" blockId="essentials-vocab-centre">
                    The{" "}
                    <InlineLinkedHighlight
                        varName="circleHighlight"
                        highlightId="centre"
                        color="#F7B23B"
                        bgColor="rgba(247, 178, 59, 0.15)"
                    >
                        centre
                    </InlineLinkedHighlight>{" "}
                    is the fixed point at the heart of every circle. Every point on the circle is exactly the same distance from it.
                </EditableParagraph>
            </Block>
            <Block id="essentials-vocab-radius" padding="sm">
                <EditableParagraph id="para-essentials-vocab-radius" blockId="essentials-vocab-radius">
                    The{" "}
                    <InlineLinkedHighlight
                        varName="circleHighlight"
                        highlightId="radius"
                        color="#62D0AD"
                        bgColor="rgba(98, 208, 173, 0.15)"
                    >
                        radius
                    </InlineLinkedHighlight>{" "}
                    is a line segment from the centre to any point on the circle's edge. Drag the teal point to see the radius rotate around the centre.
                </EditableParagraph>
            </Block>
            <Block id="essentials-vocab-diameter" padding="sm">
                <EditableParagraph id="para-essentials-vocab-diameter" blockId="essentials-vocab-diameter">
                    The{" "}
                    <InlineLinkedHighlight
                        varName="circleHighlight"
                        highlightId="diameter"
                        color="#8E90F5"
                        bgColor="rgba(142, 144, 245, 0.15)"
                    >
                        diameter
                    </InlineLinkedHighlight>{" "}
                    passes straight through the centre, connecting two opposite points on the circle. Notice it's always exactly twice the length of the radius.
                </EditableParagraph>
            </Block>
            <Block id="essentials-vocab-chord" padding="sm">
                <EditableParagraph id="para-essentials-vocab-chord" blockId="essentials-vocab-chord">
                    A{" "}
                    <InlineLinkedHighlight
                        varName="circleHighlight"
                        highlightId="chord"
                        color="#AC8BF9"
                        bgColor="rgba(172, 139, 249, 0.15)"
                    >
                        chord
                    </InlineLinkedHighlight>{" "}
                    is any straight line connecting two points on the circle. It doesn't have to pass through the centre. Drag the two violet points to reshape the chord.
                </EditableParagraph>
            </Block>
            <Block id="essentials-vocab-arc" padding="sm">
                <EditableParagraph id="para-essentials-vocab-arc" blockId="essentials-vocab-arc">
                    An{" "}
                    <InlineLinkedHighlight
                        varName="circleHighlight"
                        highlightId="arc"
                        color="#F8A0CD"
                        bgColor="rgba(248, 160, 205, 0.15)"
                    >
                        arc
                    </InlineLinkedHighlight>{" "}
                    is a curved section of the circle's edge. The highlighted arc is the portion between the two chord endpoints.
                </EditableParagraph>
            </Block>
            <Block id="essentials-vocab-circumference" padding="sm">
                <EditableParagraph id="para-essentials-vocab-circumference" blockId="essentials-vocab-circumference">
                    The{" "}
                    <InlineLinkedHighlight
                        varName="circleHighlight"
                        highlightId="circumference"
                        color="#62CCF9"
                        bgColor="rgba(98, 204, 249, 0.15)"
                    >
                        circumference
                    </InlineLinkedHighlight>{" "}
                    is the complete outer boundary of the circle. It represents the total distance around it.
                </EditableParagraph>
            </Block>
        </div>
        <Block id="essentials-diagram-viz" padding="sm" hasVisualization>
            <DrawCirclePartsVisualization />
        </Block>
    </SplitLayout>,

    // Quick check heading
    <StackLayout key="layout-essentials-check-heading" maxWidth="xl">
        <Block id="essentials-check-heading" padding="md">
            <EditableH2 id="h2-essentials-check-heading" blockId="essentials-check-heading">
                Quick Check
            </EditableH2>
        </Block>
    </StackLayout>,

    // Question 1
    <StackLayout key="layout-essentials-question-radius" maxWidth="xl">
        <Block id="essentials-question-radius" padding="sm">
            <EditableParagraph id="para-essentials-question-radius" blockId="essentials-question-radius">
                A radius of a circle connects{" "}
                <InlineFeedback
                    varName="answerRadiusDefinition"
                    correctValue="centre to edge"
                    position="terminal"
                    successMessage="That's right!"
                    failureMessage="Not quite"
                    hint="Let's explore the diagram!"
                    reviewBlockId="essentials-vocab-radius"
                    reviewLabel="Review the radius definition"
                    visualizationHint={{
                        blockId: "essentials-diagram-viz",
                        hintKey: "feedback-radius-hint",
                        label: "Discover it yourself",
                        resetVars: { circleHighlight: '' },
                        steps: [
                            {
                                gesture: "drag-circular",
                                label: "Drag the teal point on the circle's edge",
                                position: { x: "75%", y: "50%" },
                            },
                            {
                                gesture: "drag-circular",
                                label: "Notice the teal line always stays connected to the orange centre",
                                position: { x: "50%", y: "50%" },
                            },
                            {
                                gesture: "click",
                                label: "A radius always connects the centre to the edge!",
                                position: { x: "62%", y: "50%" },
                            },
                        ],
                    }}
                >
                    <InlineClozeChoice
                        varName="answerRadiusDefinition"
                        correctAnswer="centre to edge"
                        options={["edge to edge", "centre to edge", "around the circle"]}
                        {...choicePropsFromDefinition(getVariableInfo('answerRadiusDefinition'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Question 2
    <StackLayout key="layout-essentials-question-chord" maxWidth="xl">
        <Block id="essentials-question-chord" padding="sm">
            <EditableParagraph id="para-essentials-question-chord" blockId="essentials-question-chord">
                The longest possible chord in a circle is{" "}
                <InlineFeedback
                    varName="answerChordVsDiameter"
                    correctValue="the diameter"
                    position="terminal"
                    successMessage="Exactly! The diameter is the special chord that passes through the centre"
                    failureMessage="Not quite"
                    hint="Let's explore!"
                    reviewBlockId="essentials-vocab-diameter"
                    reviewLabel="Review the diameter"
                    visualizationHint={{
                        blockId: "essentials-diagram-viz",
                        hintKey: "feedback-diameter-hint",
                        label: "Discover it yourself",
                        resetVars: { circleHighlight: '' },
                        steps: [
                            {
                                gesture: "drag-circular",
                                label: "Drag one of the purple chord points around the circle",
                                position: { x: "22%", y: "72%" },
                            },
                            {
                                gesture: "drag-circular",
                                label: "Keep dragging until the chord passes through the orange centre",
                                position: { x: "50%", y: "50%" },
                            },
                            {
                                gesture: "click",
                                label: "When a chord goes through the centre, it's called a diameter. That's the longest possible chord!",
                                position: { x: "50%", y: "50%" },
                            },
                        ],
                    }}
                >
                    <InlineClozeChoice
                        varName="answerChordVsDiameter"
                        correctAnswer="the diameter"
                        options={["any chord", "the diameter", "the radius"]}
                        {...choicePropsFromDefinition(getVariableInfo('answerChordVsDiameter'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
