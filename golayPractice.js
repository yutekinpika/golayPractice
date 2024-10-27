const rows = 4;
const cols = 6;
const checkboxData = Array.from({ length: rows }, () => Array(cols).fill(0));
const transformedData = Array.from({ length: rows }, () => Array(cols).fill(0));

const mapping = [
    0, 24, 1, 11, 2, 22,
    19, 3, 20, 4, 10, 18,
    15, 6, 14, 16, 17, 8,
    5, 9, 21, 13, 7, 12
];

function updateCounts() {
    const counts = Array(cols).fill(0);
    for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
            if (checkboxData[i][j] === 1) {
                counts[j]++;
            }
        }
    }

    // 行1の合計を計算
    const row1Count = counts.reduce((sum, count) => sum + count, 0);
    
    // カウントを表示
    document.querySelectorAll('.count').forEach((el, index) => {
        el.textContent = counts[index];
    });

    // 行1の合計を表示
    document.getElementById('row1Total').textContent = row1Count;

    // transformedDataを更新
    updateTransformedData();
}

function updateTransformedData() {
    // transformedDataの初期化
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            transformedData[i][j] = 0; // 初期化
        }
    }

    // checkboxDataに基づいてtransformedDataを更新
    for (let i = 0; i < rows * cols; i++) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        if (checkboxData[r][c] === 1) {
            const transformedIndex = (i + 1) % 22;
            transformedData[Math.floor(transformedIndex / cols)][transformedIndex % cols] = 1; // オン
        }
    }

    // 23と24の要素をcheckboxDataから取得
    transformedData[3][3] = checkboxData[3][3]; // index 23
    transformedData[3][4] = checkboxData[3][4]; // index 24

    // transformedDataを表示
    displayTransformedData();
}

function displayTransformedData() {
    const transformedTable = document.getElementById('transformedTable');
    transformedTable.innerHTML = ''; // 初期化

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = transformedData[i][j] === 1;
            checkbox.disabled = true; // 選択不可
            cell.appendChild(checkbox);
            row.appendChild(cell);
        }
        transformedTable.appendChild(row);
    }
}

function createCheckbox(i, j) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function() {
        checkboxData[i][j] = this.checked ? 1 : 0;
        updateCounts();
    });
    return checkbox;
}

function createRow(i) {
    const row = document.createElement('tr');
    for (let j = 0; j < cols; j++) {
        const cell = document.createElement('td');
        const checkbox = createCheckbox(i, j);
        cell.appendChild(checkbox);
        row.appendChild(cell);
    }
    return row;
}

// チェックボックスの生成
for (let i = 0; i < rows; i++) {
    const row = createRow(i);
    document.getElementById('checkboxTable').appendChild(row);
}

// カウントを表示するための行を追加
const countRow = document.createElement('tr');
for (let j = 0; j < cols; j++) {
    const cell = document.createElement('td');
    cell.className = 'count';
    cell.textContent = 0;
    countRow.appendChild(cell);
}

// 行1の合計を表示するセルを追加
const totalCell = document.createElement('td');
totalCell.id = 'row1Total'; // 行1の合計を表示するためのID
totalCell.textContent = 0; // 初期値は0
countRow.appendChild(totalCell);

document.getElementById('checkboxTable').appendChild(countRow);
