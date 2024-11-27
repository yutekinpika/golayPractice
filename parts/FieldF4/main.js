import { FieldF4 } from './FieldF4.js'; // FieldF4クラスをインポート
import { hexaCodeUtil } from './hexaCodeUtil.js'; 

// // ベクトルの定義 
// let v = [ new FieldF4(0), new FieldF4(1), new FieldF4(0), new FieldF4(3), new FieldF4(0), new FieldF4(1)];

// // 行列 b を表示
// console.log("v:");
// console.log(v);

const hexUtil = new hexaCodeUtil();

// let ans = hexUtil.solve5points(v);
// console.log(ans);

for(let i=0;i<64;i++){
    console.log(JSON.stringify(hexUtil.encodeFromInt(i)) == JSON.stringify(hexUtil.encodeFromInt2(i)));
    if(JSON.stringify(hexUtil.encodeFromInt(i)) != JSON.stringify(hexUtil.encodeFromInt2(i))){
        console.log(i);
        // console.log(hexUtil.encodeFromInt(i));
        // console.log(hexUtil.encodeFromInt2(i));
    };
}

// console.log(hexUtil.encodeFromInt2(14));