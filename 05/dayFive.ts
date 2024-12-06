import { read, readFileSync } from "fs";
import { join } from "path";

function readMatrix(filename: string): {
  rules: Map<number, number[]>;
  commands: number[][];
} {
  const contents = readFileSync(join(__dirname, filename), "utf-8");

  let rules: Map<number, number[]> = new Map();
  let commands: number[][] = [];
  const arr = contents.split(/\r?\n/);
  let isRulesReaded = false;

  for (let i = 0; i < arr.length; i++) {
    let line = arr[i].trim();

    if (line.trim() === "") {
      isRulesReaded = true;
    } else {
      if (!isRulesReaded) {
        const rule = line.split("|");
        const first = Number(rule[0]);
        const second = Number(rule[1]);
        if (rules.has(second)) rules.get(second)!.push(first);
        else rules.set(second, [first]);
      } else {
        commands.push(line.split(",").map((x) => Number(x)));
      }
    }
  }

  return { rules, commands };
}

type Blist = {
  command: number;
  position: number;
};

function ValidatePartOne(
  command: number[],
  rules: Map<number, number[]>
): number {
  let visited: Set<number> = new Set();
  let blacklist: Set<number> = new Set();
  let medianC = -1;

  const mediaIdx = Math.floor(command.length / 2);

  for (let i = 0; i < command.length; i++) {
    const c = command[i];
    if (blacklist.has(c)) return -1;
    rules.get(c)?.forEach((r) => {
      if (!visited.has(r)) blacklist.add(r);
    });
    visited.add(c);
    if (i === mediaIdx) medianC = c;
  }
  return medianC;
}

function ValidatePartTwo(
  command: number[],
  rules: Map<number, number[]>
): { median: number; anyError: boolean } {
  let visited: Set<number> = new Set();
  let blacklist: Map<number, number> = new Map();
  let medianC = -1;

  const mediaIdx = Math.floor(command.length / 2);
  let error = false;
  let i = 0;

  while (i < command.length) {
    const c = command[i];
    if (blacklist.has(c)) {
      error = true;
      const idx = blacklist.get(c)!;
      const t1 = command[idx];
      command[idx] = c;
      command[i] = t1;

      blacklist.clear();
      visited.clear();
      i = 0;
    } else {
      rules.get(c)?.forEach((r) => {
        if (!visited.has(r)) blacklist.set(r, i);
      });
      visited.add(c);
      if (i === mediaIdx) medianC = c;
      i++;
    }
  }

  return { median: medianC, anyError: error };
}

function partOne(filename: string): number {
  const { rules, commands } = readMatrix(filename);
  return commands
    .map((c) => ValidatePartOne(c, rules))
    .filter((m) => m > 0)
    .reduce((p, c) => p + c);
}

function partTwo(filename: string): number {
  const { rules, commands } = readMatrix(filename);
  return commands
    .map((c) => ValidatePartTwo(c, rules))
    .filter((m) => m.anyError)
    .reduce((p, c) => p + c.median, 0);
}

console.log(`Part one solution is ${partOne("input.txt")}`);
console.log(`Part two solution is ${partTwo("input.txt")}`);
