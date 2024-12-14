import { deepEqual } from '../helpers/deepEqual';
import { getMapSize, isInMap } from '../helpers/map';
import { readInput, splitStringAtEOL } from '../helpers/readFile';
import { sumOfArray } from './1';
import { Direction4PointsArray } from './10';
import { Cell, Size } from './4';
import { Direction4Points } from './6';

export interface GardenRegionSpecs {
  area: number;
  perimeter: number;
  sides: number;
}

export interface GardenRegionSpecsMap {
  [key: string]: GardenRegionSpecs[];
}

export interface GardenRegionCells {
  [key: string]: Cell; // key is unique `x-y`
}

const getCellOneAwayByDirection = (
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

export const findFirstCellNotInMap = (
  size: Size,
  allMappedCells: GardenRegionCells
): Cell | undefined => {
  if (Object.keys(allMappedCells).length >= size.width * size.height) {
    return undefined;
  }
  for (let i = 0; i < size.width; ++i) {
    for (let j = 0; j < size.height; ++j) {
      if (!(`${i}-${j}` in allMappedCells)) {
        return { x: i, y: j };
      }
    }
  }
  return undefined;
};

export const directionChangeMeansAdditionalSides = (
  direction1: Direction4Points,
  direction2: Direction4Points
) => {
  const direction1Number = direction1 as number;
  const direction2Number = direction2 as number;

  const directionChangeNumber = (direction2Number - direction1Number + 4) % 4;
  if (directionChangeNumber === 3) {
    return true;
  }
};

interface RecursivelyGetRegionCellsProps {
  position: Cell;
  size: Size;
  thisRegion: GardenRegionCells;
  allMappedCells: GardenRegionCells;
  mapLines: string[];
  characterToFind: RegExp;
}

export const recursivelyGetRegionCells = ({
  position,
  size,
  thisRegion,
  allMappedCells,
  mapLines,
  characterToFind,
}: RecursivelyGetRegionCellsProps): void => {
  const uniqueKey = `${position.x}-${position.y}`;
  if (!(uniqueKey in allMappedCells)) {
    thisRegion[uniqueKey] = position;
    allMappedCells[uniqueKey] = position;
  }

  for (const direction of Direction4PointsArray) {
    const nextPosition = getCellOneAwayByDirection(direction, position);

    if (!nextPosition) {
      break;
    }

    const nextUniqueKey = `${nextPosition.x}-${nextPosition.y}`;
    if (
      !isInMap(nextPosition, size) ||
      !mapLines[nextPosition.y][nextPosition.x].match(characterToFind) ||
      nextUniqueKey in allMappedCells
    ) {
      continue;
    }

    recursivelyGetRegionCells({
      position: nextPosition,
      size,
      thisRegion,
      allMappedCells,
      mapLines,
      characterToFind,
    });
  }
};

const calculatePerimeterOfThisCell = (
  cells: Cell[],
  index: number,
  size: Size
): number => {
  let perimeter = 4;
  for (const direction of Direction4PointsArray) {
    const oneAway = getCellOneAwayByDirection(direction, cells[index]);
    if (!isInMap(oneAway, size)) {
      continue;
    }
    if (cells.some((cell) => cell.x === oneAway.x && cell.y === oneAway.y)) {
      perimeter -= 1;
    }
  }
  return perimeter;
};

const getDirectionFromNeighboringCell1ToCell2 = (
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

export const getInitialNeighboringCell = (
  currentCell: Cell,
  cells: Cell[],
  size: Size
): Cell => {
  const rightCell = getCellOneAwayByDirection(
    Direction4Points.EAST,
    currentCell
  );
  if (isInMap(rightCell, size)) {
    if (cells.some((cell) => deepEqual(cell, rightCell))) {
      return rightCell;
    }
  }

  const downCell = getCellOneAwayByDirection(
    Direction4Points.SOUTH,
    currentCell
  );
  if (isInMap(downCell, size)) {
    if (cells.some((cell) => deepEqual(cell, downCell))) {
      return downCell;
    }
  }
  throw new Error('expected initial neighboringCell to be east or south');
};

export const getSubsequentNeighboringCell = (
  currentCell: Cell,
  cells: Cell[],
  size: Size,
  lastDirection: Direction4Points
): Cell => {
  const lastDirectionNumber = lastDirection as number;
  const directionsToTryNumbers = [
    (lastDirectionNumber - 1 + 4) % 4,
    lastDirectionNumber,
    (lastDirectionNumber + 1) % 4,
    (lastDirectionNumber + 2) % 4,
  ];
  const directionsToTry = directionsToTryNumbers.map(
    (d) => d as Direction4Points
  );

  for (let direction of directionsToTry) {
    const nextCell = getCellOneAwayByDirection(direction, currentCell);
    if (isInMap(nextCell, size)) {
      if (cells.some((cell) => deepEqual(cell, nextCell))) {
        return nextCell;
      }
    }
  }
  throw new Error('impossible to get here');
};

interface UniqueMoves {
  [key: string]: boolean;
}

const cellToString = (cell: Cell) => {
  return `${cell.x}-${cell.y}`;
};

const createMoveString = (cell1: Cell, cell2: Cell) => {
  return `${cellToString(cell1)}-${cellToString(cell2)}`;
};

const calculateOutsideSidesInRegion = (cells: Cell[], size: Size) => {
  let outsideSides = 4;
  let initialDirection: Direction4Points | undefined;
  const perimeterCells: GardenRegionCells = {};
  const uniqueMoves: UniqueMoves = {};

  let currentCell = cells[0];
  const firstCell = { ...currentCell };
  perimeterCells[cellToString(firstCell)] = firstCell;
  let neighboringCell: Cell = getInitialNeighboringCell(
    currentCell,
    cells,
    size
  );

  let lastMove = createMoveString(currentCell, neighboringCell);

  while (!(lastMove in uniqueMoves)) {
    uniqueMoves[lastMove] = true;
    const newDirection = getDirectionFromNeighboringCell1ToCell2(
      currentCell,
      neighboringCell
    );

    if (initialDirection === undefined) {
      initialDirection = newDirection;
    } else if (
      directionChangeMeansAdditionalSides(initialDirection, newDirection)
    ) {
      outsideSides += 2;
    }
    initialDirection = newDirection;
    currentCell = neighboringCell;
    neighboringCell = getSubsequentNeighboringCell(
      currentCell,
      cells,
      size,
      newDirection
    );
    lastMove = createMoveString(currentCell, neighboringCell);
  }
  return outsideSides;
};

const calculateInsideSidesInRegion = (cells: Cell[], size: Size): number => {
  // TO FIND INSIDE SIDES
  // 1. find biggest possible Donuts

  // 2. for all donuts, get cells inside them
  // 3. determine which cells inside them aren't part of the region
  // 4. group those cells into regions
  // 5. get outside sides of those cells

  return 0;
};

export const calculateNumberSidesInRegion = (
  cells: Cell[],
  size: Size
): number => {
  if (cells.length <= 2) {
    return 4;
  }
  const outsideSides = calculateOutsideSidesInRegion(cells, size);
  const insideSides = calculateInsideSidesInRegion(cells, size);
  return outsideSides + insideSides;
};

const calculateInfosForGardenRegion = (
  cells: GardenRegionCells,
  size: Size
): GardenRegionSpecs => {
  const cellsArray = Object.values(cells);
  const perimeters = cellsArray.map((cell, i) =>
    calculatePerimeterOfThisCell(Object.values(cells), i, size)
  );

  return {
    area: Object.keys(cells).length,
    perimeter: sumOfArray(perimeters),
    sides: calculateNumberSidesInRegion(cellsArray, size),
  };
};

export const getAllRegionInfo = (lines: string[]) => {
  const size = getMapSize(lines);
  const allCells: GardenRegionCells = {};
  const regionSpecsMap: GardenRegionSpecsMap = {};

  let position: Cell | undefined = { x: 0, y: 0 };
  while (position !== undefined) {
    const characterToFind = lines[position.y][position.x];
    const thisRegion: GardenRegionCells = {};
    const sides = recursivelyGetRegionCells({
      position,
      size,
      thisRegion,
      allMappedCells: allCells,
      mapLines: lines,
      characterToFind: new RegExp(characterToFind),
    });
    position = findFirstCellNotInMap(size, allCells);
    const infosForRegion = calculateInfosForGardenRegion(thisRegion, size);

    if (characterToFind in regionSpecsMap) {
      regionSpecsMap[characterToFind].push(infosForRegion);
    } else {
      regionSpecsMap[characterToFind] = [infosForRegion];
    }
  }
  return regionSpecsMap;
};

export const getGardenFencePriceInfo = (
  regionSpecsMap: GardenRegionSpecsMap,
  calcWithPerimeter: boolean = true
) => {
  let totalPrice = 0;
  for (const key in regionSpecsMap) {
    const regions = regionSpecsMap[key];
    const priceForTheseRegions = regions.map(
      (r) => r.area * (calcWithPerimeter ? r.perimeter : r.sides)
    );
    totalPrice += sumOfArray(priceForTheseRegions);
  }
  return totalPrice;
};

export const solution12_1 = async () => {
  const input = await readInput('../data/12_input.txt');
  const lines = splitStringAtEOL(input);
  const regionInfo = getAllRegionInfo(lines);
  const totalPrice = getGardenFencePriceInfo(regionInfo);
  return totalPrice;
};
