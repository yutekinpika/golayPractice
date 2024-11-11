import { FieldF4 } from './parts/FieldF4/FieldF4.js'; // 'FieldF4.js' をインポート

class GolayValidation {
  // 重みつき和を求める関数
  static calculateWeightedSum(matrix) {
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

  // 条件1: arr[0] + arr[1] == arr[2] + arr[3]
  // 条件2: arr[0] + arr[1] == arr[4] + arr[5]
  // 条件3: arr[0] + arr[1] == (arr[0] + arr[2] + arr[4]) * w倍
  static validateFieldF4Array(arr) {
    const sum1 = arr[0].add(arr[1]);
    const sum2 = arr[2].add(arr[3]);
    if (sum1.toString() !== sum2.toString()) {
        return false; // 条件1が満たされていない
    }

    const sum3 = arr[4].add(arr[5]);
    if (sum1.toString() !== sum3.toString()) {
        return false; // 条件2が満たされていない
    }

    const sum4 = arr[0].add(arr[2]).add(arr[4]); // arr[0] + arr[2] + arr[4]
    const scaledSum4 = sum4.multiply(new FieldF4(2)); // w 倍
    
    if (sum1.toString() !== scaledSum4.toString()) {
        return false; // 条件3が満たされていない
    }

    return true; // すべての条件が満たされている
  }

  // 各列の1の数をカウントし、余りが一致するか確認
  static validateCountCondition(matrix) {
    let remainders = [];

    // 各列の1の数をカウントし、その余りをremaindersに格納
    for (let col = 0; col < matrix[0].length; col++) {
        let countOnesInCol = 0;
        for (let row = 0; row < matrix.length; row++) {
            if (matrix[row][col] === 1) {
                countOnesInCol++;
            }
        }
        // 列の1の数を2で割った余り
        remainders.push(countOnesInCol % 2);
    }

    // 0行目の1の数を2で割った余りを計算
    let countOnesInFirstRow = 0;
    for (let col = 0; col < matrix[0].length; col++) {
        if (matrix[0][col] === 1) {
            countOnesInFirstRow++;
        }
    }
    remainders.push(countOnesInFirstRow % 2);

    // 全ての余りが一致しているか確認
    if (!remainders.every((rem, _, arr) => rem === arr[0])) {
        return false;  // 余りが一致しない場合
    }

    // 条件を満たしていれば true を返す
    return true;
  }

  // ゴレイ符号の検証
  static isGolayCode(matrix) {
    return GolayValidation.validateFieldF4Array(GolayValidation.calculateWeightedSum(matrix)) &&
           GolayValidation.validateCountCondition(matrix);
  }
}

export { GolayValidation };
