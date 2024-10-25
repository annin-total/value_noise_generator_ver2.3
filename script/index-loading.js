// // ローダー
document.addEventListener("DOMContentLoaded", () => {
  const introLoadingOverlay = document.getElementById("intro-loading");
  // initMenu();
  // introAnime();

  // ローディングアニメーションのタイムライン
  const introTL = gsap.timeline();
  // introTL.set(".intro-container", { opacity: 0 });
  // mainTextTL.set(
  //   ".text-box1 h1, .text-box2 h1, .text-box3 h2, .text-box4 p, .text-box5 p, .text-box6 p, .text-box7 p, .text-box8 button",
  //   { y: 100, rotateY: 60 }
  // );
  // mainTextTL.set(".line1, .line2", { opacity: 0 });

  // 3秒後にローディングオーバーレイをフェードアウト
  introTL
    .to(introLoadingOverlay, {
      duration: 2,
      opacity: 1,
    })
    .to(".intro-loading-container", {
      opacity: 1,
    })
    .to(
      introLoadingOverlay,
      {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          // ローディングオーバーレイを非表示にする
          introLoadingOverlay.style.display = "none";
          // ローディング後に読み込む関数を記述
          initMenu();
          resetValues();
          accordion();
        },
      },
      "+=1.5"
    )
    .to(introLoadingOverlay, {
      duration: 0.01,
      opacity: 1,
      onComplete: () => {
        // introAnime();
        // mainTextTL.play();
        introAnimeIndex();
      },
    }); // 1.5秒待ってからフェードアウトを開始（合計3秒になるように調整）
  // .to(".howtouse-container", {
  //   duration: 1,
  //   backgroundImage: `url('${howtouseImages[0]}')`,
  // })
  // .to(".howtouse-container", {
  //   duration: 1,
  //   backgroundImage: `url('${howtouseImages[1]}')`,
  // })
  // .to(".howtouse-container", {
  //   duration: 1,
  //   backgroundImage: `url('${howtouseImages[2]}')`,
  // })
  // .to(".howtouse-container", {
  //   duration: 1,
  //   backgroundImage: `url('${howtouseImages[3]}')`,
  // })
  // .to(".howtouse-container", {
  //   duration: 1,
  //   backgroundImage: `url('${howtouseImages[4]}')`,
  // })
  // .to(".howtouse-container", {
  //   duration: 1,
  //   backgroundImage: `url('${howtouseImages[5]}')`,
  // })
  // .to(".howtouse-container", {
  //   duration: 1,
  //   backgroundImage: `url('${howtouseImages[6]}')`,
  // });
  // .to(".howtouse-container", {
  //   duration: 0.1,
  //   backgroundImage: `url('${howtouseImages[7]}')`,
  // });
});

const LaunchTL = gsap.timeline();
LaunchTL.set(".introduction-link", { y: -20, autoAlpha: 0 });
LaunchTL.set(".menu-btn", { y: -20, autoAlpha: 0 });
LaunchTL.set(".sidebar", { y: -10, autoAlpha: 0 });

function introAnimeIndex() {
  // LaunchTL.set(".introduction-link", { y: -20, autoAlpha: 0 });
  // LaunchTL.set(".menu-btn", { y: -20, autoAlpha: 0 });
  LaunchTL.to(".introduction-link, .menu-btn", {
    duration: 1,
  })
    .to(".introduction-link, .menu-btn", {
      duration: 1,
      y: 0,
      autoAlpha: 1,
    })
    .to(
      ".sidebar",
      {
        duration: 1,
        y: 0,
        autoAlpha: 1,
      },
      "-=0.7"
    );
}
