import { read, readFileSync } from "fs";
import { join } from "path";

function readInput(filename: string): {total:number, element:number[]}[]
{
  const contents = readFileSync(join(__dirname, filename), "utf-8");
  const arr = contents.split(/\r?\n/);
  let equations: {total:number, element:number[]}[] = []
  for (let i = 0; i < arr.length; i++) {
    const [total, formula] = arr[i].split(":");
    equations.push({total:Number(total), element:formula.trim().split(" ").map(e => Number(e))})
  }

  return equations;
}

function isValidPartOne(total:number, current:number, element:number[]):boolean{

  if(current > total)
    return false;

  if(element.length === 1){
    return total === element[0] + current || total === element[0] * current;
  }else{
    const currentElement = element[0]
    return isValidPartOne(total, current+currentElement, element.slice(1)) || isValidPartOne(total, current*currentElement, element.slice(1)) 
  }
}

function concatenation(x:number, y:number){
  return Number(String(x) + String(y))
}

function isValidPartTwo(total:number, current:number, element:number[]):boolean{

  if(current > total)
    return false;

  if(element.length === 1){
    return total === element[0] + current || total === element[0] * current || total === concatenation(current, element[0]);
  }else{
    const currentElement = element[0]
    return isValidPartTwo(total, current+currentElement, element.slice(1)) 
    || isValidPartTwo(total, current*currentElement, element.slice(1)) 
    || (current > 0 && isValidPartTwo(total, concatenation(current, currentElement), element.slice(1)))

  }
}

function partOne(filename: string): number {
  let formulas = readInput(filename);
  return formulas.filter(f => isValidPartOne(f.total, 0, f.element)).map(f => f.total).reduce((tot, e) => tot+e, 0);
}

function partTwo(filename: string): number {
  let formulas = readInput(filename);
  return formulas.filter(f => isValidPartTwo(f.total, 0, f.element)).map(f => f.total).reduce((tot, e) => tot+e, 0);}

console.log(`Part one solution is ${partOne("input.txt")}`);
console.log(`Part two solution is ${partTwo("input.txt")}`);
