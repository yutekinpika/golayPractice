import { GolayValidation } from './GolayValidation.js';

const matrix = [
  [0, 1, 1, 1, 1, 1], // 0行目
  [1, 0, 0, 0, 0, 0], // 1行目
  [1, 0, 0, 0, 0, 0], // 2行目
  [1, 0, 0, 0, 0, 0], // 3行目
];

const result = GolayValidation.isGolayCode(matrix);
console.log(result);  // true または false