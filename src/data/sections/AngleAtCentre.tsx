/**
 * Section 3: Angle at the Centre Theorem
 *
 * Students discover that the angle at the centre is twice the inscribed angle.
 * Side-by-side comparison with live angle measurements.
 */

import { type ReactElement, useCallback, useState } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineTooltip,
    InlineClozeInput,
    InlineFeedback,
    Cartesian2D,
    InteractionHintSequence,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import {
    getVariableInfo,
    clozePropsFromDefinition,
} from "../variables";
import { useSetVar } from "@/stores";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Calculate angle between two vectors
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
// Reactive Visualization: Centre vs Inscribed Angle Comparison
// ─────────────────────────────────────────────────────────────────────────────

function CentreVsInscribedVisualization() {
    const setVar = useSetVar();
    const RADIUS = 3;
    const CENTER: [number, number] = [0, 0];

    // Track angles for display
    const [centreAngle, setCentreAngle] = useState(90);
    const [inscribedAngle, setInscribedAngle] = useState(45);

    // Constrain to circle
    const constrainToCircle = useCallback((point: [number, number]): [number, number] => {
        const angle = Math.atan2(point[1], point[0]);
        return [RADIUS * Math.cos(angle), RADIUS * Math.sin(angle)];
    }, []);

    // Constrain inscribed angle vertex to upper arc
    const constrainToUpperArc = useCallback((point: [number, number]): [number, number] => {
        let angle = Math.atan2(point[1], point[0]);
        // Keep in upper portion (between π*0.1 and π*0.9)
        if (angle < Math.PI * 0.15) angle = Math.PI * 0.15;
        if (angle > Math.PI * 0.85) angle = Math.PI * 0.85;
        return [RADIUS * Math.cos(angle), RADIUS * Math.sin(angle)];
    }, []);

    // Colors
    const colors = {
        circle: '#e2e8f0',
        centre: '#F7B23B',
        inscribed: '#62D0AD',
        arcPoints: '#8E90F5',
        arc: '#F8A0CD',
    };

    // Dynamic plots
    const dynamicPlots = useCallback((points: [number, number][]) => {
        // Arc endpoints (movable)
        const arcStart = points[0] || [RADIUS * Math.cos(Math.PI * 1.3), RADIUS * Math.sin(Math.PI * 1.3)];
        const arcEnd = points[1] || [RADIUS * Math.cos(-Math.PI * 0.3), RADIUS * Math.sin(-Math.PI * 0.3)];
        // Inscribed angle vertex
        const inscribedVertex = points[2] || [RADIUS * Math.cos(Math.PI * 0.5), RADIUS * Math.sin(Math.PI * 0.5)];

        // Calculate angles
        const cAngle = calculateAngle(CENTER, arcStart, arcEnd);
        const iAngle = calculateAngle(inscribedVertex, arcStart, arcEnd);

        // Update display
        if (cAngle !== centreAngle || iAngle !== inscribedAngle) {
            setCentreAngle(cAngle);
            setInscribedAngle(iAngle);
            setVar('centreAngle', cAngle);
            setVar('circumferenceAngle', iAngle);
        }

        return [
            // Main circle
            {
                type: "circle" as const,
                center: CENTER,
                radius: RADIUS,
                color: colors.circle,
                fillOpacity: 0.03,
            },
            // Centre point
            {
                type: "point" as const,
                x: 0,
                y: 0,
                color: colors.centre,
            },
            // Centre angle lines (from centre to arc endpoints)
            {
                type: "segment" as const,
                point1: CENTER,
                point2: arcStart,
                color: colors.centre,
                weight: 3,
            },
            {
                type: "segment" as const,
                point1: CENTER,
                point2: arcEnd,
                color: colors.centre,
                weight: 3,
            },
            // Inscribed angle lines (from circumference vertex to arc endpoints)
            {
                type: "segment" as const,
                point1: inscribedVertex,
                point2: arcStart,
                color: colors.inscribed,
                weight: 3,
            },
            {
                type: "segment" as const,
                point1: inscribedVertex,
                point2: arcEnd,
                color: colors.inscribed,
                weight: 3,
            },
            // Arc (between the two arc points, going through bottom)
            {
                type: "parametric" as const,
                xy: (t: number): [number, number] => {
                    const startAngle = Math.atan2(arcStart[1], arcStart[0]);
                    let endAngle = Math.atan2(arcEnd[1], arcEnd[0]);
                    // Go the long way around (through bottom)
                    if (endAngle > startAngle) endAngle -= 2 * Math.PI;
                    const angle = startAngle + t * (endAngle - startAngle);
                    return [RADIUS * Math.cos(angle), RADIUS * Math.sin(angle)];
                },
                tRange: [0, 1] as [number, number],
                color: colors.arc,
                weight: 4,
            },
        ];
    }, [centreAngle, inscribedAngle, colors, setVar]);

    return (
        <div className="relative">
            <Cartesian2D
                height={400}
                viewBox={{ x: [-4.5, 4.5], y: [-4.5, 4.5] }}
                showGrid={false}
                movablePoints={[
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 1.25), RADIUS * Math.sin(Math.PI * 1.25)],
                        color: colors.arcPoints,
                        constrain: constrainToCircle,
                    },
                    {
                        initial: [RADIUS * Math.cos(-Math.PI * 0.25), RADIUS * Math.sin(-Math.PI * 0.25)],
                        color: colors.arcPoints,
                        constrain: constrainToCircle,
                    },
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 0.5), RADIUS * Math.sin(Math.PI * 0.5)],
                        color: colors.inscribed,
                        constrain: constrainToUpperArc,
                    },
                ]}
                dynamicPlots={dynamicPlots}
            />
            <InteractionHintSequence
                hintKey="centre-angle-drag"
                steps={[
                    {
                        gesture: "drag-circular",
                        label: "Drag the indigo points to change the arc",
                        position: { x: "25%", y: "70%" },
                        dragPath: { type: "arc", startAngle: 225, endAngle: 270, radius: 30 },
                    },
                ]}
            />
            {/* Angle display overlay */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-slate-200">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.centre }}></span>
                        <span className="text-xs text-slate-500">Centre angle:</span>
                        <span className="text-lg font-bold" style={{ color: colors.centre }}>{centreAngle}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.inscribed }}></span>
                        <span className="text-xs text-slate-500">Inscribed angle:</span>
                        <span className="text-lg font-bold" style={{ color: colors.inscribed }}>{inscribedAngle}°</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 mt-2">
                        <span className="text-xs text-slate-500">Ratio: </span>
                        <span className="text-sm font-bold text-slate-700">
                            {inscribedAngle > 0 ? (centreAngle / inscribedAngle).toFixed(1) : '—'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Blocks
// ─────────────────────────────────────────────────────────────────────────────

export const angleAtCentreBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-centre-heading" maxWidth="xl">
        <Block id="centre-heading" padding="lg">
            <EditableH2 id="h2-centre-heading" blockId="centre-heading">
                The Angle at the Centre Theorem
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-centre-intro" maxWidth="xl">
        <Block id="centre-intro" padding="sm">
            <EditableParagraph id="para-centre-intro" blockId="centre-intro">
                Now let's compare an inscribed angle with the angle formed at the centre of the circle when both "look at" the same arc. The diagram shows two angles: an amber angle at the centre and a teal inscribed angle on the circumference. Both angles are formed by drawing lines to the same two points (the indigo points that mark the arc endpoints).
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive visualization
    <SplitLayout key="layout-centre-visualization" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="centre-explore-prompt" padding="sm">
                <EditableParagraph id="para-centre-explore-prompt" blockId="centre-explore-prompt">
                    Drag the indigo arc endpoints to make the arc larger or smaller. Drag the teal point along the upper arc to move the inscribed angle vertex. Watch the angle measurements and the ratio displayed on the left side of the diagram.
                </EditableParagraph>
            </Block>
            <Block id="centre-discovery" padding="sm">
                <EditableParagraph id="para-centre-discovery" blockId="centre-discovery">
                    Do you see the pattern? No matter how you arrange the points, the ratio stays remarkably constant. The centre angle is always exactly twice the inscribed angle. This is the first major circle theorem: the angle at the centre is double the angle at the circumference when both subtend the same arc.
                </EditableParagraph>
            </Block>
            <Block id="centre-formula" padding="sm">
                <FormulaBlock
                    latex="\text{Centre angle} = 2 \times \text{Inscribed angle}"
                />
            </Block>
            <Block id="centre-explanation" padding="sm">
                <EditableParagraph id="para-centre-explanation" blockId="centre-explanation">
                    This theorem explains why all inscribed angles on the same arc are equal (as you discovered in the previous section). Each inscribed angle is exactly half the centre angle — and since the centre angle stays fixed when you move the vertex along the arc, all the inscribed angles must be equal to each other.
                </EditableParagraph>
            </Block>
        </div>
        <Block id="centre-diagram-viz" padding="sm" hasVisualization>
            <CentreVsInscribedVisualization />
        </Block>
    </SplitLayout>,

    // Quick check heading
    <StackLayout key="layout-centre-check-heading" maxWidth="xl">
        <Block id="centre-check-heading" padding="md">
            <EditableH2 id="h2-centre-check-heading" blockId="centre-check-heading">
                Quick Check
            </EditableH2>
        </Block>
    </StackLayout>,

    // Question 1
    <StackLayout key="layout-centre-question-relation" maxWidth="xl">
        <Block id="centre-question-relation" padding="sm">
            <EditableParagraph id="para-centre-question-relation" blockId="centre-question-relation">
                The angle at the centre is{" "}
                <InlineFeedback
                    varName="answerCentreAngleRelation"
                    correctValue="2"
                    position="mid"
                    successMessage="✓"
                    failureMessage="✗"
                    hint="Look at the ratio displayed in the diagram"
                    reviewBlockId="centre-discovery"
                    reviewLabel="Review the theorem"
                >
                    <InlineClozeInput
                        varName="answerCentreAngleRelation"
                        correctAnswer="2"
                        {...clozePropsFromDefinition(getVariableInfo('answerCentreAngleRelation'))}
                    />
                </InlineFeedback>{" "}
                times the inscribed angle.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Question 2
    <StackLayout key="layout-centre-question-calculation" maxWidth="xl">
        <Block id="centre-question-calculation" padding="sm">
            <EditableParagraph id="para-centre-question-calculation" blockId="centre-question-calculation">
                If the angle at the centre is 124°, the inscribed angle subtending the same arc is{" "}
                <InlineFeedback
                    varName="answerCentreAngleCalculation"
                    correctValue="62"
                    position="terminal"
                    successMessage="— perfect! 124° ÷ 2 = 62°"
                    failureMessage="— not quite"
                    hint="The inscribed angle is half the centre angle"
                    visualizationHint={{
                        blockId: "centre-diagram-viz",
                        hintKey: "centre-calculation-hint",
                        steps: [
                            {
                                gesture: "drag-circular",
                                label: "Drag the arc endpoints to make the centre angle close to 124°",
                                position: { x: "25%", y: "70%" },
                                completionVar: "centreAngle",
                                completionValue: 124,
                                completionTolerance: 10,
                            },
                        ],
                        label: "Try it in the diagram",
                        resetVars: { centreAngle: 90 },
                    }}
                >
                    <InlineClozeInput
                        varName="answerCentreAngleCalculation"
                        correctAnswer="62"
                        {...clozePropsFromDefinition(getVariableInfo('answerCentreAngleCalculation'))}
                    />
                </InlineFeedback>°.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
