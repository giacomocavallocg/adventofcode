import { Dir, read, readFileSync } from "fs";
import { join } from "path";

function readInput(filename: string): {
  map: number[][];
  startingPoint: number[][];
} {
  const contents = readFileSync(join(__dirname, filename), "utf-8");

  const map: number[][] = [];
  const startingPoint: number[][] = [];
  const arr = contents.split(/\r?\n/);

  for (let i = 0; i < arr.length; i++) {
    map[i] = [];

    arr[i].split("").forEach((x, j) => {
      const n = x === "." ? -1 : Number(x);
      map[i].push(n);
      if (n === 0) {
        startingPoint.push([i, j]);
      }
    });
  }

  return { map, startingPoint };
}

function findValidNeighbors(x: number, y: number, map: number[][]) {
  const candidates = [
    [x - 1, y],
    [x + 1, y],
    [x, y + 1],
    [x, y - 1],
  ];
  return candidates.filter((c) => {
    const [cx, cy] = c;

    return (
      cx >= 0 &&
      cx < map.length &&
      cy >= 0 &&
      cy < map[0].length &&
      map[x][y] + 1 === map[cx][cy]
    );
  });
}

function findTrailheads(start: number[], map: number[][]) {
  let toVisit: number[][] = [start];
  const visited: Set<string> = new Set();
  let score = 0;

  while (toVisit.length > 0) {
    let [x, y] = toVisit.shift()!;

    if (visited.has(`${x}_${y}`)) continue;

    if (map[x][y] === 9) {
      score += 1;
    } else {
      findValidNeighbors(x, y, map).forEach((n) => {
        if (!visited.has(`${n[0]}_${n[1]}`)) {
          toVisit.push(n);
        }
      });
    }

    visited.add(`${x}_${y}`);
  }

  return score;
}

function recorsivefindTrailheads(
  x: number,
  y: number,
  map: number[][]
): number {
  if (map[x][y] === 9) {
    return 1;
  }

  const neighbors = findValidNeighbors(x, y, map);
  if (neighbors.length === 0) return 0;

  return neighbors!.reduce((p, c) => {
    p = p + recorsivefindTrailheads(c[0], c[1], map);
    return p;
  }, 0);
}

function partOne(filename: string): number {
  let { map, startingPoint } = readInput(filename);

  return startingPoint
    .map((sp) => findTrailheads(sp, map))
    .reduce((p, c) => p + c);
}

function partTwo(filename: string): number {
  let { map, startingPoint } = readInput(filename);

  return startingPoint
    .map((sp) => recorsivefindTrailheads(sp[0], sp[1], map))
    .reduce((p, c) => p + c);
}

console.log(`Part one solution is ${partOne("input.txt")}`);
console.log(`Part two solution is ${partTwo("input.txt")}`);
