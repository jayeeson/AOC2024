import { splitStringAtEOL } from '../src/helpers/readFile';
import { getAllRegionInfo, getGardenFencePriceInfo } from '../src/solutions/12';

const inputs = [
  {
    input: `AAAA
BBCD
BBCC
EEEC`,
    expectedRegion: {
      A: [{ perimeter: 10, area: 4 }],
      B: [{ perimeter: 8, area: 4 }],
      C: [{ perimeter: 10, area: 4 }],
      D: [{ perimeter: 4, area: 1 }],
      E: [{ perimeter: 8, area: 3 }],
    },
    expectedPriceWithPerimeter: 140,
    expectedPriceWithSides: 80,
  },
  {
    input: `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
    expectedRegion: {
      O: [{ perimeter: 36, area: 21 }],
      X: [
        { perimeter: 4, area: 1 },
        { perimeter: 4, area: 1 },
        { perimeter: 4, area: 1 },
        { perimeter: 4, area: 1 },
      ],
    },
    expectedPriceWithPerimeter: 772,
    expectedPriceWithSides: 436,
  },
];

test.each(inputs)(
  'get correct perimeters, areas, prices',
  ({
    input,
    expectedRegion,
    expectedPriceWithPerimeter,
    expectedPriceWithSides,
  }) => {
    const lines = splitStringAtEOL(input);
    const regionInfo = getAllRegionInfo(lines);
    expect(regionInfo).toMatchObject(expectedRegion);
    const totalPriceWithPerimeter = getGardenFencePriceInfo(regionInfo);
    expect(totalPriceWithPerimeter).toBe(expectedPriceWithPerimeter);
    // const totalPriceWithSides = getGardenFencePriceInfo(regionInfo, false);
    // expect(totalPriceWithSides).toBe(expectedPriceWithSides);
  }
);
