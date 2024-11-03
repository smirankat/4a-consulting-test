const offerPrices = [
  ...document.querySelectorAll(".item__price p:first-child span"),
];
const fullPrices = [
  ...document.querySelectorAll(".item__price p:last-child span"),
];
const popupFullPrices = [...document.querySelectorAll(".line-through span")];
const popupPrices = [...document.querySelectorAll(".dialog__price p span")];

let data = [];
let popularPrices = [];
let prices = [];

//Receiving data
(async () => {
  const res = await fetch("https://t-pay.iqfit.app/subscribe/list-test");
  data = await res.json();

  popularPrices = [
    data.find((item) => item.name === "1 неделя" && item.isPopular === true)
      .price,
    data.find((item) => item.name === "1 месяц" && item.isPopular === true)
      .price,
    data.find((item) => item.name === "3 месяца" && item.isPopular === true)
      .price,
    data.find((item) => item.name === "навсегда" && item.isPopular === true)
      .price,
  ];

  prices = [
    data.find(
      (item) =>
        item.name === "1 неделя" &&
        item.isPopular === false &&
        item.isDiscount === false
    ).price,
    data.find(
      (item) =>
        item.name === "1 месяц" &&
        item.isPopular === false &&
        item.isDiscount === false
    ).price,
    data.find(
      (item) =>
        item.name === "3 месяца" &&
        item.isPopular === false &&
        item.isDiscount === false
    ).price,
    data.find(
      (item) =>
        item.name === "навсегда" &&
        item.isPopular === false &&
        item.isDiscount === false
    ).price,
  ];

  discountPrices = [
    data.find((item) => item.name === "1 неделя" && item.isDiscount === true)
      .price,
    data.find((item) => item.name === "1 месяц" && item.isDiscount === true)
      .price,
    data.find((item) => item.name === "3 месяца" && item.isDiscount === true)
      .price,
  ];

  offerPrices.forEach((item, i) => (item.innerHTML = popularPrices[i]));
  fullPrices.forEach((item, i) =>
    i === 3
      ? (item.innerHTML = prices[i].toLocaleString("ru-RU"))
      : (item.innerHTML = prices[i])
  );
  popupFullPrices.forEach((item, i) => (item.innerHTML = prices[i]));
  popupPrices.forEach((item, i) => (item.innerHTML = discountPrices[i]));
})();

let time = 120;
let minutes;
let seconds;
const minutesElement = document.querySelector(".minutes");
const secondsElement = document.querySelector(".seconds");
const colonElement = document.querySelector(".colon");
let clock = [minutesElement, secondsElement, colonElement];

const dialog = document.querySelector("dialog");

//Clock behavior
const timer = setInterval(() => {
  minutes = time >= 60 ? Math.floor(time / 60) : 0;
  seconds = time % 60;
  minutesElement.textContent = minutes < 10 ? "0" + minutes : minutes;
  secondsElement.textContent = seconds < 10 ? "0" + seconds : seconds;

  if (time > 0) {
    if (time <= 30) {
      clock.forEach((item) => {
        item.style.color = "red";
        item.style.opacity = parseInt(item.style.opacity) ? 0.3 : 1;
      });
    }
    time--;
  } else if (time <= 0 && time >= -1) {
    offerPrices.forEach((item, i) =>
      i === 3
        ? (item.innerHTML = prices[i].toLocaleString("ru-RU"))
        : (item.innerHTML = prices[i])
    );

    [...document.querySelectorAll(".item__price p:last-child")].forEach(
      (item) => (item.style.display = "none")
    );
    [...document.querySelectorAll(".item__sale")].forEach(
      (item) => (item.style.display = "none")
    );

    time--;
    secondsElement.textContent = "00";
    clock.forEach((item) => {
      item.style.opacity = 1;
    });
  } else if (time === -2) {
    clearInterval(timer);
    secondsElement.textContent = "00";
    dialog.showModal();
  }
}, 1000);

//Price change animation
function animate({ timing, draw, duration }) {
  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    let progress = timing(timeFraction);

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

function move() {
  animate({
    duration: 2000,
    timing(timeFraction) {
      return timeFraction;
    },
    draw: function (progress) {
      [...document.querySelectorAll(".item__price p:first-child")].forEach(
        (item) => (item.style.opacity = progress)
      );
    },
  });
}

setTimeout(move, 121000);

//Close dialog
function closeOnBackDropClick({ currentTarget, target }) {
  const dialog = currentTarget;
  const isClickedOnBackDrop = target === dialog;
  if (isClickedOnBackDrop) {
    dialog.close();
  }
}
dialog.addEventListener("click", closeOnBackDropClick);
document
  .querySelector(".close img")
  .addEventListener("click", () => dialog.close());

//Selected element
const offers = document.querySelectorAll(".item");
offers[0].style.backgroundColor = "rgba(1, 185, 197, 0.05)";
offers[0].style.borderColor = "#01b9c5";
offers[5].style.backgroundColor = "rgba(1, 185, 197, 0.05)";
offers[5].style.borderColor = "#01b9c5";

offers.forEach(function (el) {
  el.addEventListener("click", () => selectedOffer(el));
});

function selectedOffer(elem) {
  offers.forEach(function (el) {
    el.style.backgroundColor = "#ffffff";
    el.style.borderColor = "#d3d6dd";
  });
  elem.style.backgroundColor = "rgba(1, 185, 197, 0.05)";
  elem.style.borderColor = "#01b9c5";
}

//Radio buttons behavior
const radioButtons = document.querySelectorAll("input[type='radio']");

radioButtons.forEach(function (el) {
  el.addEventListener("click", () => radioChecked(el));
});

function radioChecked(elem) {
  radioButtons.forEach(function (el) {
    el.checked = false;
  });
  elem.checked = true;
}
