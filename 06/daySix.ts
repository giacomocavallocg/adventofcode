import { Dir, read, readFileSync } from "fs";
import { join } from "path";

enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

class Position {
  x: number;
  y: number;
  direction: Direction;

  constructor(x: number, y: number, dir: Direction) {
    this.x = x;
    this.y = y;
    this.direction = dir;
  }

  areEqual(other: Position): boolean {
    return (
      this.x === other.x &&
      this.y === other.y &&
      this.direction === other.direction
    );
  }

  getKey(): string {
    return `${this.x}_${this.y}_${this.direction}`;
  }
}

const directionMapping: Map<string, Direction> = new Map([
  ["^", Direction.Up],
  [">", Direction.Right],
  ["v", Direction.Down],
  ["<", Direction.Left],
]);

function readMap(filename: string): {
  map: string[][];
  position: Position;
} {
  const contents = readFileSync(join(__dirname, filename), "utf-8");

  const map: string[][] = [];
  const position = new Position(0, 0, Direction.Up);

  const arr = contents.split(/\r?\n/);

  for (let i = 0; i < arr.length; i++) {
    let row = arr[i].split("");
    row.forEach((x, j) => {
      if (directionMapping.has(x)) {
        position.x = i;
        position.y = j;
        position.direction = directionMapping.get(x)!;
      }
    });
    map.push(row);
  }

  return { map, position };
}

function getNextPosition(current: Position): Position {
  switch (current.direction) {
    case Direction.Up:
      return new Position(current.x - 1, current.y, current.direction);
    case Direction.Right:
      return new Position(current.x, current.y + 1, current.direction);
    case Direction.Down:
      return new Position(current.x + 1, current.y, current.direction);
    case Direction.Left:
      return new Position(current.x, current.y - 1, current.direction);
  }
}

function turn(current: Position): Position {
  switch (current.direction) {
    case Direction.Up:
      return new Position(current.x, current.y, Direction.Right);
    case Direction.Right:
      return new Position(current.x, current.y, Direction.Down);
    case Direction.Down:
      return new Position(current.x, current.y, Direction.Left);
    case Direction.Left:
      return new Position(current.x, current.y, Direction.Up);
  }
}

function partOne(filename: string): number {
  let { map, position } = readMap(filename);

  let uniqueCell = 0;

  while (true) {
    if (map[position.x][position.y] !== "X") {
      uniqueCell += 1;
      map[position.x][position.y] = "X";
    }

    let nextPosition = getNextPosition(position);
    if (
      nextPosition.x < 0 ||
      nextPosition.x >= map.length ||
      nextPosition.y < 0 ||
      nextPosition.y >= map[0].length
    ) {
      break;
    }

    let nextCell = map[nextPosition.x][nextPosition.y];

    if (nextCell === "#") {
      position = turn(position);
    } else {
      position = nextPosition;
    }
  }

  return uniqueCell;
}

function isLoop(map: string[][], start: Position) {
  let currentPosition = start;
  let visited: Set<string> = new Set([start.getKey()]);

  while (true) {
    let nextPosition = getNextPosition(currentPosition);
    if (
      nextPosition.x < 0 ||
      nextPosition.x >= map.length ||
      nextPosition.y < 0 ||
      nextPosition.y >= map[0].length
    ) {
      break;
    }

    let nextCell = map[nextPosition.x][nextPosition.y];

    if (nextCell === "#" || nextCell === "O") {
      currentPosition = turn(currentPosition);
    } else {
      currentPosition = nextPosition;
    }

    if (visited.has(currentPosition.getKey())) {
      return true;
    }

    visited.add(currentPosition.getKey());
  }

  return false;
}

function partTwo(filename: string): number {
  let { map, position } = readMap(filename);

  let loop = 0;
  let obstacleVisited: Set<string> = new Set();
  let currentPosition = position;

  while (true) {
    // console.log(currentPosition);
    let nextPosition = getNextPosition(currentPosition);

    if (
      nextPosition.x < 0 ||
      nextPosition.x >= map.length ||
      nextPosition.y < 0 ||
      nextPosition.y >= map[0].length
    ) {
      break;
    }

    let nextCell = map[nextPosition.x][nextPosition.y];

    if (nextCell === "#" || nextCell === "O") {
      currentPosition = turn(currentPosition);
    } else {
      const positionKey = `${nextPosition.x}_${nextPosition.y}`;
      if (
        !obstacleVisited.has(positionKey) &&
        !directionMapping.has(nextCell)
      ) {
        map[nextPosition.x][nextPosition.y] = "O";
        loop += Number(isLoop(map, currentPosition));
        map[nextPosition.x][nextPosition.y] = ".";
        obstacleVisited.add(positionKey);
      }

      currentPosition = nextPosition;
    }
  }

  return loop;
}

//console.log(`Part one solution is ${partOne("test.txt")}`);
console.log(`Part two solution is ${partTwo("input.txt")}`);
