// Shared motion vocabulary: exponential ease-outs and critically damped springs.
export const easeOut = [0.16, 1, 0.3, 1] as const;
export const spring = { type: "spring", bounce: 0, duration: 0.45 } as const;
