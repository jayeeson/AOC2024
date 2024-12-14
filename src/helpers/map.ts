export interface Size {
  width: number;
  height: number;
}

export interface Cell {
  x: number;
  y: number;
}

export type MapLines = string[];

export enum Direction4Points {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export enum Direction8Points {
  NORTH,
  EAST,
  SOUTH,
  WEST,
  NORTHWEST,
  NORTHEAST,
  SOUTHEAST,
  SOUTHWEST,
  LENGTH,
}

export const getMapSize = <T extends string | number[]>(input: T[]): Size => {
  if (input.length < 1 && input[0].length < 1) {
    throw new Error('input must have at least one row');
  }
  const widths = input.map((line) => line.length);
  const everyLineSameWidth = widths.every((width) => width === widths[0]);
  if (!everyLineSameWidth) {
    throw new Error('Map must be square');
  }

  return {
    width: widths[0],
    height: input.length,
  };
};

export const isInMap = (position: Cell, mapSize: Size): boolean => {
  if (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x < mapSize.width &&
    position.y < mapSize.height
  ) {
    return true;
  }
  return false;
};

export const getCellDiff = (cell1: Cell, cell2: Cell): Cell => {
  return { x: cell2.x - cell1.x, y: cell2.y - cell1.y };
};

export const getCellOneAwayByDirection = (
  direction: Direction4Points,
  position: Cell
) => {
  switch (direction) {
    case Direction4Points.NORTH:
      return { x: position.x, y: position.y - 1 };
    case Direction4Points.EAST:
      return { x: position.x + 1, y: position.y };
    case Direction4Points.SOUTH:
      return { x: position.x, y: position.y + 1 };
    case Direction4Points.WEST:
      return { x: position.x - 1, y: position.y };
    default:
      throw new Error('impossible direction');
  }
};

export const getDirectionFromNeighboringCell1ToCell2 = (
  cell1: Cell,
  cell2: Cell
): Direction4Points => {
  if (Math.abs(cell1.x - cell2.x) + Math.abs(cell1.y - cell2.y) !== 1) {
    throw new Error('cells must be exactly one apart in x or y direction');
  }

  const diffX = cell2.x - cell1.x;
  if (diffX === 1) {
    return Direction4Points.EAST;
  }
  if (diffX === -1) {
    return Direction4Points.WEST;
  }

  const diffY = cell2.y - cell1.y;
  if (diffY === 1) {
    return Direction4Points.SOUTH;
  }
  if (diffY === -1) {
    return Direction4Points.NORTH;
  }
  throw new Error('you did something WRONG');
};

export const cellToString = (cell: Cell) => {
  return `${cell.x}-${cell.y}`;
};

export const createMoveString = (cell1: Cell, cell2: Cell) => {
  return `${cellToString(cell1)}-${cellToString(cell2)}`;
};
