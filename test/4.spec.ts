import { readInput } from '../src/helpers/readFile';
import {
  Cell,
  countFoundStringsInGrid,
  countXShapedStringsInGrid,
  createStringFromCoordinateAndDirection,
  Direction,
  IPropsStringFromCoordinateAndDirection,
} from '../src/solutions/4';

const input = `....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX`;

interface TestCase1 {
  cell: Cell;
  direction: Direction;
  expected: string | undefined;
}

test.each<TestCase1>([
  { cell: { x: 3, y: 3 }, direction: Direction.NORTH, expected: '.SM.' },
  { cell: { x: 3, y: 2 }, direction: Direction.NORTH, expected: undefined },
  { cell: { x: 0, y: 3 }, direction: Direction.EAST, expected: '..A.' },
  { cell: { x: 1, y: 3 }, direction: Direction.EAST, expected: undefined },
  { cell: { x: 3, y: 3 }, direction: Direction.WEST, expected: '.A..' },
  { cell: { x: 2, y: 3 }, direction: Direction.WEST, expected: undefined },
  { cell: { x: 3, y: 0 }, direction: Direction.SOUTH, expected: '.MS.' },
  { cell: { x: 3, y: 1 }, direction: Direction.SOUTH, expected: undefined },
  { cell: { x: 0, y: 3 }, direction: Direction.NORTHEAST, expected: '..A.' },
  { cell: { x: 1, y: 3 }, direction: Direction.NORTHEAST, expected: undefined },
  { cell: { x: 0, y: 2 }, direction: Direction.NORTHEAST, expected: undefined },
  { cell: { x: 3, y: 3 }, direction: Direction.NORTHWEST, expected: '..S.' },
  { cell: { x: 2, y: 3 }, direction: Direction.NORTHWEST, expected: undefined },
  { cell: { x: 1, y: 2 }, direction: Direction.NORTHWEST, expected: undefined },
  { cell: { x: 0, y: 0 }, direction: Direction.SOUTHEAST, expected: '.S..' },
  { cell: { x: 1, y: 0 }, direction: Direction.SOUTHEAST, expected: undefined },
  { cell: { x: 0, y: 1 }, direction: Direction.SOUTHEAST, expected: undefined },
  { cell: { x: 3, y: 0 }, direction: Direction.SOUTHWEST, expected: '.A..' },
  { cell: { x: 2, y: 0 }, direction: Direction.SOUTHWEST, expected: undefined },
  { cell: { x: 3, y: 1 }, direction: Direction.SOUTHWEST, expected: undefined },
])('can extract string from cell and direction, %s', (testCase) => {
  // test case:

  // ....
  // .SAM
  // ...S
  // ..A.

  const stringArrays = input.split('\n');
  const functionInput: IPropsStringFromCoordinateAndDirection = {
    input: stringArrays,
    size: { width: 4, height: 4 },
    cell: testCase.cell,
    length: 4,
    direction: testCase.direction,
  };
  const foundString = createStringFromCoordinateAndDirection(functionInput);
  expect(foundString).toBe(testCase.expected);
});

test('can find XMAS in all directions', () => {
  const grid = input.split('\n');
  const numberXmases = countFoundStringsInGrid('XMAS', grid);
  expect(numberXmases).toBe(18);
});

test('can find XMAS in all directions from file', async () => {
  const fileInput = await readInput('../test/test-data/4_fake_data.txt');
  const grid = input.split('\n');

  const numberXmases = countFoundStringsInGrid('XMAS', grid);
  expect(numberXmases).toBe(18);
});

test('can find x shaped MAS', () => {
  const testInput = `.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`;

  const grid = testInput.split('\n');

  const numberXmases = countXShapedStringsInGrid('MAS', grid);
  expect(numberXmases).toBe(9);
});
