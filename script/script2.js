// HTMLのキャンバス要素を取得し、2D描画コンテキストを設定
const canvas = document.getElementById("noiseCanvas");
const ctx = canvas.getContext("2d");

// ユーザーが入力したパラメータ（サイズ、スケール、オクターブ、持続性、色）を取得
function generateNoise() {
  const size = parseInt(document.getElementById("size").value) || 600;
  const scale = parseInt(document.getElementById("scale").value) || 50;
  const octaves = parseInt(document.getElementById("octaves").value) || 4;
  const persistence =
    parseFloat(document.getElementById("persistence").value) || 0.5;
  const colors = Array.from(document.getElementsByClassName("colorInput")).map(
    (input) => input.value
  );

  // 2D描画コンテキストをもとに空のImageData オブジェクトを生成
  canvas.width = size;
  canvas.height = size;
  const imageData = ctx.createImageData(size, size);

  function generateImageData() {
    // キャンバスのx軸とy軸の各ピクセルに対してノイズ値を計算し、キャンバス上に描画
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let noise = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        // 指定されたオクターブ数に基づいてノイズ値を計算
        // （さらに詳しい説明が欲しい）
        for (let i = 0; i < octaves; i++) {
          const sampleX = (x / scale) * frequency;
          const sampleY = (y / scale) * frequency;
          const perlinValue = valueNoise(sampleX, sampleY);
          noise += perlinValue * amplitude;

          maxValue += amplitude;
          amplitude *= persistence;
          frequency *= 2;
        }
        // console.log(noise);

        // 計算されたノイズ値に基づいて色を補間
        // ↓ノイズ値の正規化：ノイズ値を0から1の範囲に正規化します。noiseは元々-1から1の範囲にあるため、まずmaxValueで割って正規化し、1を加えて0から2の範囲にし、最後に2で割って0から1の範囲にします.
        noise = (noise / maxValue + 1) / 2; // Normalize to 0-1 range
        // ↓色のインデックス計算：正規化されたノイズ値を使用して、どの色のペアの間で補間するかを決定します。Math.floorは小数点以下を切り捨て、Math.minは結果が"colors.length - 2"を超えないようにします.
        const colorIndex = Math.min(
          Math.floor(noise * (colors.length - 1)),
          colors.length - 2
        );
        // console.log(colorIndex); //今のコードでは下の2色しかほとんど選ばれない。
        // 補間係数の計算：tは0から1の範囲の値で、二つの色の間でどの程度補間するかを決定します。これは、ノイズ値から色のインデックスを引き、正規化することで計算されます.
        const t =
          (noise - colorIndex / (colors.length - 1)) * (colors.length - 1);

        // 色の取得と変換：hexToRgb関数を使用して、選択された二つの色をRGB形式に変換します。colors配列には16進数形式の色が格納されています.
        const color1 = hexToRgb(colors[colorIndex]);
        const color2 = hexToRgb(colors[colorIndex + 1]);

        // 色の補間：lerp関数を使用して、赤、緑、青の各チャンネルを線形補間します。tは補間係数で、color1とcolor2の間の位置を決定します.
        const r = Math.floor(lerp(t, color1.r, color2.r));
        const g = Math.floor(lerp(t, color1.g, color2.g));
        const b = Math.floor(lerp(t, color1.b, color2.b));

        // 各ピクセルにカラー（RGB）と透明度（A）を設定。imageDataは1ピクセル当たり4つずつ設定する
        const index = (y * size + x) * 4;
        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
      }
    }
  }

  // 50x50ピクセルのブロックを描画する関数
  function drawBlock(x, y) {
    const blockData = ctx.createImageData(50, 50);
    for (let by = 0; by < 50; by++) {
      for (let bx = 0; bx < 50; bx++) {
        const sourceIndex = ((y + by) * size + (x + bx)) * 4;
        const targetIndex = (by * 50 + bx) * 4;
        for (let i = 0; i < 4; i++) {
          blockData.data[targetIndex + i] = imageData.data[sourceIndex + i];
        }
      }
    }
    ctx.putImageData(blockData, x, y);
  }

  // 0.2秒ごとにブロックを描画する関数
  function drawInBlocksWithDelay() {
    generateImageData();
    let x = 0;
    let y = 0;

    function drawNextBlock() {
      if (y < size) {
        drawBlock(x, y);
        x += 50;
        if (x >= size) {
          x = 0;
          y += 50;
        }
        setTimeout(drawNextBlock, 7); // 0.2秒後に次のブロックを描画
      }
    }

    drawNextBlock();
  }

  // 描画を開始
  drawInBlocksWithDelay();

  // ブロック毎に表示するアニメーションが不要の場合、これだけ
  // ctx.putImageData(imageData, 0, 0);

  setTimeout(() => {
    const dataURL = canvas.toDataURL();
    document.getElementById("noiseImage").src = dataURL;
  }, 2000);
}

// 2次元のバリューノイズを生成
function valueNoise(x, y) {
  // 入力座標(x,y)を含んでいる整数グリッドの四隅の位置座標
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const y0 = Math.floor(y);
  const y1 = y0 + 1;

  // 整数グリッドの基準点を原点近くに移動させた位置座標
  const sx = x - x0;
  const sy = y - y0;

  const n00 = dotGridGradient(x0, y0);
  const n10 = dotGridGradient(x1, y0);
  const n01 = dotGridGradient(x0, y1);
  const n11 = dotGridGradient(x1, y1);

  const yx = lerp(sy, n00, n01);
  const y2 = lerp(sy, n10, n11);
  return lerp(sx, yx, y2);
}

// グリッドの四隅において、まず擬似乱数勾配ベクトルを生成し、その点から入力座標までの距離ベクトルのドット積を計算する関数
// 「擬似乱数勾配ベクトル」：擬似乱数とは勾配ベクトルの方程式に入力された任意の整数に対して、常に同じ結果が出ることを意味します。従って、無作為のように見えても実際は違います。さらにこれは、それぞれの整数座標が、グラディエント関数が同じであれば決して変わらない”固有の”勾配を持つことを意味する。
function dotGridGradient(ix, iy) {
  const random =
    2920.0 *
    Math.sin(ix * 21942.0 + iy * 171324.0 + 8912.0) *
    Math.cos(ix * 23157.0 * iy * 217832.0 + 9758.0);
  return random - Math.floor(random);
}

// 線形補間を行う関数
function lerp(t, a, b) {
  return a + t * (b - a);
}

// カラーコードのHEX（#000000など）をRGBに変換する関数
function hexToRgb(hex) {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return { r, g, b };
}

function resetValues() {
  document.getElementById("size").value = "600";
  document.getElementById("scale").value = "50";
  document.getElementById("octaves").value = "4";
  document.getElementById("persistence").value = "0.5";
  const colorInputs = document.getElementById("colorInputs");
  colorInputs.innerHTML = `
                <input type="color" class="colorInput" value="#000000">
                <input type="color" class="colorInput" value="#ffffff">
                <button onclick="addColorInputClick()" id="addColorBtn" class="addColorIcon"><span class="dli-plus"></span></button> 
                <button onclick="addColorInputClick()" id="addColorBtn" class="addColorIcon"><span class="dli-plus"></span></button> 
                <button onclick="addColorInputClick()" id="addColorBtn" class="addColorIcon"><span class="dli-plus"></span></button> 
                <button onclick="addColorInputClick()" id="addColorBtn" class="addColorIcon"><span class="dli-plus"></span></button> 
                <button onclick="addColorInputClick()" id="addColorBtn" class="addColorIcon"><span class="dli-plus"></span></button> 
                <button onclick="addColorInputClick()" id="addColorBtn" class="addColorIcon"><span class="dli-plus"></span></button> 
                <button onclick="addColorInputClick()" id="addColorBtn" class="addColorIcon"><span class="dli-plus"></span></button> 
                <button onclick="addColorInputClick()" id="addColorBtn" class="addColorIcon"><span class="dli-plus"></span></button> 
            `;
  document.querySelectorAll(".accordion-item").forEach((item) => {
    const content = item.querySelector(".accordion-content");
    if (item.classList.contains("active")) {
      item.classList.remove("active");
    }
    if (item.classList.contains("active")) {
    } else {
      // コンテンツを非表示状態にする
      content.style.maxHeight = "0";
    }
  });
  addColorListeners();
  colorBtnIndex();
  coloring();
  generateNoise();
}

const colorInputs = document.getElementById("colorInputs");
const addColorBtn = document.getElementById("addColorBtn");
const deleteColorBtn = document.getElementById("deleteColorBtn");
// 現在のカラー入力数を取得
let currentInputs = colorInputs.getElementsByClassName("colorInput").length + 1;

// カラー入力数が10になるとaddBtnを無効化し、2以下になるとdeleteBtnを無効化する関数
function colorBtnIndex() {
  let currentInputs = colorInputs.getElementsByClassName("colorInput").length;
  // console.log(currentInputs);
  if (currentInputs < 10) {
    addColorBtn.disabled = false;
  } else {
    addColorBtn.disabled = true;
  }
  if (currentInputs > 2) {
    deleteColorBtn.disabled = false;
  } else if (currentInputs <= 2) {
    deleteColorBtn.disabled = true;
  }
}

function coloring() {
  const colorBoxes = document.querySelectorAll(".colorInput");

  colorBoxes.forEach((box) => {
    // const input = box.querySelector('input[type="color"]');
    box.style.backgroundColor = box.value;

    box.addEventListener("input", function () {
      this.style.backgroundColor = this.value;
    });
  });
}

function addColorInput() {
  currentInputs++;
  if (currentInputs < 11) {
    const newInput = document.createElement("input");
    newInput.type = "color";
    newInput.className = "colorInput";
    newInput.value = "#" + Math.floor(Math.random() * 16777215).toString(16); //16進数で6桁は1677216通り
    // colorInputs.appendChild(newInput);
    // 最初のaddColorBtnを取得
    const firstAddBtn = colorInputs.querySelector("#addColorBtn");
    // 新しいinputを最初のボタンの前に挿入
    colorInputs.insertBefore(newInput, firstAddBtn);
    firstAddBtn.remove();

    newInput.addEventListener("input", generateNoise);
  }
  colorBtnIndex();
  generateNoise();
  coloring();
  accordion();
}

function deleteColorInput() {
  currentInputs--;
  // 最後のcolorInputを取得
  const Inputs = colorInputs.querySelectorAll(".colorInput");
  const lastAddBtn = Inputs[Inputs.length - 1];
  // 新しいinputを最初のボタンの前に挿入
  lastAddBtn.remove();

  // ボタン要素の作成
  const button = document.createElement("button");
  button.id = "addColorBtn";
  button.className = "addColorIcon";
  button.onclick = addColorInputClick;
  // span要素の作成
  const span = document.createElement("span");
  span.className = "dli-plus";
  // spanをボタンの子要素として追加
  button.appendChild(span);
  // ボタンを適切な親要素に追加
  colorInputs.appendChild(button);

  generateNoise();
  colorBtnIndex();
  coloring();
}

function randomizeScale() {
  document.getElementById("scale").value = Math.floor(Math.random() * 91) + 10; // 10-100
  generateNoise();
}

function randomizeOctaves() {
  document.getElementById("octaves").value = Math.floor(Math.random() * 7) + 1; // 1-7
  generateNoise();
}

function randomizePersistence() {
  document.getElementById("persistence").value = (
    Math.random() * 0.8 +
    0.1
  ).toFixed(2); // 0.1-0.9
  generateNoise();
}

function randomizeColors() {
  const colorInputs = document.getElementById("colorInputs");
  colorInputs.innerHTML = ``;
  const colorCount = Math.floor(Math.random() * 4) + 2; // 2-5 colors
  // console.log(colorCount);
  // const colorInputs = document.getElementById("colorInputs");
  // colorInputs.innerHTML = "<label>Colors</label>";
  for (let i = 0; i < colorCount; i++) {
    const newInput = document.createElement("input");
    newInput.type = "color";
    newInput.className = "colorInput";
    newInput.value = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colorInputs.appendChild(newInput);
  }
  // 新しいボタンを生成して追加
  for (let i = 0; i < 10 - colorCount; i++) {
    const button = document.createElement("button");
    button.onclick = addColorInputClick;
    button.id = "addColorBtn";
    button.className = "addColorIcon";

    const span = document.createElement("span");
    span.className = "dli-plus";

    button.appendChild(span);
    colorInputs.appendChild(button);
  }
  addColorListeners();
  colorBtnIndex();
  coloring();
  generateNoise();
}

function randomizeAll() {
  randomizeScale();
  randomizeOctaves();
  randomizePersistence();
  randomizeColors();
  colorBtnIndex();
  coloring();
  generateNoise();
}

// 画像ダウンロードを確認するポップアップを表示
function saveImage() {
  document.getElementById("savePopup").style.display = "block";
  document.querySelector(".popup-layer").style.display = "block";
}

// ポップアップを非表示
function cancelSave() {
  document.getElementById("savePopup").style.display = "none";
  document.querySelector(".popup-layer").style.display = "none";
}

// 画像をダウンロード
function confirmSave() {
  // a要素を生成しdownload属性とhref属性を与える
  const link = document.createElement("a");
  link.download = "value_noise.jpg";
  // canvas.toDataURLでキャンバスの Data URL を取得
  link.href = canvas.toDataURL("image/jpeg");
  // 擬似的にa要素をクリックさせる
  link.click();
  document.getElementById("savePopup").style.display = "none";
  document.querySelector(".popup-layer").style.display = "none";
}

// パラメータ（size, scale, octaves, persistence）が入力されたとき、すぐにキャンバス上に反映される
// 入力値の上限と下限を設定
const inputIds = ["size", "scale", "octaves", "persistence"];
// 各入力フィールドに対して処理を適用
inputIds.forEach((id) => {
  const input = document.getElementById(id);

  input.addEventListener("input", function () {
    let value = parseFloat(this.value);
    const min = parseFloat(this.min);
    const max = parseFloat(this.max);

    if (value > max) {
      this.value = max;
    } else if (value < min) {
      this.value = min;
    }

    generateNoiseClick();
  });
});

// colorが入力されたとき、すぐにキャンバス上に反映される
const colorInput = document.querySelectorAll(".colorInput");
// colorInput.addEventListener("input", generateNoise());
function addColorListeners() {
  colorInput.forEach((input) => {
    input.addEventListener("input", generateNoise());
  });
}

// 新しい.colorInput要素が追加されたときにリスナーを追加する関数
function addListenerToNewColorInput(newInput) {
  newInput.addEventListener("input", generateNoise);
}

// MutationObserverを使用して動的に追加される要素を監視
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.classList.contains("colorInput")
        ) {
          addListenerToNewColorInput(node);
        }
      });
    }
  });
});

// 監視の開始
observer.observe(document.body, { childList: true, subtree: true });

// 関数実行中ローダー
function showLoading() {
  document.getElementById("loading").style.display = "block";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

async function randomizeScaleTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      randomizeScale();
      resolve();
    }, 0);
  });
}
async function randomizeScaleClick() {
  showLoading();
  try {
    await randomizeScaleTask();
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    hideLoading();
  }
}

async function randomizeOctavesTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      randomizeOctaves();
      resolve();
    }, 0);
  });
}
async function randomizeOctavesClick() {
  showLoading();
  try {
    await randomizeOctavesTask();
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    hideLoading();
  }
}

async function randomizePersistenceTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      randomizePersistence();
      resolve();
    }, 0);
  });
}
async function randomizePersistenceClick() {
  showLoading();
  try {
    await randomizePersistenceTask();
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    hideLoading();
  }
}

async function addColorInputTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      addColorInput();
      resolve();
    }, 0);
  });
}
async function addColorInputClick() {
  showLoading();
  try {
    await addColorInputTask();
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    hideLoading();
  }
}

async function deleteColorInputTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      deleteColorInput();
      resolve();
    }, 0);
  });
}
async function deleteColorInputClick() {
  showLoading();
  try {
    await deleteColorInputTask();
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    hideLoading();
  }
}

async function randomizeColorsTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      randomizeColors();
      resolve();
    }, 0);
  });
}
async function randomizeColorsClick() {
  showLoading();
  try {
    await randomizeColorsTask();
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    hideLoading();
  }
}

async function randomizeAllTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      randomizeAll();
      resolve();
    }, 0);
  });
}
async function randomizeAllClick() {
  showLoading();
  try {
    await randomizeAllTask();
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    hideLoading();
  }
}

async function resetValuesTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resetValues();
      resolve();
    }, 0);
  });
}
async function resetValuesClick() {
  showLoading();
  try {
    await resetValuesTask();
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    hideLoading();
  }
}

async function generateNoiseTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      generateNoise();
      resolve();
    }, 0);
  });
}
async function generateNoiseClick() {
  showLoading();
  try {
    await generateNoiseTask();
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    hideLoading();
  }
}

// 初期状態の設定
// resetValues();

// intro.jsを無効化する関数
function introJSdisable() {
  // スクリプト要素を取得
  const introScript = document.getElementById("introJs");
  console.log(introScript);
  // type属性を追加
  if (introScript) {
    introScript.setAttribute("type", "javascript/blocked");
    console.log("Script blocked successfully");
  } else {
    console.log('Script with id "introJs" not found');
  }
}

// introJSdisable();
