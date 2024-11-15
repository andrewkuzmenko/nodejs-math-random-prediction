import {CachedRandom} from './src/random.js';
import {seedFromCachedSequence,} from './src/seedFromSequence.js';
import sequence from './seq.json' assert { type: 'json' };
const cacheSize = 62;

let [restored, shift] = seedFromCachedSequence(sequence.seq);

const cachedRandomGenerator = new CachedRandom(cacheSize, {state0: restored[0], state1:restored[1],});
if (shift) {
    for (let i= 0 ; i < cacheSize; i++) {
        cachedRandomGenerator.randomGenerator.backward();
    }
    cachedRandomGenerator.refillCache();
    cachedRandomGenerator.currentIndex = shift;
}
const seq = Array.from(Array(sequence.seq.length), () => cachedRandomGenerator.random());
const predicted = Array.from(Array(5), () => cachedRandomGenerator.random());
console.log(predicted);
