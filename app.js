const baseurl = "https://api.frankfurter.app/latest?from";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

const msg = document.querySelector(".msg");

const swapIcon = document.querySelector("#swap-icon");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

fromCurr.addEventListener("change", () => {
  if (fromCurr.value === toCurr.value) {
    for (let option of toCurr.options) {
      if (option.value !== fromCurr.value) {
        toCurr.value = option.value;
        updateFlag(toCurr);
        break;
      }
    }
  }
  updateFlag(fromCurr);
  updateExchangeRate();
});

toCurr.addEventListener("change", () => {
  if (toCurr.value === fromCurr.value) {
    for (let option of fromCurr.options) {
      if (option.value !== toCurr.value) {
        fromCurr.value = option.value;
        updateFlag(fromCurr);
        break;
      }
    }
  }
  updateFlag(toCurr);
  updateExchangeRate();
});

swapIcon.addEventListener("click", () => {
  const temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  swapIcon.classList.add("rotate");
  setTimeout(() => swapIcon.classList.remove("rotate"), 500);

  updateFlag(fromCurr);
  updateFlag(toCurr);

  updateExchangeRate();
});

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtval = amount.value;
  if (amtval === "" || amtval < 1) {
    amtval = 1;
    amount.value = "1";
  }

  const url = `${baseurl}=${fromCurr.value}&to=${toCurr.value}`;
  let response = await fetch(url);
  let data = await response.json();
  let rate = Object.values(data.rates)[0];

  let finalAmount = amtval * rate;
  msg.innerText = `${amtval} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
