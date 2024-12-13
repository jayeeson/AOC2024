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

export const recursivelyGetRegionCells = (
  position: Cell,
  size: Size,
  thisRegion: GardenRegionCells,
  allMappedCells: GardenRegionCells,
  mapLines: string[]
): string => {
  const characterToFind = mapLines[position.y][position.x];

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
      mapLines[nextPosition.y][nextPosition.x] !== characterToFind ||
      nextUniqueKey in allMappedCells
    ) {
      continue;
    }

    recursivelyGetRegionCells(
      nextPosition,
      size,
      thisRegion,
      allMappedCells,
      mapLines
    );
  }
  return characterToFind;
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

export const calculateNumberSidesInRegion = (cells: Cell[]): number => {
  return 0; // todo
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
    sides: calculateNumberSidesInRegion(cellsArray),
  };
};

export const getAllRegionInfo = (lines: string[]) => {
  const size = getMapSize(lines);
  const allCells: GardenRegionCells = {};
  const regionSpecsMap: GardenRegionSpecsMap = {};

  let position: Cell | undefined = { x: 0, y: 0 };
  while (position !== undefined) {
    const thisRegion: GardenRegionCells = {};
    const type = recursivelyGetRegionCells(
      position,
      size,
      thisRegion,
      allCells,
      lines
    );
    position = findFirstCellNotInMap(size, allCells);
    const infosForRegion = calculateInfosForGardenRegion(thisRegion, size);

    if (type in regionSpecsMap) {
      regionSpecsMap[type].push(infosForRegion);
    } else {
      regionSpecsMap[type] = [infosForRegion];
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
