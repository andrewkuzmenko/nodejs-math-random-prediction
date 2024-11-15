import {INT_64_MASK} from "./binary.js";

/*
uint64_t RandomNumberGenerator::MurmurHash3(uint64_t h) {
  h ^= h >> 33;
  h *= V8_UINT64_C(0xFF51AFD7ED558CCD);
  h ^= h >> 33;
  h *= V8_UINT64_C(0xC4CEB9FE1A85EC53);
  h ^= h >> 33;
  return h;
}
 */
export function murmurHash3(h) {
    h ^= (h >> 33n) & INT_64_MASK;
    h = ( h * 0xFF51AFD7ED558CCDn) & INT_64_MASK;
    h ^= (h >> 33n) & INT_64_MASK;
    h = ( h * 0xC4CEB9FE1A85EC53n) & INT_64_MASK;
    h ^= (h >> 33n) & INT_64_MASK;
    return h;
}

