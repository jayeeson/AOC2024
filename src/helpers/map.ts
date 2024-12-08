import { Cell, Size } from '../solutions/4';

export const getMapSize = (input: string[]): Size => {
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
