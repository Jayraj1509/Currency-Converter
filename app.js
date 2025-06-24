const baseurl = "https://api.frankfurter.app/latest?from";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector("#swap-icon");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
  const img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

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
  setTimeout(() => {
    swapIcon.classList.remove("rotate");
  }, 400); 

  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

const updateExchangeRate = async () => {
  const amountInput = document.querySelector(".amount input");
  let amtval = amountInput.value;

  if (amtval === "" || amtval < 1) {
    amtval = 1;
    amountInput.value = "1";
  }

  const url = `${baseurl}=${fromCurr.value}&to=${toCurr.value}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rate = Object.values(data.rates)[0];
    const finalAmount = (amtval * rate).toFixed(2);

    msg.innerText = `${amtval} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rate.";
    console.error("Error fetching data:", error);
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
