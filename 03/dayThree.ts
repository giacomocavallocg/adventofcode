import { read, readFileSync } from "fs";
import { join } from "path";

function partOne(filename: string): number {
  const contents = readFileSync(join(__dirname, filename), "utf-8");

  const command = contents.replace(/\s/g, "");

  const re = /(mul\((\d{1,3}),(\d{1,3})\))/g;
  let match;
  let total = 0;
  do {
    match = re.exec(command);
    if (match) {
      total = total + Number(match[2]) * Number(match[3]);
    }
  } while (match);

  return total;
}

function partTwo(filename: string): number {
  const contents = readFileSync(join(__dirname, filename), "utf-8");

  const command = contents.replace(/\s/g, "");

  const re = /(mul\((\d{1,3}),(\d{1,3})\))|(do\(\))|(don't\(\))/g;
  let match;
  let total = 0;
  let active = true;

  do {
    match = re.exec(command);
    if (match) {
      if (match[0] === "don't()") {
        active = false;
      } else if (match[0] === "do()") {
        active = true;
      } else if (active) {
        total = total + Number(match[2]) * Number(match[3]);
      }
    }
  } while (match);

  return total;
}

console.log(`Part one solution is ${partOne("input.txt")}`);
console.log(`Part two solution is ${partTwo("input.txt")}`);
