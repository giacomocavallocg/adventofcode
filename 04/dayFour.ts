import { read, readFileSync } from "fs";
import { join } from "path";

function readMatrix(filename: string): string[][] {
  const contents = readFileSync(join(__dirname, filename), "utf-8");
  let matrix: string[][] = [];
  const arr = contents.split(/\r?\n/);
  arr.forEach((line, idx) => {
    matrix[idx] = line.split("");
  });

  return matrix;
}

/*
8	1	2
7	O	3
6	5	4
*/
function getNext(
  direction: number,
  x: number,
  y: number
): { nextX: number; nextY: number } {
  if (direction === 1) return { nextX: x - 1, nextY: y };
  else if (direction === 2) return { nextX: x - 1, nextY: y + 1 };
  else if (direction === 3) return { nextX: x, nextY: y + 1 };
  else if (direction === 4) return { nextX: x + 1, nextY: y + 1 };
  else if (direction === 5) return { nextX: x + 1, nextY: y };
  else if (direction === 6) return { nextX: x + 1, nextY: y - 1 };
  else if (direction === 7) return { nextX: x, nextY: y - 1 };
  else if (direction === 8) return { nextX: x - 1, nextY: y - 1 };
  throw Error("Invalid direction");
}

function isXMas(
  matrix: string[][],
  x: number,
  y: number,
  direction: number,
  currentXmas: string
): boolean {
  if (x < 0 || x >= matrix.length) return false;
  if (y < 0 || y >= matrix[0].length) return false;

  const currentChar = matrix[x][y];
  let { nextX, nextY } = getNext(direction, x, y);

  if (currentChar === "X") return false;

  if (currentChar === "M" && currentXmas === "X") {
    return isXMas(matrix, nextX, nextY, direction, "XM");
  }

  if (currentChar === "A" && currentXmas === "XM") {
    return isXMas(matrix, nextX, nextY, direction, "XMA");
  }

  if (currentChar === "S" && currentXmas === "XMA") {
    return true;
  }

  return false;
}

/*

M . M
. A .
S . S

*/

function isMas(matrix: string[][], centerX: number, centerY: number): boolean {
  let lowerX = centerX - 1;
  let lowerY = centerY - 1;
  let upperX = centerX + 1;
  let upperY = centerY + 1;

  if (lowerX < 0 || upperX >= matrix.length) return false;
  if (lowerY < 0 || upperY >= matrix[0].length) return false;

  const candidate1 = `${matrix[lowerX][lowerY]}${matrix[centerX][centerY]}${matrix[upperX][upperY]}`;
  const candidate2 = `${matrix[upperX][lowerY]}${matrix[centerX][centerY]}${matrix[lowerX][upperY]}`;

  return (
    (candidate1 === "MAS" || candidate1 == "SAM") &&
    (candidate2 === "MAS" || candidate2 === "SAM")
  );
}

function partOne(filename: string): number {
  let matrix = readMatrix(filename);
  let total = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === "X") {
        total += [1, 2, 3, 4, 5, 6, 7, 8].filter((dir) => {
          let { nextX, nextY } = getNext(dir, i, j);
          return isXMas(matrix, nextX, nextY, dir, "X");
        }).length;
      }
    }
  }
  return total;
}

function partTwo(filename: string): number {
  let matrix = readMatrix(filename);
  let total = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === "A") {
        total += Number(isMas(matrix, i, j));
      }
    }
  }
  return total;
}
console.log(`Part one solution is ${partOne("input.txt")}`);
console.log(`Part two solution is ${partTwo("input.txt")}`);
