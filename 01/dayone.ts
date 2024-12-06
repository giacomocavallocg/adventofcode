import { readFileSync } from "fs";
import { join } from "path";

function readInput(filename: string): { list1: number[]; list2: number[] } {
  const contents = readFileSync(join(__dirname, filename), "utf-8");

  const list1: number[] = [];
  const list2: number[] = [];

  const arr = contents.split(/\r?\n/);
  arr.forEach((line) => {
    const linePart = line.split(/\s\s+/g);

    list1.push(Number(linePart[0]));
    list2.push(Number(linePart[1]));
  });

  return { list1: list1, list2: list2 };
}

function partOne(filePath: string): number {
  let { list1, list2 } = readInput(filePath);

  list1 = list1.sort((n1, n2) => n1 - n2);
  list2 = list2.sort((n1, n2) => n1 - n2);

  return list1.reduce((p, e, i, _) => {
    return p + Math.abs(e - list2[i]);
  }, 0);
}

function partTwo(filePath: string): number {
  let { list1, list2 } = readInput(filePath);
  list1 = list1.sort((n1, n2) => n1 - n2);
  list2 = list2.sort((n1, n2) => n1 - n2);

  let visited = new Set();
  let j = 0;

  return list1.reduce((p, e) => {
    let count = 0;

    if (visited.has(e)) return p;

    while (list2[j]) {
      if (e < list2[j]) break;
      count += Number(e === list2[j]);
      j++;
    }

    visited.add(e);

    return p + e * count;
  }, 0);
}

console.log(`Part one solution is ${partOne("input.txt")}`);
console.log(`Part two solution is ${partTwo("input.txt")}`);
