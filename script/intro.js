// イントロ専用js
function IntervalRandomizeAll() {
  document.getElementById("size").value = 500;
  setInterval(() => {
    randomizeAll();
  }, 4000);
}

// 初期設定
// resetValues();
// IntervalRandomizeAll();

// GSAPイントロアニメーション
// document.addEventListener("DOMContentLoaded", () => {
//   const mainTextTL = gsap.timeline();
//   mainTextTL.set(
//     ".text-box1 h1, .text-box2 h1, .text-box3 h2, .text-box4 p, .text-box5 p, .text-box6 p, .text-box7 p, .text-box8 button",
//     { y: 100, rotateY: 60 }
//   );
//   mainTextTL.set(".line1, .line2", { opacity: 0 });
//   mainTextTL
//     .to(
//       ".text-box1 h1, .text-box2 h1, .text-box3 h2, .text-box4 p, .text-box5 p, .text-box6 p, .text-box7 p",
//       {
//         duration: 1,
//         y: 0,
//         rotateY: 0,
//         ease: "power2.out",
//         stagger: 0.1,
//       },
//       "+=1"
//     )
//     .to(
//       ".text-box8 button",
//       {
//         duration: 1,
//         y: 0,
//         rotateY: 0,
//         ease: "power2.out",
//       },
//       "-=1.4"
//     )
//     .to(
//       ".line1, .line2",
//       {
//         duration: 1,
//         opacity: 1,
//       },
//       "+=0.3"
//     );
// });

const mainTextTL = gsap.timeline();

function introAnime() {
  mainTextTL.set(
    ".text-box1 h1, .text-box2 h1, .text-box3 h2, .text-box4 p, .text-box5 p, .text-box6 p, .text-box7 p, .text-box8 button",
    { y: 100, rotateY: 90 }
  );
  mainTextTL.set(".line1, .line2", { opacity: 0 });
  mainTextTL
    .to(
      ".text-box1 h1, .text-box2 h1, .text-box3 h2, .text-box4 p, .text-box5 p, .text-box6 p, .text-box7 p",
      {
        duration: 1,
        y: 0,
        rotateY: 0,
        ease: "power2.out",
        stagger: 0.1,
      },
      "+=0.9"
    )
    .to(
      ".text-box8 button",
      {
        duration: 1,
        y: 0,
        rotateY: 0,
        ease: "power2.out",
      },
      "-=1.5"
    );
  // .to(
  //   ".line1, .line2",
  //   {
  //     duration: 1,
  //     opacity: 1,
  //   },
  //   "+=0.3"
  // );
}
