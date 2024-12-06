import fs from 'fs/promises';
import path from 'path';
import { getProjectSrcFolder } from './getProjectRoot';

export async function readInput(filename: string) {
  const filePath = path.join(getProjectSrcFolder(), filename);
  const data = await fs.readFile(filePath, 'utf8');
  return data;
}

export function readNumbersIntoTwoLists(data: string) {
  const numberList: string[] = data.split(/\s+/);
  if (numberList.length % 2 !== 0) {
    throw new Error(
      'Expected even number of data points. Must handle accordingly.'
    );
  }
  const list1: number[] = [];
  const list2: number[] = [];

  for (let i = 0; i < numberList.length; ) {
    const numberString = numberList.splice(0, 1)[0];
    const num = parseInt(numberString, 10);
    if (numberList.length % 2 === 1) {
      list1.push(num);
    } else {
      list2.push(num);
    }
  }
  return {
    list1,
    list2,
  };
}

export function readLinesIntoLists(data: string) {
  const lists: string[] = data.split('\n');
  const numberLists: number[][] = [];

  lists.forEach((list) => {
    const items = list.split(/[ ,]/);
    const numberItems = items.map((i) => parseInt(i, 10));
    numberLists.push(numberItems);
  });
  return numberLists;
}
