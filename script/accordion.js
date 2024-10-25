// アコーディオン
function accordion() {
  document.querySelectorAll(".accordion-item").forEach((item) => {
    const header = item.querySelector(".accordion-header");
    const content = item.querySelector(".accordion-content");

    header.addEventListener("click", () => {
      if (item.classList.contains("active")) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
      if (item.classList.contains("active")) {
        // コンテンツを表示状態にする
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        // コンテンツを非表示状態にする
        content.style.maxHeight = "0";
      }
    });
  });
}

accordion();
