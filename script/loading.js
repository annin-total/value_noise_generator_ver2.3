// // ローダー
// window.addEventListener('DOMContentLoaded', function() {
//   setTimeout(() => {
//     // loaderを消す
//     const loader = document.querySelector('.loader-container')
//     loader.classList.add("loaded")
//     // contentを見せる
//     const content = document.querySelector('.content')
//     content.style.display = "block"
//     content.style.opacity = "1"
//   },2300)
//   this.setTimeout(() => {
//     const loader = document.querySelector('.loader-container')
//     loader.style.display = "none"
//   },4000)
// })

function initMenu() {
  mainTextTL.set(
    ".text-box1 h1, .text-box2 h1, .text-box3 h2, .text-box4 p, .text-box5 p, .text-box6 p, .text-box7 p, .text-box8 button",
    { y: 100, rotateY: 60 }
  );
  mainTextTL.set(".line1, .line2", { opacity: 0 });
}

document.addEventListener("DOMContentLoaded", () => {
  const loadingOverlay = document.getElementById("intro-loading");
  initMenu();
  introAnime();

  // ローディングアニメーションのタイムライン
  const introTL = gsap.timeline();
  introTL.set(".intro-container", { opacity: 0 });
  mainTextTL.set(
    ".text-box1 h1, .text-box2 h1, .text-box3 h2, .text-box4 p, .text-box5 p, .text-box6 p, .text-box7 p, .text-box8 button",
    { y: 100, rotateY: 90 }
  );
  mainTextTL.set(".line1, .line2", { opacity: 0 });

  // 3秒後にローディングオーバーレイをフェードアウト
  introTL
    .to(loadingOverlay, {
      duration: 2,
      opacity: 1,
    })
    .to(".intro-container", {
      opacity: 1,
    })
    .to(
      loadingOverlay,
      {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          // ローディングオーバーレイを非表示にする
          loadingOverlay.style.display = "none";
          // IntervalRandomizeAll()関数を実行
          resetValues();
          IntervalRandomizeAll();
        },
      },
      "+=1.5"
    )
    .to(loadingOverlay, {
      duration: 0.01,
      opacity: 1,
      onComplete: () => {
        introAnime();
        // mainTextTL.play();
      },
    }); // 1.5秒待ってからフェードアウトを開始（合計3秒になるように調整）
});
