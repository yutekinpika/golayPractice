// FieldF4Matrix.js
import { FieldF4 } from './FieldF4.js';

export class FieldF4Matrix {
    constructor(rows, cols, values = null) {
        this.rows = rows;
        this.cols = cols;

        // 行列の初期化
        this.matrix = Array.from({ length: rows }, () => Array(cols).fill(undefined)); 

        // values が与えられた場合、それを使って行列をセット
        if (values) {
            this.setMatrixFromValues(values);
        } else {
            this.setAll(0);
        }
    }

    // 行列の表示
    toString() {
        return this.matrix
            .map(row => row.map(cell => cell.toString()).join(' '))  // 各要素をtoString()で文字列化し、行ごとに結合
            .join('\n');  // 行ごとに改行を挿入
    }

    // 行列の要素にアクセス (getter)
    getElement(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            throw new Error('Index out of bounds');
        }
        return this.matrix[row][col];
    }

    // 行列の要素を更新 (setter)
    setElement(row, col, value) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            throw new Error('Index out of bounds');
        }
        this.matrix[row][col] = new FieldF4(value);
    }

    // 行列の全要素を一括で設定
    setAll(value) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.matrix[r][c] = new FieldF4(value);
            }
        }
    }

    // 数値の2次元配列から行列をセット
    setMatrixFromValues(values) {
        // valuesが二次元配列であることを確認
        if (!Array.isArray(values) || !Array.isArray(values[0])) {
            throw new Error("values must be a 2D array.");
        }

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                // values[r][c]がundefinedでないことを確認し、FieldF4に変換
                if (values[r] && values[r][c] !== undefined) {
                    this.matrix[r][c] = new FieldF4(values[r][c]);
                }
            }
        }
    }

    /**
     * 複数の行列を結合して新しい行列を作成
     * @param {...FieldF4Matrix} matrices - 結合する行列
     * @returns {FieldF4Matrix} - 結合された新しい行列
     */
    static mergeMatrices(...matrices) {
        // 最初の行列の列数を基準にする
        const cols = matrices[0].cols;
        // 行列がすべて同じ列数を持つか確認
        matrices.forEach(matrix => {
            if (matrix.cols !== cols) {
                throw new Error("すべての行列は同じ列数を持っている必要があります");
            }
        });

        // 行数をすべての行列の合計として計算
        const totalRows = matrices.reduce((sum, matrix) => sum + matrix.rows, 0);

        // 新しい行列を作成
        const mergedMatrix = new FieldF4Matrix(totalRows, cols, 0);

        let currentRow = 0;
        // 各行列を順番に結合
        matrices.forEach(matrix => {
            for (let i = 0; i < matrix.rows; i++) {
                for (let j = 0; j < matrix.cols; j++) {
                    mergedMatrix.setElement(currentRow, j, matrix.getElement(i, j).value);
                }
                currentRow++;
            }
        });

        return mergedMatrix;
    }
}