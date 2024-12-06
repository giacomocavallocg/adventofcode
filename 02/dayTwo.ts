import { read, readFileSync } from "fs";
import { join } from "path";

function validateLevels(upper: number, lower: number): boolean {
  const diff = upper - lower;
  return diff > 0 && diff < 4;
}

function isReportPartOne(report: string): boolean {
  const levels = report.split(" ").map((l) => Number(l));

  let sing = 0;
  for (let i = 0; i < levels.length - 1; i++) {
    if (sing === 0) {
      sing = levels[i] < levels[i + 1] ? 1 : -1;
    }

    const isValid =
      sing > 0
        ? validateLevels(levels[i + 1], levels[i])
        : validateLevels(levels[i], levels[i + 1]);

    if (!isValid) return false;
  }

  return true;
}

function isReportPartTwo(levels: number[], canFail: boolean = true): boolean {
  let sing = 0;
  for (let i = 0; i < levels.length - 1; i++) {
    if (sing === 0) {
      sing = levels[i] < levels[i + 1] ? 1 : -1;
    }

    const isValid =
      sing > 0
        ? validateLevels(levels[i + 1], levels[i])
        : validateLevels(levels[i], levels[i + 1]);

    if (!isValid) {
      if (!canFail) return false;

      return (
        isReportPartTwo(
          levels.filter((e, idx) => i !== idx),
          false
        ) ||
        isReportPartTwo(
          levels.filter((e, idx) => i + 1 !== idx),
          false
        ) ||
        (i === 1 &&
          isReportPartTwo(
            levels.filter((e, idx) => 0 !== idx),
            false
          ))
      );
    }
  }

  return true;
}

function partOne(filename: string): number {
  const contents = readFileSync(join(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);
  return arr.filter((report) => isReportPartOne(report)).length;
}

function partTwo(filename: string): number {
  const contents = readFileSync(join(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);
  return arr.filter((report) => {
    const levels = report.split(" ").map((l) => Number(l));
    return isReportPartTwo(levels);
  }).length;
}

console.log(`Part one solution is ${partOne("input.txt")}`);
console.log(`Part two solution is ${partTwo("input.txt")}`);
