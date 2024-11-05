// main.js

import { FieldF4 } from './FieldF4.js'; // 'FieldF4.js' をインポート

// 4行6列の二次元配列 (例)
const matrix = [
  [0, 1, 0, 1, 0, 1], // 0行目
  [1, 0, 1, 0, 1, 0], // 1行目
  [0, 1, 0, 1, 0, 1], // 2行目
  [1, 0, 1, 0, 1, 0], // 3行目
];

// 重みつき和を求める関数
function calculateWeightedSum(matrix) {
  // 重み配列（行ごとの重み）
  const weights = [new FieldF4(0), new FieldF4(1), new FieldF4(2), new FieldF4(3)];
  
  // 各列ごとの重み付き和を格納する配列
  let weightedSums = new Array(matrix[0].length).fill(new FieldF4(0)); // 6列分の和を保持

  // 列ごとに処理
  for (let j = 0; j < matrix[0].length; j++) {
    let sum = new FieldF4(0);  // 重み付き和の初期値は 0

    // 各行ごとに重み付き和を計算
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i][j] === 1) { // 値が 1 の場合のみ加算
        sum = sum.add(weights[i]);  // 行ごとの重みと加算
      }
    }
    
    // 各列ごとの重み付き和を保存
    weightedSums[j] = sum;
  }

  return weightedSums;
}

// 結果を表示
const result = calculateWeightedSum(matrix);

// 結果をコンソールに出力
console.log(result.map(item => item.toString()));
  
  // 使用例
  let zero = new FieldF4(0);  // 0
  let one = new FieldF4(1);   // 1
  let w = new FieldF4(2);     // w
  let wb = new FieldF4(3);    // wb
  
  // 加算の例
  console.log(`${w.toString()} + ${wb.toString()} = ${(w.add(wb)).toString()}`);  // w + wb = 1
  console.log(`${w.toString()} + ${w.toString()} = ${(w.add(w)).toString()}`);  // w + w = 0
  console.log(`${one.toString()} + ${wb.toString()} = ${(one.add(wb)).toString()}`);  // 1 + wb = w
  
  // 乗算の例
  console.log(`${w.toString()} * ${w.toString()} = ${(w.multiply(w)).toString()}`);  // w * w = wb
  console.log(`${wb.toString()} * ${w.toString()} = ${(wb.multiply(w)).toString()}`);  // wb * w = 1
  console.log(`${one.toString()} * ${wb.toString()} = ${(one.multiply(wb)).toString()}`);  // 1 * wb = wb
  