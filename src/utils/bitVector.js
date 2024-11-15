export class BitVector {
    static defaultSize = 64;
    constructor(size = BitVector.defaultSize, mapFn = (el, index) => 0n) {
       this.values = Array.from(Array(size), mapFn);
    }


    static from(arrayLike) {
        const values = Array.from(arrayLike);
        return new BitVector(values.length, (el, index) => {
            return values.at(index);
        });
    }

    static fromVector(vector) {
        return new BitVector(vector.size, (el, index) => vector.at(index));
    }
    get size() {
        return this.values.length;
    }
    at(index) {
        return this.values.at(index);
    }

    leftShift(n) {
        return BitVector.from(Array(n).fill(0n).concat(this.values.slice(0, this.size - n)));
    }

    rightShift(n) {
        return BitVector.from(this.values.slice(n).concat(Array(n).fill(0n)));
    }

    xor(vector) {
        return new BitVector(this.size, (el, index) => vector.at(index) ^ this.at(index));
    }

    map(mapFn) {
        return this.values.map(mapFn);
    }
    toString() {
        return this.values.toString();
    }

    getCopy() {
        return BitVector.fromVector(this);
    }
}