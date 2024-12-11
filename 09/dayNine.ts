import { Dir, read, readFileSync } from "fs";
import { join } from "path";

function readInput(filename: string): number[] {
  const contents = readFileSync(join(__dirname, filename), "utf-8");

  const arr = contents.split("");

  return arr.map((s) => Number(s));
}

function defraAndCheckSum(memory: number[]): number {
  let i = 0;
  let j = memory.length - 1;
  let checkSum = 0;
  let idx = 0;
  while (i <= j) {
    const isFile = i % 2 === 0;
    if (isFile) {
      while (memory[i] > 0) {
        checkSum += idx * (i / 2);
        idx++;
        memory[i]--;
      }
    } else {
      while (memory[i] > 0 && i <= j) {
        if (j % 2 !== 0) {
          if (j === i) break;
          j--;
        } else if (memory[j] > 0) {
          checkSum += idx * (j / 2);
          idx++;
          memory[j]--;
          memory[i]--;
        } else {
          j--;
        }
      }
    }
    i++;
  }

  return checkSum;
}

function defraAndCheckSum2(memory: number[]): number {
  let i = 0;
  let checkSum = 0;
  let idx = 0;

  while (i < memory.length) {
    const isFile = i % 2 === 0;
    if (isFile) {
      if (memory[i] < 0) {
        while (memory[i] < 0) {
          idx++;
          memory[i]++;
        }
      }
      while (memory[i] > 0) {
        checkSum += idx * (i / 2);
        idx++;
        memory[i]--;
      }
      i++;
    } else {
      let j = memory.length - 1;
      while (j > i) {
        if (j % 2 === 0 && memory[j] > 0 && memory[j] <= memory[i]) break;
        j--;
      }

      if (j === i) {
        while (memory[i] > 0) {
          idx++;
          memory[i]--;
        }
        i++;
      } else {
        let value = memory[j];
        while (value > 0) {
          checkSum += idx * (j / 2);

          idx++;

          memory[i]--;
          value--;
        }

        memory[j] = -memory[j];

        if (memory[i] === 0) {
          i++;
        }
      }
    }
  }

  return checkSum;
}

function partOne(filename: string): number {
  let memory = readInput(filename);
  return defraAndCheckSum(memory);
}

function partTwo(filename: string): number {
  let memory = readInput(filename);
  return defraAndCheckSum2(memory);
}

console.log(`Part one solution is ${partOne("input.txt")}`);
console.log(`Part two solution is ${partTwo("input.txt")}`);
