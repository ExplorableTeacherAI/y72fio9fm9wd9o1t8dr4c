/**
 * Section 3: Angle at the Centre Theorem
 *
 * Students discover that the angle at the centre is twice the inscribed angle.
 * Side-by-side comparison with live angle measurements.
 */

import { type ReactElement, useCallback, useState, useRef } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeInput,
    InlineFeedback,
    InlineLinkedHighlight,
    InlineSpotColor,
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

interface AngleInfo {
    degrees: number;
    startAngle: number;
    endAngle: number;
}

function calculateAngleInfo(
    vertex: [number, number],
    point1: [number, number],
    point2: [number, number]
): AngleInfo {
    const v1 = [point1[0] - vertex[0], point1[1] - vertex[1]];
    const v2 = [point2[0] - vertex[0], point2[1] - vertex[1]];

    const angle1 = Math.atan2(v1[1], v1[0]);
    const angle2 = Math.atan2(v2[1], v2[0]);

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
    let start = startAngle;
    let end = endAngle;

    // Ensure we go the shorter way around
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

// Calculate label position along the angle bisector
function getLabelPosition(
    vertex: [number, number],
    startAngle: number,
    endAngle: number,
    offset: number
): [number, number] {
    let start = startAngle;
    let end = endAngle;
    while (end - start > Math.PI) end -= 2 * Math.PI;
    while (start - end > Math.PI) start -= 2 * Math.PI;

    const bisector = (start + end) / 2;
    return [
        vertex[0] + offset * Math.cos(bisector),
        vertex[1] + offset * Math.sin(bisector)
    ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Reactive Visualization: Centre vs Inscribed Angle Comparison
// ─────────────────────────────────────────────────────────────────────────────

function CentreVsInscribedVisualization() {
    const setVar = useSetVar();
    const RADIUS = 3;
    const CENTER: [number, number] = [0, 0];
    const ANGLE_ARC_RADIUS = 0.6;
    const VIEW_BOX = { x: [-4.5, 4.5] as [number, number], y: [-4.5, 4.5] as [number, number] };
    const HEIGHT = 400;

    // Track angles for display
    const [centreAngle, setCentreAngle] = useState(90);
    const [inscribedAngle, setInscribedAngle] = useState(45);
    const [renderTrigger, setRenderTrigger] = useState(0);

    // Refs for label positions
    const centreLabelPosRef = useRef<[number, number]>([0.8, 0.8]);
    const inscribedLabelPosRef = useRef<[number, number]>([0, 2.5]);

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

    // Handler to trigger re-render when points move
    const handlePointChange = useCallback(() => {
        setRenderTrigger(prev => prev + 1);
    }, []);

    // Convert math coordinates to percentage position for CSS overlay
    const mathToPercent = (mathPos: [number, number]): { left: string; top: string } => {
        const [xMin, xMax] = VIEW_BOX.x;
        const [yMin, yMax] = VIEW_BOX.y;
        const leftPercent = ((mathPos[0] - xMin) / (xMax - xMin)) * 100;
        const topPercent = ((yMax - mathPos[1]) / (yMax - yMin)) * 100;
        return { left: `${leftPercent}%`, top: `${topPercent}%` };
    };

    // Dynamic plots
    const dynamicPlots = useCallback((points: [number, number][]) => {
        // Arc endpoints (movable)
        const arcStart = points[0] || [RADIUS * Math.cos(Math.PI * 1.3), RADIUS * Math.sin(Math.PI * 1.3)];
        const arcEnd = points[1] || [RADIUS * Math.cos(-Math.PI * 0.3), RADIUS * Math.sin(-Math.PI * 0.3)];
        // Inscribed angle vertex
        const inscribedVertex = points[2] || [RADIUS * Math.cos(Math.PI * 0.5), RADIUS * Math.sin(Math.PI * 0.5)];

        // Calculate angles with direction info
        const centreAngleInfo = calculateAngleInfo(CENTER, arcStart, arcEnd);
        const inscribedAngleInfo = calculateAngleInfo(inscribedVertex, arcStart, arcEnd);

        const cAngle = centreAngleInfo.degrees;
        const iAngle = inscribedAngleInfo.degrees;

        // Calculate label positions along bisector
        centreLabelPosRef.current = getLabelPosition(CENTER, centreAngleInfo.startAngle, centreAngleInfo.endAngle, ANGLE_ARC_RADIUS + 0.5);
        inscribedLabelPosRef.current = getLabelPosition(inscribedVertex, inscribedAngleInfo.startAngle, inscribedAngleInfo.endAngle, ANGLE_ARC_RADIUS + 0.5);

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
                highlightId: 'centreAngle',
            },
            // Centre angle lines (from centre to arc endpoints)
            {
                type: "segment" as const,
                point1: CENTER,
                point2: arcStart,
                color: colors.centre,
                weight: 3,
                highlightId: 'centreAngle',
            },
            {
                type: "segment" as const,
                point1: CENTER,
                point2: arcEnd,
                color: colors.centre,
                weight: 3,
                highlightId: 'centreAngle',
            },
            // Centre angle arc indicator
            {
                type: "parametric" as const,
                xy: createAngleArc(CENTER, centreAngleInfo.startAngle, centreAngleInfo.endAngle, ANGLE_ARC_RADIUS),
                tRange: [0, 1] as [number, number],
                color: colors.centre,
                weight: 2.5,
                highlightId: 'centreAngle',
            },
            // Inscribed angle lines (from circumference vertex to arc endpoints)
            {
                type: "segment" as const,
                point1: inscribedVertex,
                point2: arcStart,
                color: colors.inscribed,
                weight: 3,
                highlightId: 'inscribedAngle',
            },
            {
                type: "segment" as const,
                point1: inscribedVertex,
                point2: arcEnd,
                color: colors.inscribed,
                weight: 3,
                highlightId: 'inscribedAngle',
            },
            // Inscribed angle arc indicator
            {
                type: "parametric" as const,
                xy: createAngleArc(inscribedVertex, inscribedAngleInfo.startAngle, inscribedAngleInfo.endAngle, ANGLE_ARC_RADIUS),
                tRange: [0, 1] as [number, number],
                color: colors.inscribed,
                weight: 2.5,
                highlightId: 'inscribedAngle',
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
                highlightId: 'arc',
            },
            // Arc endpoints (for highlighting)
            {
                type: "point" as const,
                x: arcStart[0],
                y: arcStart[1],
                color: colors.arcPoints,
                highlightId: 'arcEndpoints',
            },
            {
                type: "point" as const,
                x: arcEnd[0],
                y: arcEnd[1],
                color: colors.arcPoints,
                highlightId: 'arcEndpoints',
            },
        ];
    }, [centreAngle, inscribedAngle, colors, setVar]);

    return (
        <div className="relative">
            <Cartesian2D
                height={HEIGHT}
                viewBox={VIEW_BOX}
                showGrid={false}
                highlightVarName="centreTheoremHighlight"
                movablePoints={[
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 1.25), RADIUS * Math.sin(Math.PI * 1.25)],
                        color: colors.arcPoints,
                        constrain: constrainToCircle,
                        onChange: handlePointChange,
                    },
                    {
                        initial: [RADIUS * Math.cos(-Math.PI * 0.25), RADIUS * Math.sin(-Math.PI * 0.25)],
                        color: colors.arcPoints,
                        constrain: constrainToCircle,
                        onChange: handlePointChange,
                    },
                    {
                        initial: [RADIUS * Math.cos(Math.PI * 0.5), RADIUS * Math.sin(Math.PI * 0.5)],
                        color: colors.inscribed,
                        constrain: constrainToUpperArc,
                        onChange: handlePointChange,
                    },
                ]}
                dynamicPlots={dynamicPlots}
            />
            {/* Angle labels overlay - positioned on the graph */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ height: HEIGHT }}
            >
                {/* Centre angle label */}
                <span
                    key={`centre-label-${renderTrigger}`}
                    className="absolute text-sm font-semibold -translate-x-1/2 -translate-y-1/2"
                    style={{ ...mathToPercent(centreLabelPosRef.current), color: colors.centre }}
                >
                    {centreAngle}°
                </span>
                {/* Inscribed angle label */}
                <span
                    key={`inscribed-label-${renderTrigger}`}
                    className="absolute text-sm font-semibold -translate-x-1/2 -translate-y-1/2"
                    style={{ ...mathToPercent(inscribedLabelPosRef.current), color: colors.inscribed }}
                >
                    {inscribedAngle}°
                </span>
            </div>
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
                Now let's compare an inscribed angle with the angle formed at the centre of the circle when both "look at" the same{" "}
                <InlineLinkedHighlight
                    varName="centreTheoremHighlight"
                    highlightId="arc"
                    color="#F8A0CD"
                    bgColor="rgba(248, 160, 205, 0.15)"
                >
                    arc
                </InlineLinkedHighlight>
                . The diagram shows two angles: the{" "}
                <InlineLinkedHighlight
                    varName="centreTheoremHighlight"
                    highlightId="centreAngle"
                    color="#F7B23B"
                    bgColor="rgba(247, 178, 59, 0.15)"
                >
                    angle at the centre
                </InlineLinkedHighlight>
                {" "}and the{" "}
                <InlineLinkedHighlight
                    varName="centreTheoremHighlight"
                    highlightId="inscribedAngle"
                    color="#62D0AD"
                    bgColor="rgba(98, 208, 173, 0.15)"
                >
                    inscribed angle
                </InlineLinkedHighlight>
                {" "}on the circumference. Both angles are formed by drawing lines to the same two{" "}
                <InlineLinkedHighlight
                    varName="centreTheoremHighlight"
                    highlightId="arcEndpoints"
                    color="#8E90F5"
                    bgColor="rgba(142, 144, 245, 0.15)"
                >
                    arc endpoints
                </InlineLinkedHighlight>
                .
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive visualization
    <SplitLayout key="layout-centre-visualization" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="centre-explore-prompt" padding="sm">
                <EditableParagraph id="para-centre-explore-prompt" blockId="centre-explore-prompt">
                    Drag the{" "}
                    <InlineLinkedHighlight
                        varName="centreTheoremHighlight"
                        highlightId="arcEndpoints"
                        color="#8E90F5"
                        bgColor="rgba(142, 144, 245, 0.15)"
                    >
                        arc endpoints
                    </InlineLinkedHighlight>
                    {" "}to make the{" "}
                    <InlineLinkedHighlight
                        varName="centreTheoremHighlight"
                        highlightId="arc"
                        color="#F8A0CD"
                        bgColor="rgba(248, 160, 205, 0.15)"
                    >
                        arc
                    </InlineLinkedHighlight>
                    {" "}larger or smaller. Drag the{" "}
                    <InlineLinkedHighlight
                        varName="centreTheoremHighlight"
                        highlightId="inscribedAngle"
                        color="#62D0AD"
                        bgColor="rgba(98, 208, 173, 0.15)"
                    >
                        inscribed angle vertex
                    </InlineLinkedHighlight>
                    {" "}along the upper arc. Watch the angle measurements displayed on the diagram.
                </EditableParagraph>
            </Block>
            <Block id="centre-discovery" padding="sm">
                <EditableParagraph id="para-centre-discovery" blockId="centre-discovery">
                    Do you see the pattern? No matter how you arrange the points, the ratio stays remarkably constant. The{" "}
                    <InlineLinkedHighlight
                        varName="centreTheoremHighlight"
                        highlightId="centreAngle"
                        color="#F7B23B"
                        bgColor="rgba(247, 178, 59, 0.15)"
                    >
                        centre angle
                    </InlineLinkedHighlight>
                    {" "}is always exactly{" "}
                    <InlineSpotColor id="spot-twice" color="#F7B23B">twice</InlineSpotColor>
                    {" "}the{" "}
                    <InlineLinkedHighlight
                        varName="centreTheoremHighlight"
                        highlightId="inscribedAngle"
                        color="#62D0AD"
                        bgColor="rgba(98, 208, 173, 0.15)"
                    >
                        inscribed angle
                    </InlineLinkedHighlight>
                    .
                </EditableParagraph>
            </Block>
            <Block id="centre-theorem-statement" padding="sm">
                <EditableParagraph id="para-centre-theorem-statement" blockId="centre-theorem-statement">
                    This is the first major circle theorem: the{" "}
                    <InlineLinkedHighlight
                        varName="centreTheoremHighlight"
                        highlightId="centreAngle"
                        color="#F7B23B"
                        bgColor="rgba(247, 178, 59, 0.15)"
                    >
                        angle at the centre
                    </InlineLinkedHighlight>
                    {" "}is{" "}
                    <InlineSpotColor id="spot-double" color="#F7B23B">double</InlineSpotColor>
                    {" "}the{" "}
                    <InlineLinkedHighlight
                        varName="centreTheoremHighlight"
                        highlightId="inscribedAngle"
                        color="#62D0AD"
                        bgColor="rgba(98, 208, 173, 0.15)"
                    >
                        angle at the circumference
                    </InlineLinkedHighlight>
                    {" "}when both subtend the same{" "}
                    <InlineLinkedHighlight
                        varName="centreTheoremHighlight"
                        highlightId="arc"
                        color="#F8A0CD"
                        bgColor="rgba(248, 160, 205, 0.15)"
                    >
                        arc
                    </InlineLinkedHighlight>
                    .
                </EditableParagraph>
            </Block>
            <Block id="centre-formula" padding="sm">
                <FormulaBlock
                    latex="\clr{centreAngle}{\text{Centre angle}} = 2 \times \clr{inscribedAngle}{\text{Inscribed angle}}"
                    colorMap={{
                        centreAngle: "#F7B23B",
                        inscribedAngle: "#62D0AD",
                    }}
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
