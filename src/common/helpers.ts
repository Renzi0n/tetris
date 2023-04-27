export function getRandomInt<T extends unknown>(numOrRange: T[]): T;
export function getRandomInt(numOrRange: number): number;
export function getRandomInt(numOrRange: number | unknown[]) {
  if (Array.isArray(numOrRange)) {
    return numOrRange[Math.floor(Math.random() * numOrRange.length)];
  }

  return Math.floor(Math.random() * numOrRange);
}

export function getRandomIntFromRange(min: number, max: number) {
  let difference = max - min;
  let rand = Math.random();
  rand = Math.floor( rand * difference);
  rand = rand + min;

  return rand;
}