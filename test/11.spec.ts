import { readInputStringIntoNumbers } from '../src/helpers/readFile';
import {
  applyStoneFunctionManyTimes,
  applyStoneFunctionToList,
} from '../src/solutions/11';

test('rules work', () => {
  const input = '125 17';
  const nums1 = readInputStringIntoNumbers(input);
  const nums2 = applyStoneFunctionToList(nums1);
  expect(nums2).toEqual([253000, 1, 7]);
  const nums3 = applyStoneFunctionToList(nums2);
  expect(nums3).toEqual([253, 0, 2024, 14168]);
  const nums4 = applyStoneFunctionToList(nums3);
  expect(nums4).toEqual([512072, 1, 20, 24, 28676032]);
  const nums5 = applyStoneFunctionToList(nums4);
  expect(nums5).toEqual([512, 72, 2024, 2, 0, 2, 4, 2867, 6032]);
  const nums6 = applyStoneFunctionToList(nums5);
  expect(nums6).toEqual([
    1036288, 7, 2, 20, 24, 4048, 1, 4048, 8096, 28, 67, 60, 32,
  ]);
  const nums7 = applyStoneFunctionToList(nums6);
  expect(nums7).toEqual([
    2097446912, 14168, 4048, 2, 0, 2, 4, 40, 48, 2024, 40, 48, 80, 96, 2, 8, 6,
    7, 6, 0, 3, 2,
  ]);
  expect(nums7.length).toBe(22);
});

test('run rules X times', () => {
  const input = '125 17';
  const nums1 = readInputStringIntoNumbers(input);
  const result = applyStoneFunctionManyTimes(nums1, 6);
  expect(result.length).toBe(22);
});
