export function createFrequencyMap(arr: number[]) {
  const frequencyMap: { [key: number]: number } = {};

  arr.forEach((num) => {
    if (frequencyMap[num]) {
      frequencyMap[num]++;
    } else {
      frequencyMap[num] = 1;
    }
  });

  return frequencyMap;
}
