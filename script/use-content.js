const howtouseContainer = document.querySelector(".howtouse-container");
const howtouseTable = document.querySelector(".howtouse-table");
const rows = document.querySelectorAll(".howtouse-tr");
const howtouseImages = [
  "./img/img9.jpg",
  "./img/img7.jpg",
  "./img/img2.jpg",
  "./img/img4.jpg",
  "./img/img5.jpg",
  "./img/img6.jpg",
  "./img/img10.jpg",
  "./img/img9.jpg",
];

// デフォルトの背景画像を設定（非表示）
howtouseContainer.style.backgroundImage = `url('${howtouseImages[0]}')`;
howtouseContainer.style.backgroundSize = "cover";
howtouseContainer.style.backgroundPosition = "center";

// マウスがtable外に出た時はfadeを全て消す
howtouseTable.addEventListener("mouseleave", () => {
  rows.forEach((row) => {
    row.querySelectorAll("td").forEach((cell) => cell.classList.remove("fade"));
  });
});

// (1)ホバーしている行のクラス名に「tr-[i]」を付ける。背景画像を変える。
// (2)ホバーしている行以外のすべての行のtdのクラス名にfadeをつける。
// rows.forEach((row, index) => {
//   row.addEventListener("mouseenter", () => {
//     howtouseContainer.style.backgroundImage = `url('${howtouseImages[index]}')`;
//     howtouseContainer.style.opacity = "1";
//     row.classList.add(`tr-${index + 1}`);

//     // 他の行のテキストを薄くする
//     if (index !== 0 && index !== 7) {
//       rows.forEach((otherRow, otherIndex) => {
//         if (otherIndex !== index) {
//           otherRow
//             .querySelectorAll("td")
//             .forEach((cell) => cell.classList.add("fade"));
//         }
//       });
//     }
//   });

//   row.addEventListener("mouseleave", () => {
//     row.classList.remove(`tr-${index + 1}`);

//     // 全ての行のテキストの透明度を元に戻す;
//     rows.forEach((otherRow) => {
//       otherRow
//         .querySelectorAll("td")
//         .forEach((cell) => cell.classList.remove("fade"));
//     });
//   });
// });

// テスト
rows.forEach((row, index) => {
  row.addEventListener("mouseenter", async () => {
    const imageUrl = howtouseImages[index];
    const img = new Image();

    // 画像の読み込みが完了したら背景画像を設定
    img.onload = () => {
      howtouseContainer.style.backgroundImage = `url('${imageUrl}')`;
      howtouseContainer.style.opacity = "1";
    };

    // 画像の読み込みを開始
    img.src = imageUrl;

    row.classList.add(`tr-${index + 1}`);

    // 他の行のテキストを薄くする
    if (index !== 0 && index !== 7) {
      rows.forEach((otherRow, otherIndex) => {
        if (otherIndex !== index) {
          otherRow
            .querySelectorAll("td")
            .forEach((cell) => cell.classList.add("fade"));
        }
      });
    }
  });

  row.addEventListener("mouseleave", () => {
    row.classList.remove(`tr-${index + 1}`);

    // 全ての行のテキストの透明度を元に戻す;
    rows.forEach((otherRow) => {
      otherRow
        .querySelectorAll("td")
        .forEach((cell) => cell.classList.remove("fade"));
    });
  });
});
