/**
 * Section 5: Angle in a Semicircle
 *
 * Students discover that an angle inscribed in a semicircle is always 90°.
 * They drag a point along the semicircle and see the angle never changes.
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
// Reactive Visualization: Angle in Semicircle
// ─────────────────────────────────────────────────────────────────────────────

function SemicircleVisualization() {
    const setVar = useSetVar();
    const RADIUS = 3;
    const CENTER: [number, number] = [0, 0];

    // Diameter endpoints (fixed)
    const diameterStart: [number, number] = [-RADIUS, 0];
    const diameterEnd: [number, number] = [RADIUS, 0];

    // Track angle
    const [angle, setAngle] = useState(90);
    const [pointAngle, setPointAngle] = useState(60);

    // Constrain to upper semicircle
    const constrainToSemicircle = useCallback((point: [number, number]): [number, number] => {
        let ang = Math.atan2(point[1], point[0]);
        // Keep in upper half (between 0.1π and 0.9π)
        if (ang < Math.PI * 0.08) ang = Math.PI * 0.08;
        if (ang > Math.PI * 0.92) ang = Math.PI * 0.92;
        return [RADIUS * Math.cos(ang), RADIUS * Math.sin(ang)];
    }, []);

    // Colors
    const colors = {
        circle: '#e2e8f0',
        diameter: '#8E90F5',
        diameterPoints: '#64748b',
        vertex: '#62D0AD',
        semicircle: '#F8A0CD',
        rightAngle: '#22c55e',
    };

    // Dynamic plots
    const dynamicPlots = useCallback((points: [number, number][]) => {
        const vertex = points[0] || [RADIUS * Math.cos(Math.PI * 0.5), RADIUS * Math.sin(Math.PI * 0.5)];

        // Calculate angle
        const ang = calculateAngle(vertex, diameterStart, diameterEnd);
        const pAngle = Math.round(Math.atan2(vertex[1], vertex[0]) * (180 / Math.PI));

        if (ang !== angle || pAngle !== pointAngle) {
            setAngle(ang);
            setPointAngle(pAngle);
            setVar('semicircleAngle', ang);
            setVar('semicirclePointAngle', pAngle);
        }

        // Right angle indicator (small square at vertex)
        const v1 = [diameterStart[0] - vertex[0], diameterStart[1] - vertex[1]];
        const v2 = [diameterEnd[0] - vertex[0], diameterEnd[1] - vertex[1]];
        const mag1 = Math.hypot(v1[0], v1[1]);
        const mag2 = Math.hypot(v2[0], v2[1]);
        const unit1 = [v1[0] / mag1 * 0.4, v1[1] / mag1 * 0.4];
        const unit2 = [v2[0] / mag2 * 0.4, v2[1] / mag2 * 0.4];

        const squareP1: [number, number] = [vertex[0] + unit1[0], vertex[1] + unit1[1]];
        const squareP2: [number, number] = [vertex[0] + unit1[0] + unit2[0], vertex[1] + unit1[1] + unit2[1]];
        const squareP3: [number, number] = [vertex[0] + unit2[0], vertex[1] + unit2[1]];

        return [
            // Full circle (faded lower half)
            {
                type: "circle" as const,
                center: CENTER,
                radius: RADIUS,
                color: colors.circle,
                fillOpacity: 0.03,
            },
            // Upper semicircle highlight
            {
                type: "parametric" as const,
                xy: (t: number): [number, number] => {
                    const a = Math.PI * t;
                    return [RADIUS * Math.cos(a), RADIUS * Math.sin(a)];
                },
                tRange: [0, 1] as [number, number],
                color: colors.semicircle,
                weight: 5,
            },
            // Diameter
            {
                type: "segment" as const,
                point1: diameterStart,
                point2: diameterEnd,
                color: colors.diameter,
                weight: 4,
            },
            // Centre point
            {
                type: "point" as const,
                x: 0,
                y: 0,
                color: colors.diameter,
            },
            // Diameter endpoints
            {
                type: "point" as const,
                x: diameterStart[0],
                y: diameterStart[1],
                color: colors.diameterPoints,
            },
            {
                type: "point" as const,
                x: diameterEnd[0],
                y: diameterEnd[1],
                color: colors.diameterPoints,
            },
            // Lines from vertex to diameter endpoints
            {
                type: "segment" as const,
                point1: vertex,
                point2: diameterStart,
                color: colors.vertex,
                weight: 3,
            },
            {
                type: "segment" as const,
                point1: vertex,
                point2: diameterEnd,
                color: colors.vertex,
                weight: 3,
            },
            // Right angle square indicator
            {
                type: "segment" as const,
                point1: squareP1,
                point2: squareP2,
                color: colors.rightAngle,
                weight: 2,
            },
            {
                type: "segment" as const,
                point1: squareP2,
                point2: squareP3,
                color: colors.rightAngle,
                weight: 2,
            },
        ];
    }, [angle, pointAngle, colors, diameterStart, diameterEnd, setVar]);

    return (
        <div className="relative">
            <Cartesian2D
                height={400}
                viewBox={{ x: [-4.5, 4.5], y: [-2.5, 4.5] }}
                showGrid={false}
                movablePoints={[
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 0.65), RADIUS * Math.sin(Math.PI * 0.65)],
                        color: colors.vertex,
                        constrain: constrainToSemicircle,
                    },
                ]}
                dynamicPlots={dynamicPlots}
            />
            <InteractionHintSequence
                hintKey="semicircle-drag"
                steps={[
                    {
                        gesture: "drag-circular",
                        label: "Drag the teal point anywhere along the semicircle",
                        position: { x: "35%", y: "25%" },
                        dragPath: { type: "arc", startAngle: 115, endAngle: 45, radius: 35 },
                    },
                ]}
            />
            {/* Angle display */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="text-xs font-medium text-slate-500 mb-1">Inscribed angle</div>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold" style={{ color: colors.vertex }}>{angle}°</span>
                    {angle === 90 && (
                        <span className="text-green-600 text-lg">✓</span>
                    )}
                </div>
                <div className="text-xs text-slate-400 mt-1">Always 90°!</div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Blocks
// ─────────────────────────────────────────────────────────────────────────────

export const semicircleBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-semicircle-heading" maxWidth="xl">
        <Block id="semicircle-heading" padding="lg">
            <EditableH2 id="h2-semicircle-heading" blockId="semicircle-heading">
                The Angle in a Semicircle
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-semicircle-intro" maxWidth="xl">
        <Block id="semicircle-intro" padding="sm">
            <EditableParagraph id="para-semicircle-intro" blockId="semicircle-intro">
                Now let's look at a special case: what happens when the chord we're looking at is actually the diameter? A diameter passes through the centre, so it cuts the circle exactly in half, creating a{" "}
                <InlineTooltip
                    id="tooltip-semicircle"
                    tooltip="Half of a circle, bounded by the diameter and half the circumference"
                >
                    semicircle
                </InlineTooltip>
                . Any point on the semicircular arc forms an inscribed angle to the diameter's endpoints.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive visualization
    <SplitLayout key="layout-semicircle-visualization" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="semicircle-explore-prompt" padding="sm">
                <EditableParagraph id="para-semicircle-explore-prompt" blockId="semicircle-explore-prompt">
                    The indigo line is the diameter, passing through the centre. The pink arc is the semicircle. Drag the teal point anywhere along the semicircle and watch the inscribed angle measurement. The small green square at the vertex shows a right angle marker.
                </EditableParagraph>
            </Block>
            <Block id="semicircle-discovery" padding="sm">
                <EditableParagraph id="para-semicircle-discovery" blockId="semicircle-discovery">
                    No matter where you place the point on the semicircle, the angle is always exactly 90°. This is the angle in a semicircle theorem: an angle inscribed in a semicircle is always a right angle.
                </EditableParagraph>
            </Block>
            <Block id="semicircle-theorem" padding="sm">
                <FormulaBlock
                    latex="\text{Angle in a semicircle} = 90°"
                />
            </Block>
            <Block id="semicircle-why" padding="sm">
                <EditableParagraph id="para-semicircle-why" blockId="semicircle-why">
                    Why is this true? Think about the angle at the centre theorem. The diameter creates a "centre angle" of 180° (a straight line). Any inscribed angle looking at this same arc must be half of 180°, which is 90°. This is a direct consequence of the theorem we discovered earlier.
                </EditableParagraph>
            </Block>
        </div>
        <Block id="semicircle-diagram-viz" padding="sm" hasVisualization>
            <SemicircleVisualization />
        </Block>
    </SplitLayout>,

    // Quick check
    <StackLayout key="layout-semicircle-check-heading" maxWidth="xl">
        <Block id="semicircle-check-heading" padding="md">
            <EditableH2 id="h2-semicircle-check-heading" blockId="semicircle-check-heading">
                Quick Check
            </EditableH2>
        </Block>
    </StackLayout>,

    // Question
    <StackLayout key="layout-semicircle-question" maxWidth="xl">
        <Block id="semicircle-question" padding="sm">
            <EditableParagraph id="para-semicircle-question" blockId="semicircle-question">
                The angle in a semicircle is always 90° because{" "}
                <InlineFeedback
                    varName="answerSemicircleWhy"
                    correctValue="180° ÷ 2 = 90°"
                    position="terminal"
                    successMessage="Exactly! The diameter forms a 180° angle at the centre, and the inscribed angle is half of that"
                    failureMessage="Not quite"
                    hint="The diameter creates what angle at the centre? And inscribed angles are what fraction of centre angles?"
                    reviewBlockId="semicircle-why"
                    reviewLabel="Review the explanation"
                >
                    <InlineClozeChoice
                        varName="answerSemicircleWhy"
                        correctAnswer="180° ÷ 2 = 90°"
                        options={["180° ÷ 2 = 90°", "360° ÷ 4 = 90°", "90° is special"]}
                        {...choicePropsFromDefinition(getVariableInfo('answerSemicircleWhy'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
