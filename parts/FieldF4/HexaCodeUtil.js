import { FieldF4 } from './FieldF4.js'; // FieldF4クラスをインポート
import { FieldF4Matrix } from './FieldF4Matrix.js';

export class HexaCodeUtil {
	constructor() {
	}

    /**
     * 数値からF4ベクトルへの変換
     * @param {*} v 整数の配列
     * @returns vの各要素をFieldF4に変換した配列
     */
    numVec2F4vec(v){
        return v.map(x => new FieldF4(x));
    }

    /**
     * 整数からヘキサ符号への符号化
     * @param {*} n 整数（0~63を想定）
     * @returns nをヘキサ符号化したもの
     */
    encodeFromInt(n){
        n = n%64; // 63以下の数字に直す
        const base4 = n.toString(4).padStart(3, '0'); // 数字を4進数に変換、および0埋め
        let arr = base4.split('').map(x => new FieldF4( parseInt(x, 10))); // 最初の3桁を4元体の値に変換する
        arr.push(arr[0].multiply(new FieldF4(1)).add(arr[1].multiply(new FieldF4(1))).add(arr[2]));
        arr.push(arr[0].multiply(new FieldF4(2)).add(arr[1].multiply(new FieldF4(3))).add(arr[2]));
        arr.push(arr[0].multiply(new FieldF4(3)).add(arr[1].multiply(new FieldF4(2))).add(arr[2]));
        return arr;
    }

    /**
     * ヘキサ符号から整数への復号
     * @param {*} arr ヘキサ符号を表すベクトル
     * @returns arrを復号した整数
     */
    decodeToInt(arr){
        // TODO バリデーションを入れた方がいいかも
        let ret = 0;
        ret += arr[0].value*4*4;
        ret += arr[1].value*4;
        ret += arr[2].value;
        return ret;
    }

    /**
     * 5点問題を解く
     * @param {*} v FieldF4の6次元ベクトル（要素数6の配列）
     * @returns 入力vを最大1桁誤り訂正したもの
     */
    solve5points(v) {
        // 配列の長さが6未満なら、6になるまでundefinedを追加
        while (v.length < 6) {
            v.push(undefined);
        }
        // vのundefinedの元が1個以下であることをチェック
        let undefinedCount = v.filter(x => x === undefined).length;
        if (undefinedCount > 1) {
            throw new Error("vの中でundefinedでない要素は1個以下でなければなりません");
        }

        // w1とw2をundefinedとして3点問題を解く
        let v12 = [...v];
        v12[0] = undefined;
        v12[1] = undefined;
        if(v12.filter(x => x === undefined).length !== 3){
            v12[4] = undefined;
        }
        // 誤りが1か所以下ならそれを解とみなす
        let ans12 = this.solve3points(v12);
        if(compareArrays(v, ans12)){
            return ans12;
        }

        // w3とw4をundefinedとして3点問題を解く
        let v34 = [...v];
        v34[2] = undefined;
        v34[3] = undefined;
        if(v34.filter(x => x === undefined).length !== 3){
            v34[5] = undefined;
        }
        // 誤りが1か所以下ならそれを解とみなす
        let ans34 = this.solve3points(v34);
        if(compareArrays(v, ans34)){
            return ans34;
        }

        // w5とw6をundefinedとして3点問題を解く
        let v56 = [...v];
        v56[4] = undefined;
        v56[5] = undefined;
        if(v56.filter(x => x === undefined).length !== 3){
            v56[0] = undefined;
        }
        // 誤りが1か所以下ならそれを解とみなす
        let ans56 = this.solve3points(v56);
        if(compareArrays(v, ans56)){
            return ans56;
        }

        console.warn("5点問題を解けませんでした");
        return undefined;

        function compareArrays(a, b) {
            // 配列の長さが異なる場合、false を返す
            if (a.length !== b.length) {
                return false;
            }
        
            let diff = 0;

            // 配列の要素を比較
            for (let i = 0; i < a.length; i++) {
                // aの要素がundefinedでない場合
                if (a[i] !== undefined) {
                    // aとbの対応する要素を比較
                    if (!a[i].isEqual(b[i])) {
                        diff++;
                        if(diff > 1){
                            return false;
                        }
                    }
                }
            }
        
            // 条件を満たす場合は true
            return true;
        }
    }

    solve3points(v) {
        // vのundefinedの元が3個であることをチェック
        let undefinedCount = v.filter(x => x === undefined).length;
        if (undefinedCount !== 3) {
            throw new Error("vの中でundefinedでない要素はちょうど3個でなければなりません");
        }

        //係数行列を生成
        let A = createCoefficientMatrix(v);
        // console.log("A:");
        // console.log(A.toString());

        // ベクトル内のundefinedの要素を末尾に移動させる
        let b = v.sort((a, b) => (a === undefined ? -1 : (b === undefined ? 1 : 0)));
        // undefinedの要素をFieldF4(0)に置き換える
        b = b.map(item => item === undefined ? new FieldF4(0) : item);
        // console.log("b:");
        // console.log(b);

        // FieldF4Matrixに変換する
        let bMatrix = new FieldF4Matrix(v.length, 1, b.map(item => [item.value]));

        // 掃き出し法などで連立方程式を解く
        let ans = gaussEliminationF4(A, bMatrix);
        // console.log("ans:");
        // console.log(ans);
        return ans;

        
        /* 係数行列を作成する関数 */
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
        
            // 3*6の FieldF4Matrix を作成
            const matrix = new FieldF4Matrix(3, 6); // 初期値は0
        
            // 各行の `knownIndices` に1をセット
            for (let i = 0; i < 3; i++) {
                matrix.setElement(i, knownIndices[i], 1); // knownIndices[i] の位置を1にセット
            }
        
            // 均衡条件、オメガ条件から係数行列の要素を設定
            // x1 + x2 = x3 + x4
            // x1 + x2 = x5 + x6
            // x1 + x2 = (x1 + x3 + x5) * w
            const coefficiences = [
                [1, 1, 1, 1, 0, 0],
                [1, 1, 0, 0, 1, 1],
                [3, 1, 2, 0, 2, 0]
            ];
            
            // 数値配列から FieldF4Matrix を作成
            let A = new FieldF4Matrix(3, 6, coefficiences);
            
        // matrixの下に行列Aを追加して6x6行列を作成
            let extendedMatrix = FieldF4Matrix.mergeMatrices(matrix, A);
            // // 行列 extendedMatrix を表示
            // console.log("Matrix extendedMatrix:");
            // console.log(extendedMatrix.toString());
        
            return extendedMatrix;
        }

        /* ガウスの消去法で連立方程式を解く関数 */
        function gaussEliminationF4(A, b) {
            const n = A.matrix.length;
        
            // 前進消去 (行列を上三角行列に変換)
            for (let i = 0; i < n; i++) {
                // ピボット選択: A[i][i]がゼロでないことを確認し、ゼロの場合は他の行と交換
                if (A.matrix[i][i].value === 0) {
                    let swapped = false;
                    for (let j = i + 1; j < n; j++) {
                        if (A.matrix[j][i].value != 0) {
                            // 行の交換
                            [A.matrix[i], A.matrix[j]] = [A.matrix[j], A.matrix[i]];
                            [b.matrix[i], b.matrix[j]] = [b.matrix[j], b.matrix[i]];
                            swapped = true;
                            break;
                        }
                    }
                    if (!swapped) {
                        throw new Error("解が存在しません: 解が一意でないか、係数行列が特異行列です");
                    }
                }

                // ピボットの正規化: A[i][i] を 1 にするために行全体をスケーリング
                const pivot = A.matrix[i][i];
                for (let j = i; j < n; j++) {
                    A.matrix[i][j] = A.matrix[i][j].divide(pivot);
                }
                b.matrix[i][0] = b.matrix[i][0].divide(pivot);
        
                // 他の行を消去
                for (let j = i + 1; j < n; j++) {
                    const factor = A.matrix[j][i];
                    for (let k = i; k < n; k++) {
                        A.matrix[j][k] = A.matrix[j][k].subtract(A.matrix[i][k].multiply(factor));
                    }
                    b.matrix[j][0] = b.matrix[j][0].subtract(b.matrix[i][0].multiply(factor));
                }
            }
            // console.log("A:");
            // console.log(A.toString());
            // console.log("B:");
            // console.log(b.toString());
        
            // 後退代入 (上三角行列を解く)
            const x = new Array(n).fill(new FieldF4(0));
            for (let i = n - 1; i >= 0; i--) {
                x[i] = b.matrix[i][0];
                for (let j = i + 1; j < n; j++) {
                    x[i] = x[i].subtract(A.matrix[i][j].multiply(x[j]));
                }
                x[i] = x[i].divide(A.matrix[i][i]);
            }
        
            return x;
        }
    }
}




