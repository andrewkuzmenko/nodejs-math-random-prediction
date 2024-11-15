export const INT_64_MASK = 0xFFFFFFFFFFFFFFFFn;

export function bigIntToFloat64 (bigNumber) {
    const bits = 8n;
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    for (let i = 0; i < 8; i++) {
        const nextBits = Number((bigNumber >> (bits * BigInt(i))) & 0xFFn);
        view.setUint8(i, nextBits);
    }
    return view.getFloat64(0,true);
}

export function float64ToBigInt(n) {
    const buffer = new Float64Array([n]).buffer;
    const view = new DataView(buffer);
    return view.getBigInt64(0, true);
}



// kExponentBits
export const EXPONENT_BITS = 0x3FF0000000000000n;

// kMantissaMask
export const MANTISSA_MASK = 0x000FFFFFFFFFFFFFn;

/*

  // Static and exposed for external use.
  static inline double ToDouble(uint64_t state0, uint64_t state1) {
    // Exponent for double values for [1.0 .. 2.0)
    static const uint64_t kExponentBits = V8_UINT64_C(0x3FF0000000000000);
    static const uint64_t kMantissaMask = V8_UINT64_C(0x000FFFFFFFFFFFFF);
    uint64_t random = ((state0 + state1) & kMantissaMask) | kExponentBits;
    return bit_cast<double>(random) - 1;
  }

 */
export function toDouble(out) {
    const random = (BigInt(out) & MANTISSA_MASK) | EXPONENT_BITS;
    return bigIntToFloat64(random) - 1.0;
}

export function fromDouble(num) {
    return  (float64ToBigInt(num + 1) & INT_64_MASK) & MANTISSA_MASK;
}