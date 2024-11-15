import {fromDouble} from "./utils/binary.js";
import {BitVector} from "./utils/bitVector.js";
import {gaussianElimination} from "./utils/gaussianElimination.js";
import {log2} from "./utils/bigIntLog.js";
import {xorShift128Backward} from "./xorshift128.js";



const cmpFn = (a, b) => {
    if (a > b) {
        return -1;
    }
    if (a < b) {
        return 1;
    }
    return 0;
};



const printEquations = (equations) => console.log(equations.map(x => x.toString(2).padStart(129, 0)));

export const UNSAT_RESULT = 'UNSAT';
export const WRONG_RESULT = 'WRONG_RESULT';

export function seedFromSequence(sequence) {
    let state0 = new BitVector(64, (_, index) => 2n ** BigInt(index));
    let state1 = new BitVector(64, (_, index) => 2n ** BigInt(64 + index));
    let equations = [];
    sequence.forEach((val) => {
        const restored = fromDouble(val);
        const lastBitValue = (restored & 1n);
        let equation = (state0.at(0) ^ state0.at(17) ^ state1.at(26)) << 1n | lastBitValue;
        equations.push(equation);
        const s0 = state1;
        let s1 = state0;
        state0 = s0;
        s1 = s1.xor(s1.leftShift(23));
        s1 = s1.xor(s1.rightShift(17));
        s1 = s1.xor(s0);
        s1 = s1.xor(s0.rightShift(26));
        state1 = s1;
    });
    equations = equations.sort(cmpFn);
    let res = gaussianElimination(equations);
    let st0 = 0n;
    let st1 = 0n;
    if (res.includes(1n)) {
        return UNSAT_RESULT;
    }
    const bitsKnown = new Set();
    res.forEach(x => {
        if (x < 2) {
            return;
        }
        const bitIndex = log2(x);
        bitsKnown.add(bitIndex);
        if (!Boolean(x & 1n)) {
            return;
        }
        if (bitIndex <= 64) {
            st0 |= 2n ** (bitIndex - 1n);
        } else {
            st1 |= 2n ** (bitIndex - 65n);
        }
    });
    if (bitsKnown.size < 128) {
        return WRONG_RESULT;
    }
    return [st0, st1];
}


const normalizeCachedSequence = (sequence, batchSize = 62) => {
    const result = [];
    const batch = sequence.slice(0, batchSize).reverse();
    result.push(...batch);
    sequence = sequence.slice(batchSize);
    while (sequence.length >= batchSize) {
        const batch = sequence.slice(0, batchSize).reverse();
        result.push(...batch);
        sequence = sequence.slice(batchSize);
    }
    return result;
}

const MINIMAL_SEQUENCE_LENGTH = 128;
export function seedFromCachedSequence(sequence) {
    sequence = [...sequence];
    let normalizedSequence = normalizeCachedSequence(sequence);
    let shift = 0;
    while (normalizedSequence.length >= MINIMAL_SEQUENCE_LENGTH) {
        let seed = seedFromSequence(normalizedSequence);
        if( ![UNSAT_RESULT, WRONG_RESULT].includes(seed)) {
            return [seed, shift];
        }
        sequence.shift();
        shift++;
        normalizedSequence = normalizeCachedSequence(sequence);
    }
    return UNSAT_RESULT;
}