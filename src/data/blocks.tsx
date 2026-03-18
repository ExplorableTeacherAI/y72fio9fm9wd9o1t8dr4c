import { type ReactElement } from "react";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors } from "@/stores";
import { getDefaultValues, variableDefinitions } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// Import all sections
import { circleEssentialsBlocks } from "./sections/CircleEssentials";
import { inscribedAnglesBlocks } from "./sections/InscribedAngles";
import { angleAtCentreBlocks } from "./sections/AngleAtCentre";
import { sameSegmentBlocks } from "./sections/SameSegment";
import { semicircleBlocks } from "./sections/Semicircle";
import { practiceBlocks } from "./sections/Practice";

/**
 * Circle Theorems Lesson
 *
 * This lesson teaches the three core circle theorems:
 * 1. Angle at the centre is twice the inscribed angle
 * 2. Angles in the same segment are equal
 * 3. Angle in a semicircle is 90°
 *
 * Students discover each theorem through interactive exploration
 * before formal statements are introduced.
 */

export const blocks: ReactElement[] = [
    ...circleEssentialsBlocks,
    ...inscribedAnglesBlocks,
    ...angleAtCentreBlocks,
    ...sameSegmentBlocks,
    ...semicircleBlocks,
    ...practiceBlocks,
];
