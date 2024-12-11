import { readInput, readInputStringIntoNumbers } from '../helpers/readFile';

const STONE_FUNCTIONS = {
  0: (): 1 => 1,
  1: (value: number): number[] => {
    const valueString = value.toString();
    const firstString = valueString.substring(0, valueString.length / 2);
    const secondString = valueString.substring(valueString.length / 2);
    return [parseInt(firstString, 10), parseInt(secondString, 10)];
  },
  2: (value: number): number => value * 2024,
};

const determineStoneRule = (value: number) => {
  if (value === 0) return 0;
  if (value.toString().length % 2 === 0) return 1;
  return 2;
};

export const applyStoneFunction = (value: number): number[] => {
  const rule = determineStoneRule(value);
  const func = STONE_FUNCTIONS[rule];
  const newValue = func(value);
  if (typeof newValue !== 'number') {
    return newValue;
  }
  return [newValue];
};

export const applyStoneFunctionToList = (values: number[]): number[] => {
  const newValues: number[] = [];
  values.forEach((v) => {
    const out = applyStoneFunction(v);
    newValues.push(...out);
  });
  return newValues;
};

export const applyStoneFunctionManyTimes = (
  values: number[],
  times: number
) => {
  let valueStore: number[] = values.slice();
  for (let i = 0; i < times; ++i) {
    valueStore = applyStoneFunctionToList(valueStore);
  }
  return valueStore;
};

export const solution11_1 = async () => {
  const input = await readInput('../data/11_input.txt');
  const nums = readInputStringIntoNumbers(input);
  const result = applyStoneFunctionManyTimes(nums, 25);
  return result.length;
};

export const applyStoneFunctionManyManyManyManyTimes = (
  values: number[],
  times: number
) => {
  let valueStore: number[] = values.slice();
  for (let i = 0; i < Math.min(times, 30); ++i) {
    valueStore = applyStoneFunctionToList(valueStore);
  }
  if (times - 30 > 0) {
    let manyValueStores: number[][];
    for (let i = 0; i < 100; ++i) {}
  }
  valueStore;
};

export const solution11_2 = async () => {
  const input = await readInput('../data/11_input.txt');
  const nums = readInputStringIntoNumbers(input);
  const result = applyStoneFunctionManyTimes(nums, 75);
  return result.length;
};
