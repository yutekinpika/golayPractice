import { FieldF4 } from './FieldF4.js'; // FieldF4クラスをインポート

function solveUsingMatrix(arr, w) {
    // undefined の数を数える
    let undefinedCount = arr.filter(x => x === undefined).length;

    // undefined の数が 3 でない場合はそのまま arr を返す
    if (undefinedCount != 3) {
        return arr;
    }

    function createCoefficientMatrix(arr) {
      // 配列arrの要素数が6であることを確認
      if (arr.length !== 6) {
          throw new Error("arrの要素数は6でなければなりません");
      }
  
      // undefinedでない要素のインデックスを取得
      const knownIndices = arr
          .map((value, index) => value !== undefined ? index : -1)
          .filter(index => index !== -1); // undefinedでない要素のインデックス
  
      // undefinedでない要素がちょうど3個であることを確認
      if (knownIndices.length !== 3) {
          throw new Error("arrの中でundefinedでない要素はちょうど3個でなければなりません");
      }
  
      // 3*6行列を作成
      const matrix = [];
      for (let i = 0; i < 3; i++) {
          // 新しい行を作成 (6列)
          const row = new Array(6).fill(FieldF4(0)); // 初期状態はすべて0
          row[knownIndices[i]] = FieldF4(1); // `knownIndices[i]` の位置を1にセット
          matrix.push(row);
      }
  
      // 行列Aを定義
      let A = [
          [new FieldF4(1), new FieldF4(1), new FieldF4(1), new FieldF4(1), new FieldF4(0), new FieldF4(0)],  // x1 + x2 = x3 + x4
          [new FieldF4(1), new FieldF4(1), new FieldF4(0), new FieldF4(0), new FieldF4(1), new FieldF4(1)],  // x1 + x2 = x5 + x6
          [new FieldF4(3), new FieldF4(1), new FieldF4(2), new FieldF4(0), new FieldF4(2), new FieldF4(0)]   // x1 + x2 = (x1 + x3 + x5) * w
      ];
  
      // 行列Aの下にmatrixを追加して6x6行列を作成
      let extendedMatrix = [...A, ...matrix];
  
      return extendedMatrix;
    }


    // TODO 掃き出し法などで連立方程式を解く
    function gaussEliminationInteger(A, b) {
      const n = A.length;
  
      // 前進消去 (行列を上三角行列に変換)
      for (let i = 0; i < n; i++) {
        // ピボット選択: A[i][i]がゼロでないことを確認し、ゼロの場合は他の行と交換
        if (A[i][i].value === 0) {
          let swapped = false;
          for (let j = i + 1; j < n; j++) {
              if (A[j][i].value !== 0) {
                  // 行の交換
                  [A[i], A[j]] = [A[j], A[i]];
                  [b[i], b[j]] = [b[j], b[i]];
                  swapped = true;
                  break;
              }
          }
              if (!swapped) {
                  throw new Error("解が存在しません: 解が一意でないか、係数行列が特異行列です");
              }
          }
  
          // ピボットの正規化: A[i][i] を 1 にするために行全体をスケーリング
          const pivot = A[i][i];
          for (let j = i; j < n; j++) {
              A[i][j] = A[i][j].devide(pivot);
          }
          b[i] = b[i].devide(pivot);
  
          // 他の行を消去
          for (let j = i + 1; j < n; j++) {
              const factor = A[j][i];
              for (let k = i; k < n; k++) {
                  A[j][k] = A[j][k].subtract(A[i][k].multiple(factor));
              }
              b[j] = b[j].subtract(b[i].multiple(factor));
          }
      }
  
      // 後退代入 (上三角行列を解く)
      const x = new Array(n).fill(FieldF4(0));
      for (let i = n - 1; i >= 0; i--) {
          x[i] = b[i];
          for (let j = i + 1; j < n; j++) {
              x[i] = x[i].subtract(A[i][j].multiple(x[j]));
          }
      }
  
      return x;
  }
  
  // // 使用例
  // const A = [
  //     [2, 1, -1],
  //     [-3, -1, 2],
  //     [-2, 1, 2]
  // ];
  
  // const b = [8, -11, -3];
  
  // const solution = gaussEliminationInteger(A, b);
  // console.log(solution);  // 出力: [2, 3, -1]
  
}

