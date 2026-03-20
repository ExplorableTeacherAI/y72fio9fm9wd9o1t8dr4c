/**
 * Section 6: Putting It All Together
 *
 * Practice problems combining all three circle theorems.
 * Students identify which theorem applies and calculate unknown angles.
 */

import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableH3,
    EditableParagraph,
    InlineClozeInput,
    InlineClozeChoice,
    InlineFeedback,
    Cartesian2D,
} from "@/components/atoms";
import {
    getVariableInfo,
    clozePropsFromDefinition,
    choicePropsFromDefinition,
} from "../variables";

// ─────────────────────────────────────────────────────────────────────────────
// Static Practice Diagrams
// ─────────────────────────────────────────────────────────────────────────────

// Problem 1: Centre angle theorem - Given centre angle 70°, find inscribed
function Problem1Diagram() {
    const RADIUS = 3;
    const CENTER: [number, number] = [0, 0];

    // Arc endpoints
    const arcStart: [number, number] = [RADIUS * Math.cos(Math.PI * 1.1), RADIUS * Math.sin(Math.PI * 1.1)];
    const arcEnd: [number, number] = [RADIUS * Math.cos(-Math.PI * 0.15), RADIUS * Math.sin(-Math.PI * 0.15)];
    // Inscribed vertex
    const vertex: [number, number] = [RADIUS * Math.cos(Math.PI * 0.5), RADIUS * Math.sin(Math.PI * 0.5)];

    return (
        <div className="relative">
            <Cartesian2D
                height={280}
                viewBox={{ x: [-4, 4], y: [-4, 4] }}
                showGrid={false}
                plots={[
                    { type: "circle", center: CENTER, radius: RADIUS, color: "#e2e8f0", fillOpacity: 0.03 },
                    // Centre angle
                    { type: "segment", point1: CENTER, point2: arcStart, color: "#F7B23B", weight: 3 },
                    { type: "segment", point1: CENTER, point2: arcEnd, color: "#F7B23B", weight: 3 },
                    // Inscribed angle
                    { type: "segment", point1: vertex, point2: arcStart, color: "#62D0AD", weight: 2 },
                    { type: "segment", point1: vertex, point2: arcEnd, color: "#62D0AD", weight: 2 },
                    // Points
                    { type: "point", x: 0, y: 0, color: "#F7B23B" },
                    { type: "point", x: arcStart[0], y: arcStart[1], color: "#64748b" },
                    { type: "point", x: arcEnd[0], y: arcEnd[1], color: "#64748b" },
                    { type: "point", x: vertex[0], y: vertex[1], color: "#62D0AD" },
                ]}
            />
            {/* Labels */}
            <div className="absolute" style={{ left: '45%', top: '55%', transform: 'translate(-50%, -50%)' }}>
                <span className="text-sm font-bold" style={{ color: '#F7B23B' }}>70°</span>
            </div>
            <div className="absolute" style={{ left: '50%', top: '18%', transform: 'translate(-50%, -50%)' }}>
                <span className="text-sm font-bold" style={{ color: '#62D0AD' }}>?°</span>
            </div>
        </div>
    );
}

// Problem 2: Same segment - Given one angle 52°, find another
function Problem2Diagram() {
    const RADIUS = 3;

    // Chord endpoints
    const chordStart: [number, number] = [RADIUS * Math.cos(Math.PI * 1.15), RADIUS * Math.sin(Math.PI * 1.15)];
    const chordEnd: [number, number] = [RADIUS * Math.cos(-Math.PI * 0.15), RADIUS * Math.sin(-Math.PI * 0.15)];
    // Two vertices on same segment
    const vertex1: [number, number] = [RADIUS * Math.cos(Math.PI * 0.7), RADIUS * Math.sin(Math.PI * 0.7)];
    const vertex2: [number, number] = [RADIUS * Math.cos(Math.PI * 0.35), RADIUS * Math.sin(Math.PI * 0.35)];

    return (
        <div className="relative">
            <Cartesian2D
                height={280}
                viewBox={{ x: [-4, 4], y: [-4, 4] }}
                showGrid={false}
                plots={[
                    { type: "circle", center: [0, 0], radius: RADIUS, color: "#e2e8f0", fillOpacity: 0.03 },
                    // Chord
                    { type: "segment", point1: chordStart, point2: chordEnd, color: "#94a3b8", weight: 3 },
                    // First angle (given)
                    { type: "segment", point1: vertex1, point2: chordStart, color: "#8E90F5", weight: 2 },
                    { type: "segment", point1: vertex1, point2: chordEnd, color: "#8E90F5", weight: 2 },
                    // Second angle (to find)
                    { type: "segment", point1: vertex2, point2: chordStart, color: "#62D0AD", weight: 2 },
                    { type: "segment", point1: vertex2, point2: chordEnd, color: "#62D0AD", weight: 2 },
                    // Points
                    { type: "point", x: chordStart[0], y: chordStart[1], color: "#64748b" },
                    { type: "point", x: chordEnd[0], y: chordEnd[1], color: "#64748b" },
                    { type: "point", x: vertex1[0], y: vertex1[1], color: "#8E90F5" },
                    { type: "point", x: vertex2[0], y: vertex2[1], color: "#62D0AD" },
                ]}
            />
            {/* Labels */}
            <div className="absolute" style={{ left: '30%', top: '25%', transform: 'translate(-50%, -50%)' }}>
                <span className="text-sm font-bold" style={{ color: '#8E90F5' }}>52°</span>
            </div>
            <div className="absolute" style={{ left: '65%', top: '30%', transform: 'translate(-50%, -50%)' }}>
                <span className="text-sm font-bold" style={{ color: '#62D0AD' }}>?°</span>
            </div>
        </div>
    );
}

// Problem 3: Semicircle - Identify the 90° angle
function Problem3Diagram() {
    const RADIUS = 3;

    // Diameter
    const dStart: [number, number] = [-RADIUS, 0];
    const dEnd: [number, number] = [RADIUS, 0];
    // Point on semicircle
    const vertex: [number, number] = [RADIUS * Math.cos(Math.PI * 0.6), RADIUS * Math.sin(Math.PI * 0.6)];

    return (
        <div className="relative">
            <Cartesian2D
                height={280}
                viewBox={{ x: [-4, 4], y: [-2.5, 4] }}
                showGrid={false}
                plots={[
                    { type: "circle", center: [0, 0], radius: RADIUS, color: "#e2e8f0", fillOpacity: 0.03 },
                    // Semicircle arc
                    {
                        type: "parametric",
                        xy: (t: number): [number, number] => [RADIUS * Math.cos(Math.PI * t), RADIUS * Math.sin(Math.PI * t)],
                        tRange: [0, 1],
                        color: "#F8A0CD",
                        weight: 4,
                    },
                    // Diameter
                    { type: "segment", point1: dStart, point2: dEnd, color: "#8E90F5", weight: 4 },
                    // Inscribed angle
                    { type: "segment", point1: vertex, point2: dStart, color: "#AC8BF9", weight: 3 },
                    { type: "segment", point1: vertex, point2: dEnd, color: "#AC8BF9", weight: 3 },
                    // Points
                    { type: "point", x: 0, y: 0, color: "#8E90F5" },
                    { type: "point", x: dStart[0], y: dStart[1], color: "#64748b" },
                    { type: "point", x: dEnd[0], y: dEnd[1], color: "#64748b" },
                    { type: "point", x: vertex[0], y: vertex[1], color: "#AC8BF9" },
                ]}
            />
            {/* Label */}
            <div className="absolute" style={{ left: '40%', top: '28%', transform: 'translate(-50%, -50%)' }}>
                <span className="text-sm font-bold" style={{ color: '#AC8BF9' }}>?°</span>
            </div>
        </div>
    );
}

// Problem 4: Identify the theorem - Centre angle given
function Problem4Diagram() {
    const RADIUS = 3;
    const CENTER: [number, number] = [0, 0];

    const arcStart: [number, number] = [RADIUS * Math.cos(Math.PI * 1.2), RADIUS * Math.sin(Math.PI * 1.2)];
    const arcEnd: [number, number] = [RADIUS * Math.cos(-Math.PI * 0.1), RADIUS * Math.sin(-Math.PI * 0.1)];
    const vertex: [number, number] = [RADIUS * Math.cos(Math.PI * 0.55), RADIUS * Math.sin(Math.PI * 0.55)];

    return (
        <div className="relative">
            <Cartesian2D
                height={260}
                viewBox={{ x: [-4, 4], y: [-4, 4] }}
                showGrid={false}
                plots={[
                    { type: "circle", center: CENTER, radius: RADIUS, color: "#e2e8f0", fillOpacity: 0.03 },
                    // Centre angle
                    { type: "segment", point1: CENTER, point2: arcStart, color: "#F7B23B", weight: 3 },
                    { type: "segment", point1: CENTER, point2: arcEnd, color: "#F7B23B", weight: 3 },
                    // Inscribed angle
                    { type: "segment", point1: vertex, point2: arcStart, color: "#62D0AD", weight: 2 },
                    { type: "segment", point1: vertex, point2: arcEnd, color: "#62D0AD", weight: 2 },
                    // Points
                    { type: "point", x: 0, y: 0, color: "#F7B23B" },
                    { type: "point", x: arcStart[0], y: arcStart[1], color: "#64748b" },
                    { type: "point", x: arcEnd[0], y: arcEnd[1], color: "#64748b" },
                    { type: "point", x: vertex[0], y: vertex[1], color: "#62D0AD" },
                ]}
            />
            {/* Labels */}
            <div className="absolute" style={{ left: '47%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <span className="text-sm font-bold" style={{ color: '#F7B23B' }}>130°</span>
            </div>
        </div>
    );
}

// Problem 5: Mixed - Find angle using semicircle + given angle
function Problem5Diagram() {
    const RADIUS = 3;

    // Diameter
    const dStart: [number, number] = [-RADIUS, 0];
    const dEnd: [number, number] = [RADIUS, 0];
    // Point on semicircle forming triangle
    const vertex: [number, number] = [RADIUS * Math.cos(Math.PI * 0.45), RADIUS * Math.sin(Math.PI * 0.45)];

    return (
        <div className="relative">
            <Cartesian2D
                height={260}
                viewBox={{ x: [-4, 4], y: [-2, 4] }}
                showGrid={false}
                plots={[
                    { type: "circle", center: [0, 0], radius: RADIUS, color: "#e2e8f0", fillOpacity: 0.03 },
                    // Semicircle arc
                    {
                        type: "parametric",
                        xy: (t: number): [number, number] => [RADIUS * Math.cos(Math.PI * t), RADIUS * Math.sin(Math.PI * t)],
                        tRange: [0, 1],
                        color: "#F8A0CD",
                        weight: 3,
                    },
                    // Triangle
                    { type: "segment", point1: dStart, point2: dEnd, color: "#8E90F5", weight: 3 },
                    { type: "segment", point1: vertex, point2: dStart, color: "#F8A0CD", weight: 3 },
                    { type: "segment", point1: vertex, point2: dEnd, color: "#F8A0CD", weight: 3 },
                    // Points
                    { type: "point", x: 0, y: 0, color: "#8E90F5" },
                    { type: "point", x: dStart[0], y: dStart[1], color: "#64748b" },
                    { type: "point", x: dEnd[0], y: dEnd[1], color: "#64748b" },
                    { type: "point", x: vertex[0], y: vertex[1], color: "#F8A0CD" },
                ]}
            />
            {/* Labels */}
            <div className="absolute" style={{ left: '48%', top: '30%', transform: 'translate(-50%, -50%)' }}>
                <span className="text-xs font-medium text-slate-500">90°</span>
            </div>
            <div className="absolute" style={{ left: '22%', top: '72%', transform: 'translate(-50%, -50%)' }}>
                <span className="text-sm font-bold" style={{ color: '#8E90F5' }}>25°</span>
            </div>
            <div className="absolute" style={{ left: '78%', top: '72%', transform: 'translate(-50%, -50%)' }}>
                <span className="text-sm font-bold" style={{ color: '#F8A0CD' }}>?°</span>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Blocks
// ─────────────────────────────────────────────────────────────────────────────

export const practiceBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-practice-heading" maxWidth="xl">
        <Block id="practice-heading" padding="lg">
            <EditableH2 id="h2-practice-heading" blockId="practice-heading">
                Putting It All Together
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-practice-intro" maxWidth="xl">
        <Block id="practice-intro" padding="sm">
            <EditableParagraph id="para-practice-intro" blockId="practice-intro">
                Now it's time to apply the three circle theorems you've learned. For each problem, look at the diagram carefully, identify which theorem applies, and calculate the unknown angle. Remember: the angle at the centre is twice the inscribed angle, angles in the same segment are equal, and an angle in a semicircle is 90°.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Problem 1: Centre angle theorem
    <StackLayout key="layout-practice-problem1-heading" maxWidth="xl">
        <Block id="practice-problem1-heading" padding="md">
            <EditableH3 id="h3-practice-problem1-heading" blockId="practice-problem1-heading">
                Problem 1
            </EditableH3>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-practice-problem1" ratio="1:1" gap="lg">
        <Block id="practice-problem1-diagram" padding="sm" hasVisualization>
            <Problem1Diagram />
        </Block>
        <Block id="practice-problem1-question" padding="sm">
            <EditableParagraph id="para-practice-problem1-question" blockId="practice-problem1-question">
                The amber angle at the centre is 70°. The teal angle is inscribed on the circumference and subtends the same arc. What is the inscribed angle?{" "}
                <InlineFeedback
                    varName="answerCentreTheorem"
                    correctValue="35"
                    position="terminal"
                    successMessage="Correct! The inscribed angle is half the centre angle: 70° ÷ 2 = 35°"
                    failureMessage="Not quite"
                    hint="The inscribed angle is half the angle at the centre"
                    reviewBlockId="centre-discovery"
                    reviewLabel="Review the centre angle theorem"
                >
                    <InlineClozeInput
                        varName="answerCentreTheorem"
                        correctAnswer="35"
                        {...clozePropsFromDefinition(getVariableInfo('answerCentreTheorem'))}
                    />
                </InlineFeedback>°
            </EditableParagraph>
        </Block>
    </SplitLayout>,

    // Problem 2: Same segment
    <StackLayout key="layout-practice-problem2-heading" maxWidth="xl">
        <Block id="practice-problem2-heading" padding="md">
            <EditableH3 id="h3-practice-problem2-heading" blockId="practice-problem2-heading">
                Problem 2
            </EditableH3>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-practice-problem2" ratio="1:1" gap="lg">
        <Block id="practice-problem2-diagram" padding="sm" hasVisualization>
            <Problem2Diagram />
        </Block>
        <Block id="practice-problem2-question" padding="sm">
            <EditableParagraph id="para-practice-problem2-question" blockId="practice-problem2-question">
                Both angles are inscribed in the same segment, looking at the same chord from the same side. The indigo angle is 52°. What is the teal angle?{" "}
                <InlineFeedback
                    varName="answerSameSegment"
                    correctValue="52"
                    position="terminal"
                    successMessage="Exactly! Angles in the same segment are always equal"
                    failureMessage="Not quite"
                    hint="Angles inscribed in the same segment are always..."
                    reviewBlockId="segment-discovery"
                    reviewLabel="Review the same segment theorem"
                >
                    <InlineClozeInput
                        varName="answerSameSegment"
                        correctAnswer="52"
                        {...clozePropsFromDefinition(getVariableInfo('answerSameSegment'))}
                    />
                </InlineFeedback>°
            </EditableParagraph>
        </Block>
    </SplitLayout>,

    // Problem 3: Semicircle
    <StackLayout key="layout-practice-problem3-heading" maxWidth="xl">
        <Block id="practice-problem3-heading" padding="md">
            <EditableH3 id="h3-practice-problem3-heading" blockId="practice-problem3-heading">
                Problem 3
            </EditableH3>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-practice-problem3" ratio="1:1" gap="lg">
        <Block id="practice-problem3-diagram" padding="sm" hasVisualization>
            <Problem3Diagram />
        </Block>
        <Block id="practice-problem3-question" padding="sm">
            <EditableParagraph id="para-practice-problem3-question" blockId="practice-problem3-question">
                The indigo line is a diameter (it passes through the centre). The violet point is on the semicircle. What is the inscribed angle at the violet point?{" "}
                <InlineFeedback
                    varName="answerSemicircle"
                    correctValue="90"
                    position="terminal"
                    successMessage="Perfect! An angle inscribed in a semicircle is always 90°"
                    failureMessage="Not quite"
                    hint="What is special about angles inscribed in a semicircle?"
                    reviewBlockId="semicircle-discovery"
                    reviewLabel="Review the semicircle theorem"
                >
                    <InlineClozeInput
                        varName="answerSemicircle"
                        correctAnswer="90"
                        {...clozePropsFromDefinition(getVariableInfo('answerSemicircle'))}
                    />
                </InlineFeedback>°
            </EditableParagraph>
        </Block>
    </SplitLayout>,

    // Problem 4: Identify the theorem
    <StackLayout key="layout-practice-problem4-heading" maxWidth="xl">
        <Block id="practice-problem4-heading" padding="md">
            <EditableH3 id="h3-practice-problem4-heading" blockId="practice-problem4-heading">
                Problem 4
            </EditableH3>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-practice-problem4" ratio="1:1" gap="lg">
        <Block id="practice-problem4-diagram" padding="sm" hasVisualization>
            <Problem4Diagram />
        </Block>
        <Block id="practice-problem4-question" padding="sm">
            <EditableParagraph id="para-practice-problem4-question" blockId="practice-problem4-question">
                The centre angle is 130°. To find the inscribed angle, which theorem should you use?{" "}
                <InlineFeedback
                    varName="answerIdentifyTheorem"
                    correctValue="Angle at centre"
                    position="terminal"
                    successMessage="Correct! When you have both a centre angle and an inscribed angle on the same arc, use the angle at centre theorem"
                    failureMessage="Not quite"
                    hint="Which theorem relates centre angles to inscribed angles?"
                >
                    <InlineClozeChoice
                        varName="answerIdentifyTheorem"
                        correctAnswer="Angle at centre"
                        options={["Angle at centre", "Same segment", "Semicircle"]}
                        {...choicePropsFromDefinition(getVariableInfo('answerIdentifyTheorem'))}
                    />
                </InlineFeedback>
            </EditableParagraph>
        </Block>
    </SplitLayout>,

    // Problem 5: Mixed problem
    <StackLayout key="layout-practice-problem5-heading" maxWidth="xl">
        <Block id="practice-problem5-heading" padding="md">
            <EditableH3 id="h3-practice-problem5-heading" blockId="practice-problem5-heading">
                Problem 5
            </EditableH3>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-practice-problem5" ratio="1:1" gap="lg">
        <Block id="practice-problem5-diagram" padding="sm" hasVisualization>
            <Problem5Diagram />
        </Block>
        <Block id="practice-problem5-question" padding="sm">
            <EditableParagraph id="para-practice-problem5-question" blockId="practice-problem5-question">
                This is a triangle inscribed in a semicircle. The angle at the top is 90° (semicircle theorem). The angle at the bottom-left is 25°. Since angles in a triangle sum to 180°, what is the angle at the bottom-right?{" "}
                <InlineFeedback
                    varName="answerMixedProblem"
                    correctValue="65"
                    position="terminal"
                    successMessage="Excellent! 180° - 90° - 25° = 65°. You combined the semicircle theorem with angle sum facts"
                    failureMessage="Not quite"
                    hint="The three angles must sum to 180°. You know two of them: 90° and 25°"
                >
                    <InlineClozeInput
                        varName="answerMixedProblem"
                        correctAnswer="65"
                        {...clozePropsFromDefinition(getVariableInfo('answerMixedProblem'))}
                    />
                </InlineFeedback>°
            </EditableParagraph>
        </Block>
    </SplitLayout>,

    // Conclusion
    <StackLayout key="layout-practice-conclusion" maxWidth="xl">
        <Block id="practice-conclusion" padding="lg">
            <EditableParagraph id="para-practice-conclusion" blockId="practice-conclusion">
                Well done! You've now learned the three core circle theorems: the angle at the centre is twice the inscribed angle, angles in the same segment are equal, and an angle in a semicircle is 90°. These theorems are all connected. They all emerge from the fundamental relationship between angles at the centre and angles on the circumference. Keep practicing, and you'll start to see these patterns everywhere in circle geometry.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
