import {log2} from "./bigIntLog.js";

const cmpFn = (a, b) => {
    if (a > b) {
        return -1;
    }
    if (a < b) {
        return 1;
    }
    return 0;
};

export const gaussianElimination = (equations) => {
    const result = Array.from(new Set(equations)).sort(cmpFn);
    for (let i = 0; i < result.length; i++) {
        const currentRow = result[i];
        if (currentRow < 1n) {
            continue;
        }
        const forwardBit = log2(currentRow);
        for (let j = 0; j < result.length; j++) {
            if (i === j) {
                continue;
            }
            if (Boolean(result[j] & (2n ** forwardBit))) {
                result[j] ^= currentRow;
            }
        }
    }
    return Array.from(new Set(result)).sort(cmpFn);
};