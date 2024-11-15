import {INT_64_MASK} from "./utils/binary.js";


/*
 // Static and exposed for external use.
  static inline void XorShift128(uint64_t* state0, uint64_t* state1) {
    uint64_t s1 = *state0;
    uint64_t s0 = *state1;
    *state0 = s0;
    s1 ^= s1 << 23;
    s1 ^= s1 >> 17;
    s1 ^= s0;
    s1 ^= s0 >> 26;
    *state1 = s1;
  }
 */
export function xorShift128(state0, state1) {
    let s0, s1;
    s1 = state0;
    s0 = state1;
    s1 ^= (s1 << 23n) & INT_64_MASK;
    s1 ^= (s1 >> 17n);
    s1 ^= s0;
    s1 ^= (s0 >> 26n);
    state0 = state1;
    state1 = s1;
    return [state0, state1];
}


export function reverse17(val) {
    return (((val ^ (val >> 17n)) ^ (val >> 34n)) ^ (val >> 51n));
}
export function reverse23(val) {
    return (((val ^ (val << 23n)) ^ (val << 46n)) & INT_64_MASK);
}
export function xorShift128Backward(state0, state1) {
    let prev_state0, prev_state1;
    prev_state1 = state0;
    prev_state0 = (state1 ^ (state0 >> 26n));
    prev_state0 = (prev_state0 ^ state0);
    prev_state0 = reverse17(prev_state0);
    prev_state0 = reverse23(prev_state0);
    return [prev_state0, prev_state1];
}
