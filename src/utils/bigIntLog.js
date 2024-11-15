export function log2(bigint) {
    const n = bigint.toString(2).length;
    return bigint > 0n ? BigInt(n - 1) : null;
}