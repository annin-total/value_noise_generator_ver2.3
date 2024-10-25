// メニューの表示/非表示のためのクリッピングパス定義
const clipPath = {
  init: "inset(0% 0% 0% 0%)",
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
};

const captions = document.querySelectorAll(".caption span");
const tds = document.querySelectorAll("td > span");

// isEnabledでメニューの開閉状態を追跡。メニューが開いた状態がtrue
let isEnabled = false;

const tlMenu = gsap.timeline({
  paused: true,
  defaults: { duration: 1.6, ease: "expo.inOut" },
});

function initMenu() {
  gsap.set(".howtouse-container", {
    pointerEvents: "none",
    clipPath: clipPath.bottom,
  });
  gsap.set(tds, { y: 100, rotateY: 70 });
  gsap.set(captions, { y: 100, rotateY: 70 });
  gsap.set(".howtouse-title1", { y: 100, rotateY: 70 });
  // アニメーション内容の準備。ただ、tlMenu はポーズ状態で作成されているため、この時点ではアニメーションは実行されず、後で tlMenu.play() メソッドが呼ばれたときに実行されます。
  animateInnerMenu();
}

// メニュー全体の開閉アニメーションを制御。isEnabledの状態に応じて異なるアニメーションを適用。
function animateMenu() {
  if (!isEnabled) {
    // メニューを開く場合
    gsap
      .timeline()
      .to(".howtouse-container", {
        duration: 1.2,
        pointerEvents: "auto",
        clipPath: clipPath.init,
        ease: "expo.inOut",
      })
      .to(
        ".menu-btn",
        {
          duration: 1,
          color: "#fff",
          borderColor: "#fff",
          ease: "Power2.inOut",
        },
        "+=0"
      ); // 1秒後に開始
  } else {
    // メニューを閉じる場合
    gsap
      .timeline()
      .to(".howtouse-container", {
        duration: 1.2,
        pointerEvents: "auto",
        clipPath: clipPath.top,
        ease: "expo.inOut",
        // onComplete: アニメーション完了時のコールバック関数。
        onComplete: () => {
          gsap.set(".howtouse-container", {
            pointerEvents: "none",
            clipPath: clipPath.bottom,
          });
        },
      })
      .to(
        ".menu-btn",
        {
          duration: 1,
          color: "#000",
          borderColor: "#000",
          ease: "Power2.inOut",
        },
        "+=0"
      );
  }
}

// メニュー内の各要素（ページ、情報、タイトル、メディア）のアニメーションを定義
function animateInnerMenu() {
  tlMenu
    .to(".howtouse-title1", {
      y: 0,
      rotateY: 0,
    })
    .to(
      captions,
      {
        y: 0,
        rotateY: 0,
        stagger: 0.055,
      },
      0.055
    )
    .to(
      tds,
      {
        y: 0,
        rotateY: 0,
        stagger: 0.055,
      },
      0.2
    );
}

// メニューボタンのテキスト変更とフェードアニメーションを制御
function animateButton(text) {
  gsap
    .timeline()
    .to(".menu-btn", {
      duration: 0.4,
      autoAlpha: 1,
    })
    .to(".menu-btn", {
      duration: 0.8,
      autoAlpha: 0,
      y: -8,
      pointerEvents: "none",
      onComplete: () => {
        document.querySelector(".menu-btn").textContent = text;
      },
    })
    .to(".menu-btn", {
      duration: 0.4,
      autoAlpha: 0,
    })
    .to(".menu-btn", {
      duration: 0.8,
      autoAlpha: 1,
      y: 0,
      pointerEvents: "auto",
    });
}

// メニューボタンのクリックイベントを設定。クリック時にメニューの開閉とボタンテキストの変更を行う。
function menuBtnListeners() {
  document.querySelector(".menu-btn").addEventListener("click", () => {
    if (!isEnabled) {
      animateButton("Close");
      animateMenu();
      tlMenu.play();
      document.querySelector(".menu-btn").style.borderColor = "#000";
    } else {
      animateButton("How to Use ?");
      animateMenu();
      tlMenu.reverse();
    }

    //  メニューの状態を反転して更新
    isEnabled = !isEnabled;
  });
}

// ページ読み込み完了時に初期化処理を実行
window.addEventListener("DOMContentLoaded", () => {
  initMenu();
  console.log("aa");
  menuBtnListeners();
});
