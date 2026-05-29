/*
 * Behaviour tuning for the oneko pet. The state machine ticks every
 * ~100ms (FRAME_MS), so a "frame" is roughly a hundredth of a wall-clock
 * second; the inline comments translate each value into real time.
 */
export const SPEED = 10;            // px moved toward the cursor per frame
export const FRAME_MS = 100;        // ms between state-machine ticks

export const DISTRACT_CHANCE = 1 / 160;   // ~once per 16 s of chasing
export const DISTRACT_MIN_FRAMES = 90;     // 9 s
export const DISTRACT_MAX_FRAMES = 240;    // 24 s

export const SIT_CHANCE = 1 / 220;         // mid-chase, just stop and sit
export const SIT_MIN_FRAMES = 40;          // 4 s
export const SIT_MAX_FRAMES = 120;         // 12 s

export const IDLE_ACT_CHANCE = 1 / 60;     // how often the cat picks an idle behaviour
export const IDLE_TRIGGER = 6;             // frames of idle before an act can kick in

export const FACT_CHANCE = 1 / 150;        // random-fact roll per frame
export const FACT_COOLDOWN_FRAMES = 300;   // ~10 s minimum between facts
