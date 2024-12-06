export function doInPlaceArrayItemSwap<T>(
  array: T[],
  first: number,
  second: number
) {
  if (
    first > array.length ||
    second > array.length ||
    first < 0 ||
    second < 0
  ) {
    throw new Error('out of bounds array access');
  }
  const tmp = array[first];
  array[first] = array[second];
  array[second] = tmp;
}
