/**
 * Section 4: Angles in the Same Segment
 *
 * Students explore multiple draggable points on the same arc,
 * discovering that all inscribed angles subtending the same arc are equal.
 */

import { type ReactElement, useCallback, useState } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineTooltip,
    InlineClozeChoice,
    InlineFeedback,
    Cartesian2D,
    InteractionHintSequence,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import {
    getVariableInfo,
    choicePropsFromDefinition,
} from "../variables";
import { useSetVar } from "@/stores";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Calculate angle
// ─────────────────────────────────────────────────────────────────────────────

function calculateAngle(
    vertex: [number, number],
    point1: [number, number],
    point2: [number, number]
): number {
    const v1 = [point1[0] - vertex[0], point1[1] - vertex[1]];
    const v2 = [point2[0] - vertex[0], point2[1] - vertex[1]];
    const dot = v1[0] * v2[0] + v1[1] * v2[1];
    const mag1 = Math.hypot(v1[0], v1[1]);
    const mag2 = Math.hypot(v2[0], v2[1]);
    if (mag1 === 0 || mag2 === 0) return 0;
    const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    return Math.round(Math.acos(cosAngle) * (180 / Math.PI));
}

// ─────────────────────────────────────────────────────────────────────────────
// Reactive Visualization: Same Segment Angles
// ─────────────────────────────────────────────────────────────────────────────

function SameSegmentVisualization() {
    const setVar = useSetVar();
    const RADIUS = 3;

    // Fixed chord endpoints
    const chordStart: [number, number] = [
        RADIUS * Math.cos(Math.PI * 1.15),
        RADIUS * Math.sin(Math.PI * 1.15)
    ];
    const chordEnd: [number, number] = [
        RADIUS * Math.cos(-Math.PI * 0.15),
        RADIUS * Math.sin(-Math.PI * 0.15)
    ];

    // Track angles
    const [angles, setAngles] = useState<[number, number, number]>([55, 55, 55]);

    // Constrain to upper arc (the major segment)
    const constrainToUpperArc = useCallback((point: [number, number]): [number, number] => {
        let angle = Math.atan2(point[1], point[0]);
        // Keep in upper arc region
        if (angle < Math.PI * 0.05) angle = Math.PI * 0.05;
        if (angle > Math.PI * 0.95) angle = Math.PI * 0.95;
        return [RADIUS * Math.cos(angle), RADIUS * Math.sin(angle)];
    }, []);

    // Colors
    const colors = {
        circle: '#e2e8f0',
        chord: '#94a3b8',
        chordPoints: '#64748b',
        point1: '#62D0AD',
        point2: '#8E90F5',
        point3: '#AC8BF9',
        majorArc: '#F8A0CD',
        segment: 'rgba(248, 160, 205, 0.1)',
    };

    // Dynamic plots
    const dynamicPlots = useCallback((points: [number, number][]) => {
        const p1 = points[0] || [RADIUS * Math.cos(Math.PI * 0.75), RADIUS * Math.sin(Math.PI * 0.75)];
        const p2 = points[1] || [RADIUS * Math.cos(Math.PI * 0.5), RADIUS * Math.sin(Math.PI * 0.5)];
        const p3 = points[2] || [RADIUS * Math.cos(Math.PI * 0.25), RADIUS * Math.sin(Math.PI * 0.25)];

        // Calculate angles
        const a1 = calculateAngle(p1, chordStart, chordEnd);
        const a2 = calculateAngle(p2, chordStart, chordEnd);
        const a3 = calculateAngle(p3, chordStart, chordEnd);

        if (a1 !== angles[0] || a2 !== angles[1] || a3 !== angles[2]) {
            setAngles([a1, a2, a3]);
            setVar('segmentAngle1', a1);
            setVar('segmentAngle2', a2);
            setVar('segmentAngle3', a3);
        }

        return [
            // Main circle
            {
                type: "circle" as const,
                center: [0, 0] as [number, number],
                radius: RADIUS,
                color: colors.circle,
                fillOpacity: 0.03,
            },
            // Chord
            {
                type: "segment" as const,
                point1: chordStart,
                point2: chordEnd,
                color: colors.chord,
                weight: 4,
            },
            // Chord endpoints
            {
                type: "point" as const,
                x: chordStart[0],
                y: chordStart[1],
                color: colors.chordPoints,
            },
            {
                type: "point" as const,
                x: chordEnd[0],
                y: chordEnd[1],
                color: colors.chordPoints,
            },
            // Major arc (the segment where angles are inscribed)
            {
                type: "parametric" as const,
                xy: (t: number): [number, number] => {
                    const startAngle = Math.atan2(chordStart[1], chordStart[0]);
                    let endAngle = Math.atan2(chordEnd[1], chordEnd[0]);
                    // Go through the top (major arc)
                    if (endAngle > startAngle) endAngle -= 2 * Math.PI;
                    endAngle += 2 * Math.PI;
                    const angle = startAngle + t * (endAngle - startAngle - 2 * Math.PI + 0.3);
                    return [RADIUS * Math.cos(angle), RADIUS * Math.sin(angle)];
                },
                tRange: [0, 1] as [number, number],
                color: colors.majorArc,
                weight: 5,
            },
            // Angle 1 lines
            {
                type: "segment" as const,
                point1: p1,
                point2: chordStart,
                color: colors.point1,
                weight: 2,
            },
            {
                type: "segment" as const,
                point1: p1,
                point2: chordEnd,
                color: colors.point1,
                weight: 2,
            },
            // Angle 2 lines
            {
                type: "segment" as const,
                point1: p2,
                point2: chordStart,
                color: colors.point2,
                weight: 2,
            },
            {
                type: "segment" as const,
                point1: p2,
                point2: chordEnd,
                color: colors.point2,
                weight: 2,
            },
            // Angle 3 lines
            {
                type: "segment" as const,
                point1: p3,
                point2: chordStart,
                color: colors.point3,
                weight: 2,
            },
            {
                type: "segment" as const,
                point1: p3,
                point2: chordEnd,
                color: colors.point3,
                weight: 2,
            },
        ];
    }, [angles, colors, chordStart, chordEnd, setVar]);

    return (
        <div className="relative">
            <Cartesian2D
                height={400}
                viewBox={{ x: [-4.5, 4.5], y: [-4.5, 4.5] }}
                showGrid={false}
                movablePoints={[
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 0.8), RADIUS * Math.sin(Math.PI * 0.8)],
                        color: colors.point1,
                        constrain: constrainToUpperArc,
                    },
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 0.5), RADIUS * Math.sin(Math.PI * 0.5)],
                        color: colors.point2,
                        constrain: constrainToUpperArc,
                    },
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 0.2), RADIUS * Math.sin(Math.PI * 0.2)],
                        color: colors.point3,
                        constrain: constrainToUpperArc,
                    },
                ]}
                dynamicPlots={dynamicPlots}
            />
            <InteractionHintSequence
                hintKey="same-segment-drag"
                steps={[
                    {
                        gesture: "drag-circular",
                        label: "Drag any coloured point along the pink arc",
                        position: { x: "35%", y: "20%" },
                        dragPath: { type: "arc", startAngle: 145, endAngle: 90, radius: 30 },
                    },
                ]}
            />
            {/* Angle display */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-slate-200">
                <div className="text-xs font-medium text-slate-500 mb-2">Angles in the same segment</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.point1 }}></span>
                        <span className="text-lg font-bold" style={{ color: colors.point1 }}>{angles[0]}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.point2 }}></span>
                        <span className="text-lg font-bold" style={{ color: colors.point2 }}>{angles[1]}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.point3 }}></span>
                        <span className="text-lg font-bold" style={{ color: colors.point3 }}>{angles[2]}°</span>
                    </div>
                </div>
                {angles[0] === angles[1] && angles[1] === angles[2] && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                        <span className="text-xs text-green-600 font-medium">All equal!</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Blocks
// ─────────────────────────────────────────────────────────────────────────────

export const sameSegmentBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-segment-heading" maxWidth="xl">
        <Block id="segment-heading" padding="lg">
            <EditableH2 id="h2-segment-heading" blockId="segment-heading">
                Angles in the Same Segment
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-segment-intro" maxWidth="xl">
        <Block id="segment-intro" padding="sm">
            <EditableParagraph id="para-segment-intro" blockId="segment-intro">
                A chord divides a circle into two regions called{" "}
                <InlineTooltip
                    id="tooltip-segment"
                    tooltip="The region between a chord and the arc it cuts off"
                >
                    segments
                </InlineTooltip>
                . The smaller region is the minor segment, and the larger is the major segment. When we talk about "angles in the same segment", we mean inscribed angles whose vertices all lie on the same arc.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive visualization
    <SplitLayout key="layout-segment-visualization" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="segment-explore-prompt" padding="sm">
                <EditableParagraph id="para-segment-explore-prompt" blockId="segment-explore-prompt">
                    The grey chord divides the circle into two segments. The pink arc marks the major segment where all three angle vertices sit. Drag any of the three coloured points along this arc and observe what happens to the angle measurements.
                </EditableParagraph>
            </Block>
            <Block id="segment-discovery" padding="sm">
                <EditableParagraph id="para-segment-discovery" blockId="segment-discovery">
                    Every angle inscribed in the same segment — that is, every angle whose vertex lies on the same arc — is equal. It doesn't matter whether the points are close together or spread far apart along the arc. As long as they all "look at" the same chord from the same side, their angles are identical.
                </EditableParagraph>
            </Block>
            <Block id="segment-theorem" padding="sm">
                <FormulaBlock
                    latex="\text{Angles in the same segment are equal}"
                />
            </Block>
            <Block id="segment-connection" padding="sm">
                <EditableParagraph id="para-segment-connection" blockId="segment-connection">
                    This follows directly from the angle at centre theorem. Each inscribed angle is exactly half the centre angle subtending the same arc. Since they're all half of the same centre angle, they must all be equal to each other.
                </EditableParagraph>
            </Block>
        </div>
        <Block id="segment-diagram-viz" padding="sm" hasVisualization>
            <SameSegmentVisualization />
        </Block>
    </SplitLayout>,

    // Quick check
    <StackLayout key="layout-segment-check-heading" maxWidth="xl">
        <Block id="segment-check-heading" padding="md">
            <EditableH2 id="h2-segment-check-heading" blockId="segment-check-heading">
                Quick Check
            </EditableH2>
        </Block>
    </StackLayout>,

    // Question
    <StackLayout key="layout-segment-question" maxWidth="xl">
        <Block id="segment-question" padding="sm">
            <EditableParagraph id="para-segment-question" blockId="segment-question">
                Angles in the same segment are equal because they all subtend the{" "}
                <InlineFeedback
                    varName="answerSameSegmentWhy"
                    correctValue="same arc"
                    position="terminal"
                    successMessage="— exactly! They all look at the same arc, so they're all half of the same centre angle"
                    failureMessage="— not quite"
                    hint="What do inscribed angles 'look at'?"
                    reviewBlockId="segment-connection"
                    reviewLabel="Review the connection"
                >
                    <InlineClozeChoice
                        varName="answerSameSegmentWhy"
                        correctAnswer="same arc"
                        options={["same chord", "same arc", "same radius"]}
                        {...choicePropsFromDefinition(getVariableInfo('answerSameSegmentWhy'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
