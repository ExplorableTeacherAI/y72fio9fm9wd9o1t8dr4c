/**
 * Section 2: Inscribed Angles
 *
 * Introduction to inscribed angles with multiple angles on the same arc.
 * Students drag points and see that all angles subtending the same arc are equal.
 */

import { type ReactElement, useCallback, useState, useEffect } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineTooltip,
    InlineClozeChoice,
    InlineFeedback,
    InlineScrubbleNumber,
    Cartesian2D,
    InteractionHintSequence,
} from "@/components/atoms";
import {
    getVariableInfo,
    choicePropsFromDefinition,
    numberPropsFromDefinition,
} from "../variables";
import { useVar, useSetVar } from "@/stores";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Calculate angle at vertex from two points
// ─────────────────────────────────────────────────────────────────────────────

interface AngleInfo {
    degrees: number;
    startAngle: number; // radians, direction to point1
    endAngle: number;   // radians, direction to point2
}

function calculateInscribedAngleInfo(
    vertex: [number, number],
    point1: [number, number],
    point2: [number, number]
): AngleInfo {
    // Vectors from vertex to each point
    const v1 = [point1[0] - vertex[0], point1[1] - vertex[1]];
    const v2 = [point2[0] - vertex[0], point2[1] - vertex[1]];

    // Angles of each vector (direction from vertex)
    const angle1 = Math.atan2(v1[1], v1[0]);
    const angle2 = Math.atan2(v2[1], v2[0]);

    // Dot product and magnitudes for the angle between them
    const dot = v1[0] * v2[0] + v1[1] * v2[1];
    const mag1 = Math.hypot(v1[0], v1[1]);
    const mag2 = Math.hypot(v2[0], v2[1]);

    if (mag1 === 0 || mag2 === 0) return { degrees: 0, startAngle: 0, endAngle: 0 };

    const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    const degrees = Math.round(Math.acos(cosAngle) * (180 / Math.PI));

    return { degrees, startAngle: angle1, endAngle: angle2 };
}

// Helper to create angle arc parametric function
function createAngleArc(
    vertex: [number, number],
    startAngle: number,
    endAngle: number,
    radius: number
): (t: number) => [number, number] {
    // Ensure we go the shorter way around
    let start = startAngle;
    let end = endAngle;

    // Normalize angles
    while (end - start > Math.PI) end -= 2 * Math.PI;
    while (start - end > Math.PI) start -= 2 * Math.PI;

    return (t: number): [number, number] => {
        const angle = start + t * (end - start);
        return [
            vertex[0] + radius * Math.cos(angle),
            vertex[1] + radius * Math.sin(angle)
        ];
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Reactive Visualization: Multiple Inscribed Angles
// ─────────────────────────────────────────────────────────────────────────────

function MultipleInscribedAnglesVisualization() {
    const setVar = useSetVar();
    const RADIUS = 3;

    // ViewBox settings for coordinate conversion
    const VIEW_BOX = { x: [-4.5, 4.5] as [number, number], y: [-4.5, 4.5] as [number, number] };
    const HEIGHT = 380;

    // Fixed arc endpoints (chord)
    const arcStart: [number, number] = [
        RADIUS * Math.cos(Math.PI * 1.2),
        RADIUS * Math.sin(Math.PI * 1.2)
    ];
    const arcEnd: [number, number] = [
        RADIUS * Math.cos(-Math.PI * 0.2),
        RADIUS * Math.sin(-Math.PI * 0.2)
    ];

    // Track angles and label positions for display
    const [angles, setAngles] = useState<[number, number, number]>([45, 45, 45]);
    const [labelPositions, setLabelPositions] = useState<[[number, number], [number, number], [number, number]]>([
        [0, 0], [0, 0], [0, 0]
    ]);

    // Constrain points to the major arc (upper portion)
    const constrainToMajorArc = useCallback((point: [number, number]): [number, number] => {
        let angle = Math.atan2(point[1], point[0]);
        // Major arc is roughly from -0.2π to 1.2π going counterclockwise through the top
        // Constrain to the upper arc (between the chord endpoints, on the opposite side)
        const minAngle = -Math.PI * 0.15;
        const maxAngle = Math.PI * 1.15;

        if (angle < minAngle) angle = minAngle;
        if (angle > maxAngle) angle = maxAngle;
        // Keep in the upper region
        if (angle > -Math.PI * 0.2 && angle < Math.PI * 0.3) {
            angle = Math.PI * 0.3;
        }
        if (angle < Math.PI * 1.2 && angle > Math.PI * 0.7) {
            // This is fine
        }

        return [RADIUS * Math.cos(angle), RADIUS * Math.sin(angle)];
    }, []);

    // Colors
    const colors = {
        chord: '#94a3b8',
        point1: '#62D0AD',
        point2: '#8E90F5',
        point3: '#AC8BF9',
        arc: '#F8A0CD',
    };

    // Radius for the angle arc indicator
    const ANGLE_ARC_RADIUS = 0.5;

    // Calculate label position along the angle bisector
    const getLabelPosition = (
        vertex: [number, number],
        startAngle: number,
        endAngle: number,
        offset: number
    ): [number, number] => {
        // Normalize angles to get the bisector
        let start = startAngle;
        let end = endAngle;
        while (end - start > Math.PI) end -= 2 * Math.PI;
        while (start - end > Math.PI) start -= 2 * Math.PI;

        const bisector = (start + end) / 2;
        return [
            vertex[0] + offset * Math.cos(bisector),
            vertex[1] + offset * Math.sin(bisector)
        ];
    };

    // Dynamic plots
    const dynamicPlots = useCallback((points: [number, number][]) => {
        const p1 = points[0] || [RADIUS * Math.cos(Math.PI * 0.8), RADIUS * Math.sin(Math.PI * 0.8)];
        const p2 = points[1] || [RADIUS * Math.cos(Math.PI * 0.55), RADIUS * Math.sin(Math.PI * 0.55)];
        const p3 = points[2] || [RADIUS * Math.cos(Math.PI * 0.35), RADIUS * Math.sin(Math.PI * 0.35)];

        // Calculate angles with direction info
        const angleInfo1 = calculateInscribedAngleInfo(p1, arcStart, arcEnd);
        const angleInfo2 = calculateInscribedAngleInfo(p2, arcStart, arcEnd);
        const angleInfo3 = calculateInscribedAngleInfo(p3, arcStart, arcEnd);

        // Update state (will be used for display)
        if (angleInfo1.degrees !== angles[0] || angleInfo2.degrees !== angles[1] || angleInfo3.degrees !== angles[2]) {
            setAngles([angleInfo1.degrees, angleInfo2.degrees, angleInfo3.degrees]);
            setVar('inscribedAngle1', angleInfo1.degrees);
            setVar('inscribedAngle2', angleInfo2.degrees);
            setVar('inscribedAngle3', angleInfo3.degrees);
        }

        // Calculate label positions along bisector, further out from the arc
        const label1Pos = getLabelPosition(p1, angleInfo1.startAngle, angleInfo1.endAngle, ANGLE_ARC_RADIUS + 0.5);
        const label2Pos = getLabelPosition(p2, angleInfo2.startAngle, angleInfo2.endAngle, ANGLE_ARC_RADIUS + 0.5);
        const label3Pos = getLabelPosition(p3, angleInfo3.startAngle, angleInfo3.endAngle, ANGLE_ARC_RADIUS + 0.5);

        // Update label positions for overlay rendering
        setLabelPositions([label1Pos, label2Pos, label3Pos]);

        return [
            // Main circle
            {
                type: "circle" as const,
                center: [0, 0] as [number, number],
                radius: RADIUS,
                color: '#e2e8f0',
                fillOpacity: 0.05,
            },
            // Chord (arc endpoints)
            {
                type: "segment" as const,
                point1: arcStart,
                point2: arcEnd,
                color: colors.chord,
                weight: 3,
            },
            // Arc endpoints
            {
                type: "point" as const,
                x: arcStart[0],
                y: arcStart[1],
                color: colors.chord,
            },
            {
                type: "point" as const,
                x: arcEnd[0],
                y: arcEnd[1],
                color: colors.chord,
            },
            // Lines from point 1 to arc endpoints
            {
                type: "segment" as const,
                point1: p1,
                point2: arcStart,
                color: colors.point1,
                weight: 2,
            },
            {
                type: "segment" as const,
                point1: p1,
                point2: arcEnd,
                color: colors.point1,
                weight: 2,
            },
            // Lines from point 2 to arc endpoints
            {
                type: "segment" as const,
                point1: p2,
                point2: arcStart,
                color: colors.point2,
                weight: 2,
            },
            {
                type: "segment" as const,
                point1: p2,
                point2: arcEnd,
                color: colors.point2,
                weight: 2,
            },
            // Lines from point 3 to arc endpoints
            {
                type: "segment" as const,
                point1: p3,
                point2: arcStart,
                color: colors.point3,
                weight: 2,
            },
            {
                type: "segment" as const,
                point1: p3,
                point2: arcEnd,
                color: colors.point3,
                weight: 2,
            },
            // Highlighted arc between chord endpoints
            {
                type: "parametric" as const,
                xy: (t: number): [number, number] => {
                    const startAngle = Math.atan2(arcStart[1], arcStart[0]);
                    let endAngle = Math.atan2(arcEnd[1], arcEnd[0]);
                    if (endAngle > startAngle) endAngle -= 2 * Math.PI;
                    const angle = startAngle + t * (endAngle - startAngle);
                    return [RADIUS * Math.cos(angle), RADIUS * Math.sin(angle)];
                },
                tRange: [0, 1] as [number, number],
                color: colors.arc,
                weight: 4,
            },
            // Angle arc 1 (curved arc indicator at vertex)
            {
                type: "parametric" as const,
                xy: createAngleArc(p1, angleInfo1.startAngle, angleInfo1.endAngle, ANGLE_ARC_RADIUS),
                tRange: [0, 1] as [number, number],
                color: colors.point1,
                weight: 2.5,
            },
            // Angle arc 2
            {
                type: "parametric" as const,
                xy: createAngleArc(p2, angleInfo2.startAngle, angleInfo2.endAngle, ANGLE_ARC_RADIUS),
                tRange: [0, 1] as [number, number],
                color: colors.point2,
                weight: 2.5,
            },
            // Angle arc 3
            {
                type: "parametric" as const,
                xy: createAngleArc(p3, angleInfo3.startAngle, angleInfo3.endAngle, ANGLE_ARC_RADIUS),
                tRange: [0, 1] as [number, number],
                color: colors.point3,
                weight: 2.5,
            },
        ];
    }, [angles, colors, setVar, arcStart, arcEnd, ANGLE_ARC_RADIUS]);

    // Convert math coordinates to percentage position for CSS overlay
    const mathToPercent = (mathPos: [number, number]): { left: string; top: string } => {
        const [xMin, xMax] = VIEW_BOX.x;
        const [yMin, yMax] = VIEW_BOX.y;
        const leftPercent = ((mathPos[0] - xMin) / (xMax - xMin)) * 100;
        const topPercent = ((yMax - mathPos[1]) / (yMax - yMin)) * 100; // Y is inverted
        return { left: `${leftPercent}%`, top: `${topPercent}%` };
    };

    return (
        <div className="relative">
            <Cartesian2D
                height={HEIGHT}
                viewBox={VIEW_BOX}
                showGrid={false}
                movablePoints={[
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 0.85), RADIUS * Math.sin(Math.PI * 0.85)],
                        color: colors.point1,
                        constrain: constrainToMajorArc,
                    },
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 0.55), RADIUS * Math.sin(Math.PI * 0.55)],
                        color: colors.point2,
                        constrain: constrainToMajorArc,
                    },
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 0.3), RADIUS * Math.sin(Math.PI * 0.3)],
                        color: colors.point3,
                        constrain: constrainToMajorArc,
                    },
                ]}
                dynamicPlots={dynamicPlots}
            />
            {/* Angle labels overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ height: HEIGHT }}
            >
                <span
                    className="absolute text-sm font-semibold -translate-x-1/2 -translate-y-1/2"
                    style={{ ...mathToPercent(labelPositions[0]), color: colors.point1 }}
                >
                    {angles[0]}°
                </span>
                <span
                    className="absolute text-sm font-semibold -translate-x-1/2 -translate-y-1/2"
                    style={{ ...mathToPercent(labelPositions[1]), color: colors.point2 }}
                >
                    {angles[1]}°
                </span>
                <span
                    className="absolute text-sm font-semibold -translate-x-1/2 -translate-y-1/2"
                    style={{ ...mathToPercent(labelPositions[2]), color: colors.point3 }}
                >
                    {angles[2]}°
                </span>
            </div>
            <InteractionHintSequence
                hintKey="inscribed-angles-drag"
                steps={[
                    {
                        gesture: "drag-circular",
                        label: "Drag any coloured point along the arc",
                        position: { x: "40%", y: "25%" },
                        dragPath: { type: "arc", startAngle: 135, endAngle: 60, radius: 30 },
                    },
                ]}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Blocks
// ─────────────────────────────────────────────────────────────────────────────

export const inscribedAnglesBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-inscribed-heading" maxWidth="xl">
        <Block id="inscribed-heading" padding="lg">
            <EditableH2 id="h2-inscribed-heading" blockId="inscribed-heading">
                Inscribed Angles
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction to inscribed angles
    <StackLayout key="layout-inscribed-intro" maxWidth="xl">
        <Block id="inscribed-intro" padding="sm">
            <EditableParagraph id="para-inscribed-intro" blockId="inscribed-intro">
                An{" "}
                <InlineTooltip
                    id="tooltip-inscribed-angle"
                    tooltip="An angle formed by two chords that meet at a point on the circle's circumference"
                >
                    inscribed angle
                </InlineTooltip>{" "}
                is formed when two lines are drawn from a point on the circle to two other points on the circle. The vertex of the angle sits right on the circumference, not at the centre. This might seem like a small detail, but it leads to some remarkable patterns.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Key concept: the arc
    <StackLayout key="layout-inscribed-arc-concept" maxWidth="xl">
        <Block id="inscribed-arc-concept" padding="sm">
            <EditableParagraph id="para-inscribed-arc-concept" blockId="inscribed-arc-concept">
                Every inscribed angle "looks at" a particular{" "}
                <InlineTooltip
                    id="tooltip-subtended-arc"
                    tooltip="The arc that lies between the two endpoints where the angle's sides meet the circle"
                >
                    arc
                </InlineTooltip>{" "}
                — the curved portion of the circle between its two sides. In the diagram below, the pink arc is the arc that all three angles are looking at. The grey line connecting the arc's endpoints is called the chord.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive visualization
    <SplitLayout key="layout-inscribed-visualization" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="inscribed-explore-prompt" padding="sm">
                <EditableParagraph id="para-inscribed-explore-prompt" blockId="inscribed-explore-prompt">
                    There are three points on the upper arc, each forming an inscribed angle to the same chord. Drag any of the coloured points along the arc and watch what happens to the angle measurements in the top-right corner.
                </EditableParagraph>
            </Block>
            <Block id="inscribed-discovery" padding="sm">
                <EditableParagraph id="para-inscribed-discovery" blockId="inscribed-discovery">
                    Notice something remarkable? No matter where you drag the points, all three angles stay equal to each other. Move them far apart, cluster them together — the angles remain the same. This is your first glimpse of a circle theorem: angles that "look at" the same arc are always equal.
                </EditableParagraph>
            </Block>
            <Block id="inscribed-why-matters" padding="sm">
                <EditableParagraph id="para-inscribed-why-matters" blockId="inscribed-why-matters">
                    Why does this happen? The answer lies in how the circle constrains the geometry. When you change the position of the vertex along the arc, you're simultaneously changing both sides of the angle in a way that perfectly balances out. We'll explore why this works when we look at the relationship between inscribed angles and centre angles.
                </EditableParagraph>
            </Block>
        </div>
        <Block id="inscribed-diagram-viz" padding="sm" hasVisualization>
            <MultipleInscribedAnglesVisualization />
        </Block>
    </SplitLayout>,

    // Quick check
    <StackLayout key="layout-inscribed-check-heading" maxWidth="xl">
        <Block id="inscribed-check-heading" padding="md">
            <EditableH2 id="h2-inscribed-check-heading" blockId="inscribed-check-heading">
                Quick Check
            </EditableH2>
        </Block>
    </StackLayout>,

    // Question
    <StackLayout key="layout-inscribed-question" maxWidth="xl">
        <Block id="inscribed-question" padding="sm">
            <EditableParagraph id="para-inscribed-question" blockId="inscribed-question">
                The vertex of an inscribed angle is located{" "}
                <InlineFeedback
                    varName="answerInscribedDefinition"
                    correctValue="on the circumference"
                    position="terminal"
                    successMessage="— exactly right! The vertex sits on the circle's edge, not at the centre"
                    failureMessage="— not quite"
                    hint="Look at where the coloured points are in the diagram"
                    reviewBlockId="inscribed-intro"
                    reviewLabel="Review the definition"
                >
                    <InlineClozeChoice
                        varName="answerInscribedDefinition"
                        correctAnswer="on the circumference"
                        options={["at the centre", "on the circumference", "outside the circle"]}
                        {...choicePropsFromDefinition(getVariableInfo('answerInscribedDefinition'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
