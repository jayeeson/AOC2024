import { Calculation, isValidCalculation, stringToCalculation } from '../src/7';
import { splitStringAtEOL } from '../src/helpers/readFile';

test('can evaluate left to right', () => {
  const testInput = '292: 11 6 16 20';
  const calc = stringToCalculation(testInput);
  const isValid = isValidCalculation(calc);
  expect(isValid.valid).toBe(true);
});

test('can find possible valid calculations', () => {
  const input = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

  const calculationStrings = splitStringAtEOL(input);
  const calculations: Calculation[] = calculationStrings.map((calc) =>
    stringToCalculation(calc)
  );
  const validCalculations = calculations.map((calc) =>
    isValidCalculation(calc)
  );
  const trueValidCalculations = validCalculations.filter((calc) => calc.valid);
  const numberValidCalculations = trueValidCalculations.length;
  expect(numberValidCalculations).toBe(3);
});
