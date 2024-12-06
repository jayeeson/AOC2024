import { writeFile } from 'fs/promises';
import { getProjectSrcFolder } from './getProjectRoot';
import path from 'path';

export async function writeToFile(filename: string, data: string) {
  const filePath = path.join(getProjectSrcFolder(), filename);
  await writeFile(filePath, data);
}

export async function writeStringArrayToFile(
  filename: string,
  array: string[]
) {
  let data = '';
  array.forEach((line) => (data += `${line}\n`));
  writeToFile(filename, data);
}
