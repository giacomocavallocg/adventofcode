import { Dir, read, readFileSync } from "fs";
import { join } from "path";

function readInput(filename: string): {map:Map<string, number[][]>, rowNum:number, colNum:number}
{
  const contents = readFileSync(join(__dirname, filename), "utf-8");
  const rows = contents.split(/\r?\n/);
  let map: Map<string, number[][]> = new Map();
  let rowNum = rows.length;
  let colNum = rows[0].split("").length;

  for (let i = 0; i < rowNum; i++) {
    let cols = rows[i].split("");
    for(let j = 0; j < colNum; j++){
      if(cols[j] === ".") continue;
      if(map.has(cols[j])){
        map.get(cols[j])!.push([i,j])
      }else{
        map.set(cols[j], [[i,j]])
      }
    }
  }

  return {map, rowNum, colNum};
}


function findNearestAninodes(A: number[], B: number[]) : number[][]{
  let dX = A[0] - B[0]
  let dY = A[1] - B[1]
  
  let C = [A[0] + dX, A[1] + dY]
  let D = [B[0] - dX, B[1] - dY]

  return [C, D];
}

function isValid(node: number[], rowNum:number, colNum:number): boolean{
  return node[0] >= 0 && node[0] < rowNum && node[1] >= 0 && node[1] < colNum;
}

function findAllAninodes(A: number[], B: number[], row:number, col:number) : number[][]{

  let antinodes : number[][] = [A, B]

  let dX = A[0] - B[0]
  let dY = A[1] - B[1]
  
  let C = [A[0] + dX, A[1] + dY]
  let D = [B[0] - dX, B[1] - dY]

  while(isValid(C, row, col)){
    antinodes.push(C);
    C = [C[0] + dX, C[1] + dY]
  }

  while(isValid(D, row, col)){
    antinodes.push(D);
    D = [D[0] - dX, D[1] - dY]
  }

  return antinodes;
}

function combination(array: number[][]): number[][][]{
  const combination: number[][][] = []

  for(let i = 0; i< array.length-1; i++){
    for(let j = i+1; j< array.length; j++){
      combination.push([array[i], array[j]])
    }
  }
  return combination;
}

function partOne(filename: string): number {
  const {map, rowNum, colNum} = readInput(filename);
  let antinodes: Set<string> = new Set();

  function isValid(node: number[]): boolean{
    return node[0] >= 0 && node[0] < rowNum && node[1] >= 0 && node[1] < colNum;
  }

  for(let [key, value] of map.entries()){
    const valueCombination = combination(value);
    for(let [A, B] of valueCombination){
      findNearestAninodes(A, B).filter(isValid).forEach(n => antinodes.add(`${n[0]}_${n[1]}`));
    }

  }
  return antinodes.size;
}

function partTwo(filename: string): number {
  const {map, rowNum, colNum} = readInput(filename);
  let antinodes: Set<string> = new Set();

  function isValid(node: number[]): boolean{
    return node[0] >= 0 && node[0] < rowNum && node[1] >= 0 && node[1] < colNum;
  }

  for(let [key, value] of map.entries()){
    const valueCombination = combination(value);
    for(let [A, B] of valueCombination){
      findAllAninodes(A, B, rowNum, colNum).forEach(n => antinodes.add(`${n[0]}_${n[1]}`));
    }

  }
  return antinodes.size;}

// console.log(`Part one solution is ${partOne("input.txt")}`);
console.log(`Part two solution is ${partTwo("input.txt")}`);
