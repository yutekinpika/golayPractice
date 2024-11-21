// ボタンがクリックされたときにメッセージと説明を更新する関数
function updateContent(buttonName, description) {
    // メッセージの内容を更新
    document.getElementById('message').innerText = buttonName + 'が選ばれました';

    // 各ボタンに対応する説明文を更新
    const descriptionElement = document.getElementById('desc1');
    const allDescriptions = document.querySelectorAll('.button-item p');
    allDescriptions.forEach(p => p.innerText = ''); // すべての説明文をリセット

    // クリックしたボタンの説明を表示
    if (buttonName === 'ボタン1') {
        document.getElementById('desc1').innerText = description;
    } else if (buttonName === 'ボタン2') {
        document.getElementById('desc2').innerText = description;
    } else if (buttonName === 'ボタン3') {
        document.getElementById('desc3').innerText = description;
    } else if (buttonName === 'ボタン4') {
        document.getElementById('desc4').innerText = description;
    }
}

// 配列をランダムにシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  // 0からiまでのランダムなインデックス
        [array[i], array[j]] = [array[j], array[i]];  // 配列の要素を交換
    }
    return array;  // シャッフルされた配列を返す
}

function toBase4Array() {
    const base4Array = [];

    // 1〜60までの数を4進数に変換して3桁になるように0埋めして配列に格納
    for (let i = 1; i <= 52; i++) {
        const base4 = i.toString(4);  // 数字を4進数に変換
        const paddedBase4 = base4.padStart(3, '0');  // 3桁に0埋め
        base4Array.push(paddedBase4);
    }

    return base4Array;
}

// 結果を取得
const base4Numbers = toBase4Array();
// ランダムな配列を取得
let randomBase4Numbers = shuffleArray(base4Numbers);
console.log(randomBase4Numbers);

function createCardMapping() {
    // 1〜52の4進数とトランプを紐づける連想配列
    const suits = ['♠', '♡', '♣', '♢'];  // スート（マーク）
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];  // トランプの数字と絵札
    const cardMapping = {};

    let cardIndex = 1;
    // 1〜52の4進数とトランプを紐づける
    for (let suit of suits) {
        for (let value of values) {
            const card = suit + value;
            const base4Index = (cardIndex++).toString(4).padStart(3, '0');  // 4進数に変換し、3桁に0埋め
            cardMapping[base4Index] = card;
        }
    }

    return cardMapping;
}

// 結果を取得
const cardMapping = createCardMapping();
console.log(cardMapping);