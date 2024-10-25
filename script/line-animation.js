// ラインアニメーション
let line = document.querySelector(".line1");
let boxWidth = 150;
let lineWidth = line.offsetWidth;
let minDistance = 50;
let maxDistance = boxWidth - lineWidth;
let isMovingRight = true; // 移動方向を追跡するフラグ
let currentPosition = 0; // 現在の位置を追跡

function moveLine() {
  let moveDistance =
    Math.floor(Math.random() * (maxDistance - minDistance + 1)) + minDistance;

  if (isMovingRight) {
    currentPosition = Math.min(currentPosition + moveDistance, maxDistance);
    if (currentPosition >= maxDistance) {
      isMovingRight = false;
    }
  } else {
    currentPosition = Math.max(currentPosition - moveDistance, 0);
    if (currentPosition <= 0) {
      isMovingRight = true;
    }
  }

  line.style.left = currentPosition + "px";
}
// 初回の移動を即座に行う
moveLine();
// その後、定期的に移動を行う
setInterval(moveLine, 6400);

let line2 = document.querySelector(".line2");

function moveLine2() {
  let moveDistance =
    Math.floor(Math.random() * (maxDistance - minDistance + 1)) + minDistance;

  if (isMovingRight) {
    currentPosition = Math.min(currentPosition + moveDistance, maxDistance);
    if (currentPosition >= maxDistance) {
      isMovingRight = false;
    }
  } else {
    currentPosition = Math.max(currentPosition - moveDistance, 0);
    if (currentPosition <= 0) {
      isMovingRight = true;
    }
  }

  line2.style.left = currentPosition + "px";
}
moveLine2();
setInterval(moveLine2, 5100);
