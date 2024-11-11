// FieldF4.js

export class FieldF4 {
	constructor(value) {
	  this.value = value; // 0: 0, 1: 1, 2: w, 3: wb
	}
  
	// 加算 (クラインの四元群)
	add(other) {
	  const additionTable = [
		[0, 1, 2, 3], // 0 + {0, 1, w, wb} = {0, 1, w, wb}
		[1, 0, 3, 2], // 1 + {0, 1, w, wb} = {1, 0, wb, w}
		[2, 3, 0, 1], // w + {0, 1, w, wb} = {w, wb, 0, 1}
		[3, 2, 1, 0]  // wb + {0, 1, w, wb} = {wb, w, 1, 0}
	  ];
	  return new FieldF4(additionTable[this.value][other.value]);
	}
  
	subtract(other){
		return this.add(other);
	}

	// 乗算 (3次巡回群)
	multiply(other) {
	  const multiplicationTable = [
		[0, 0, 0, 0],  // 0 * {0, 1, w, wb} = 0
		[0, 1, 2, 3],  // 1 * {0, 1, w, wb} = {0, 1, w, wb}
		[0, 2, 3, 1],  // w * {0, 1, w, wb} = {0, w, wb, 1}
		[0, 3, 1, 2]   // wb * {0, 1, w, wb} = {0, wb, 1, w}
	  ];
	  return new FieldF4(multiplicationTable[this.value][other.value]);
	}
  
	divide(other) {
		// 0除算はエラー
		if (other.value == 0) {
			throw new Error("0除算はできません");
		}
		const divisionTable = [
		  [undefined, 0, 0, 0],  // 0 / { 1, w, wb} = 0
		  [undefined, 1, 2, 3],  // 1 / { 1, w, wb} = { 1, wb, w}
		  [undefined, 2, 3, 1],  // w / { 1, w, wb} = { w, 1, wb}
		  [undefined, 3, 1, 2]   // wb / { 1, w, wb} = { wb, w, 1}
		];
		return new FieldF4(divisionTable[this.value][other.value]);
	  }

	// 文字列表示
	toString() {
	  switch (this.value) {
		case 0: return "0";
		case 1: return "1";
		case 2: return "w";
		case 3: return "wb";
		default: return "";
	  }
	}
  }
//   // 使用例
//   let zero = new FieldF4(0);  // 0
//   let one = new FieldF4(1);   // 1
//   let w = new FieldF4(2);     // w
//   let wb = new FieldF4(3);    // wb
  
//   // 加算の例
//   console.log(`${w.toString()} + ${wb.toString()} = ${(w.add(wb)).toString()}`);  // w + wb = 1
//   console.log(`${w.toString()} + ${w.toString()} = ${(w.add(w)).toString()}`);  // w + w = 0
//   console.log(`${one.toString()} + ${wb.toString()} = ${(one.add(wb)).toString()}`);  // 1 + wb = w
  
//   // 乗算の例
//   console.log(`${w.toString()} * ${w.toString()} = ${(w.multiply(w)).toString()}`);  // w * w = wb
//   console.log(`${wb.toString()} * ${w.toString()} = ${(wb.multiply(w)).toString()}`);  // wb * w = 1
//   console.log(`${one.toString()} * ${wb.toString()} = ${(one.multiply(wb)).toString()}`);  // 1 * wb = wb
  