import {xorShift128, xorShift128Backward} from "./xorshift128.js";
import {toDouble} from "./utils/binary.js";


//some random seed
export const DEFAULT_STATE_0 = 9297814886316923340n;
export const DEFAULT_STATE_1 = 3534707431943866523n;
export const DEFAULT_CACHE_SIZE = 64;

export class Random {
    constructor(state0 = DEFAULT_STATE_0, state1 = DEFAULT_STATE_1) {
        this.setSeed(state0, state1);
    }

    setSeed(state0, state1) {
        this.state0 = state0;
        this.state1 = state1;
    }

    random() {
        const [state0, state1] = xorShift128(this.state0, this.state1);
        this.setSeed(state0, state1);
        return toDouble(state0+state1);
    }

    backward() {
        const [state0, state1] = xorShift128Backward(this.state0, this.state1);
        this.setSeed(state0, state1);
        return toDouble(state0+state1);
    }
}

export class CachedRandom {

    cache = [];
    currentIndex = 0;

    constructor(cacheSize = DEFAULT_CACHE_SIZE, {state0, state1} = {}) {
        this.cacheSize = cacheSize;
        this.randomGenerator = new Random(state0, state1);
    }

    refillCache(){
        for (let i = 0; i < this.cacheSize; i++) {
            this.cache[i] = this.randomGenerator.random();
        }
        this.currentIndex = this.cacheSize - 1;
    }

    refillCacheBackward(){
        for (let i = 0; i < this.cacheSize; i++) {
            this.cache[this.cacheSize-1-i] = this.randomGenerator.backward();
        }
        this.currentIndex = 0;
    }

    random() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.refillCache();
        }
        return this.cache[this.currentIndex];
    }

    backward() {
        this.currentIndex++;
        if (this.currentIndex >= this.cache.length) {
            this.refillCacheBackward();
        }
        return this.cache[this.currentIndex];
    }

    setSeed(state0, state1) {
        this.randomGenerator.setSeed(state0, state1);
    }

    current() {
        return this.cache[this.currentIndex];
    }
}