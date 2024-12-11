import { Dir, read, readFileSync } from "fs";
import { join } from "path";

function readInput(filename: string): string[] {
  const contents = readFileSync(join(__dirname, filename), "utf-8");

  return contents.split(" ");
}

function applyRule(stone: string): string[] {
  if (stone === "0") return ["1"];

  if (stone.length % 2 === 0) {
    let left = stone.slice(0, stone.length / 2);
    let right = stone.slice(stone.length / 2, stone.length);

    return [String(Number(left)), String(Number(right))];
  }

  return [String(Number(stone) * 2024)];
}

function blinkStone(stones: string[], blinkNum: number): number {
  let currentStoneMap: Map<string, number> = new Map();
  stones.forEach((s) => currentStoneMap.set(s, 1));
  let i = 0;

  while (i < blinkNum) {
    let stoneMap: Map<string, number> = new Map();

    for (let stone of currentStoneMap.keys()) {
      let occurence = currentStoneMap.get(stone)!;
      let newStones = applyRule(stone);
      newStones.forEach((nw) => {
        if (stoneMap.has(nw)) {
          stoneMap.set(nw, stoneMap.get(nw)! + occurence);
        } else {
          stoneMap.set(nw, occurence);
        }
      });
    }
    i++;
    currentStoneMap = stoneMap;
  }
  return [...currentStoneMap.values()].reduce((p, c) => p + c);
}

function partOne(filename: string): number {
  let stones = readInput(filename);
  return blinkStone(stones, 25);
}

function partTwo(filename: string): number {
  let stones = readInput(filename);

  return blinkStone(stones, 75);
}

console.log(`Part one solution is ${partOne("input.txt")}`);
console.log(`Part two solution is ${partTwo("input.txt")}`);
