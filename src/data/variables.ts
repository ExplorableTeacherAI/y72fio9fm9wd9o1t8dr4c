/**
 * Variables Configuration
 * =======================
 * 
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 * 
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 * 
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /** Correct answer for cloze input validation */
    correctAnswer?: string;
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 DEFINE YOUR VARIABLES HERE
 * =====================================================
 * 
 * SUPPORTED TYPES:
 * 
 * 1. NUMBER (slider):
 *    { defaultValue: 5, type: 'number', min: 0, max: 10, step: 1 }
 * 
 * 2. TEXT (free text):
 *    { defaultValue: 'Hello', type: 'text', placeholder: 'Enter text...' }
 * 
 * 3. SELECT (dropdown):
 *    { defaultValue: 'sine', type: 'select', options: ['sine', 'cosine', 'tangent'] }
 * 
 * 4. BOOLEAN (toggle):
 *    { defaultValue: true, type: 'boolean' }
 * 
 * 5. ARRAY (list of numbers):
 *    { defaultValue: [1, 2, 3], type: 'array' }
 * 
 * 6. OBJECT (complex data):
 *    { defaultValue: { x: 5, y: 10 }, type: 'object', schema: '{ x: number, y: number }' }
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ========================================
    // CIRCLE THEOREMS LESSON VARIABLES
    // ========================================

    // ─────────────────────────────────────────
    // Section 1: Circle Essentials - Draw Your Own
    // ─────────────────────────────────────────
    circleHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Circle Part Highlight',
        description: 'Currently highlighted circle part',
    },
    essentialsStep: {
        defaultValue: 0,
        type: 'number',
        label: 'Essentials Step',
        description: 'Current step in the draw-your-own essentials section',
        min: 0,
        max: 4,
        step: 1,
    },

    // ─────────────────────────────────────────
    // Section 2: Inscribed Angles - Multiple angles
    // ─────────────────────────────────────────
    inscribedAngle1: {
        defaultValue: 45,
        type: 'number',
        label: 'Inscribed Angle 1',
        description: 'First inscribed angle in degrees',
        unit: '°',
        min: 10,
        max: 170,
        step: 1,
        color: '#62D0AD',
    },
    inscribedAngle2: {
        defaultValue: 45,
        type: 'number',
        label: 'Inscribed Angle 2',
        description: 'Second inscribed angle in degrees',
        unit: '°',
        min: 10,
        max: 170,
        step: 1,
        color: '#8E90F5',
    },
    inscribedAngle3: {
        defaultValue: 45,
        type: 'number',
        label: 'Inscribed Angle 3',
        description: 'Third inscribed angle in degrees',
        unit: '°',
        min: 10,
        max: 170,
        step: 1,
        color: '#AC8BF9',
    },

    // ─────────────────────────────────────────
    // Section 3: Angle at Centre Theorem
    // ─────────────────────────────────────────
    centreAngle: {
        defaultValue: 90,
        type: 'number',
        label: 'Centre Angle',
        description: 'Angle at the centre in degrees',
        unit: '°',
        min: 20,
        max: 340,
        step: 1,
        color: '#F7B23B',
    },
    circumferenceAngle: {
        defaultValue: 45,
        type: 'number',
        label: 'Circumference Angle',
        description: 'Inscribed angle at circumference in degrees',
        unit: '°',
        min: 10,
        max: 170,
        step: 1,
        color: '#62D0AD',
    },

    // ─────────────────────────────────────────
    // Section 4: Angles in Same Segment
    // ─────────────────────────────────────────
    segmentAngle1: {
        defaultValue: 50,
        type: 'number',
        label: 'Segment Angle 1',
        description: 'First angle in same segment',
        unit: '°',
        min: 10,
        max: 170,
        step: 1,
        color: '#62D0AD',
    },
    segmentAngle2: {
        defaultValue: 50,
        type: 'number',
        label: 'Segment Angle 2',
        description: 'Second angle in same segment',
        unit: '°',
        min: 10,
        max: 170,
        step: 1,
        color: '#8E90F5',
    },
    segmentAngle3: {
        defaultValue: 50,
        type: 'number',
        label: 'Segment Angle 3',
        description: 'Third angle in same segment',
        unit: '°',
        min: 10,
        max: 170,
        step: 1,
        color: '#AC8BF9',
    },

    // ─────────────────────────────────────────
    // Section 5: Angle in Semicircle
    // ─────────────────────────────────────────
    semicircleAngle: {
        defaultValue: 90,
        type: 'number',
        label: 'Semicircle Angle',
        description: 'Angle inscribed in semicircle',
        unit: '°',
        min: 90,
        max: 90,
        step: 1,
        color: '#62D0AD',
    },
    semicirclePointAngle: {
        defaultValue: 60,
        type: 'number',
        label: 'Semicircle Point Position',
        description: 'Position of point on semicircle in degrees',
        unit: '°',
        min: 10,
        max: 170,
        step: 1,
    },

    // ─────────────────────────────────────────
    // Section 6: Practice Questions - Answers
    // ─────────────────────────────────────────
    answerCentreTheorem: {
        defaultValue: '',
        type: 'text',
        label: 'Centre Theorem Answer',
        description: 'Student answer for centre theorem question',
        placeholder: '?',
        correctAnswer: '35',
        color: '#62D0AD',
    },
    answerSameSegment: {
        defaultValue: '',
        type: 'text',
        label: 'Same Segment Answer',
        description: 'Student answer for same segment question',
        placeholder: '?',
        correctAnswer: '52',
        color: '#8E90F5',
    },
    answerSemicircle: {
        defaultValue: '',
        type: 'text',
        label: 'Semicircle Answer',
        description: 'Student answer for semicircle question',
        placeholder: '?',
        correctAnswer: '90',
        color: '#AC8BF9',
    },
    answerIdentifyTheorem: {
        defaultValue: '',
        type: 'select',
        label: 'Identify Theorem Answer',
        description: 'Student identifies which theorem to use',
        placeholder: '???',
        correctAnswer: 'Angle at centre',
        options: ['Angle at centre', 'Same segment', 'Semicircle'],
        color: '#F7B23B',
    },
    answerMixedProblem: {
        defaultValue: '',
        type: 'text',
        label: 'Mixed Problem Answer',
        description: 'Student answer for mixed problem',
        placeholder: '?',
        correctAnswer: '65',
        color: '#F8A0CD',
    },

    // ─────────────────────────────────────────
    // Section 1: Quick Check Questions
    // ─────────────────────────────────────────
    answerRadiusDefinition: {
        defaultValue: '',
        type: 'select',
        label: 'Radius Definition Answer',
        description: 'Student answer for radius definition',
        placeholder: '???',
        correctAnswer: 'centre to edge',
        options: ['edge to edge', 'centre to edge', 'around the circle'],
        color: '#62D0AD',
    },
    answerChordVsDiameter: {
        defaultValue: '',
        type: 'select',
        label: 'Chord vs Diameter Answer',
        description: 'Student answer for chord vs diameter',
        placeholder: '???',
        correctAnswer: 'the diameter',
        options: ['any chord', 'the diameter', 'the radius'],
        color: '#8E90F5',
    },

    // ─────────────────────────────────────────
    // Section 2: Quick Check Questions
    // ─────────────────────────────────────────
    answerInscribedDefinition: {
        defaultValue: '',
        type: 'select',
        label: 'Inscribed Angle Definition',
        description: 'Student identifies where inscribed angle vertex is',
        placeholder: '???',
        correctAnswer: 'on the circumference',
        options: ['at the centre', 'on the circumference', 'outside the circle'],
        color: '#62D0AD',
    },

    // ─────────────────────────────────────────
    // Section 3: Quick Check Questions
    // ─────────────────────────────────────────
    answerCentreAngleRelation: {
        defaultValue: '',
        type: 'text',
        label: 'Centre Angle Relation Answer',
        description: 'Student answer for the relationship',
        placeholder: '?',
        correctAnswer: '2',
        color: '#F7B23B',
    },
    answerCentreAngleCalculation: {
        defaultValue: '',
        type: 'text',
        label: 'Centre Angle Calculation',
        description: 'Calculate inscribed angle from centre angle of 124°',
        placeholder: '?',
        correctAnswer: '62',
        color: '#62D0AD',
    },

    // ─────────────────────────────────────────
    // Section 4: Quick Check Questions
    // ─────────────────────────────────────────
    answerSameSegmentWhy: {
        defaultValue: '',
        type: 'select',
        label: 'Same Segment Why',
        description: 'Why are angles in same segment equal',
        placeholder: '???',
        correctAnswer: 'same arc',
        options: ['same chord', 'same arc', 'same radius'],
        color: '#8E90F5',
    },

    // ─────────────────────────────────────────
    // Section 5: Quick Check Questions
    // ─────────────────────────────────────────
    answerSemicircleWhy: {
        defaultValue: '',
        type: 'select',
        label: 'Semicircle Why',
        description: 'Why is angle in semicircle 90°',
        placeholder: '???',
        correctAnswer: '180° ÷ 2 = 90°',
        options: ['180° ÷ 2 = 90°', '360° ÷ 4 = 90°', '90° is special'],
        color: '#AC8BF9',
    },
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
