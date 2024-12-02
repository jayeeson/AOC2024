import fs from 'fs';
import path from 'path';

export function getProjectRoot() {
  let currentDir = __dirname;

  while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    currentDir = path.dirname(currentDir); // Go up one level
  }

  return currentDir;
}

export function getProjectSrcFolder() {
  return path.join(getProjectRoot(), 'src');
}
