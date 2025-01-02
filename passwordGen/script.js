const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#digit");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = "/^[!@#$%^&*()_+-=[]{}'\\|,.<>/?]*$/";
console.log("elements Selected");

let password = "";
let passwordLen = 10;
let checkCount = 0;

handleSlider();
setIndicator("#ccc");

function handleCheckBoxChange() {
  console.log("Handle checkbox change is running");
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
      console.log(checkCount);
    }
  });

  if (checkCount > passwordLen) {
    passwordLen = checkCount;
    handleSlider();
  }

  console.log("Handle checkbox change is completed");
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

function handleSlider() {
  inputSlider.value = passwordLen;
  lengthDisplay.innerText = passwordLen;
}

function setIndicator(color) {
  console.log("Set indicator is running");

  indicator.style.backgroundColor = color;
  //indicator.style.boxShadow ='0px 0px 17px 1px ${color}';
}

function getRandomInt(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateNumber() {
  return getRandomInt(0, 9);
}

function generateUppercase() {
  return String.fromCharCode(getRandomInt(65, 91));
}

function generateLowercase() {
  return String.fromCharCode(getRandomInt(97, 123));
}

function generateSymbol() {
  return symbols.charAt(getRandomInt(0, symbols.length));
}

function calcStrength() {
  console.log("Strn cal fun is running");

  let hasUpper = false;
  let hasLower = false;
  let hasSymbol = false;
  let hasNum = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (symbolCheck.checked) hasSymbol = true;
  if (numberCheck.checked) hasNum = true;

  if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLen >= 8) {
    setIndicator("#00ff00");
  } 
  else if (
    (hasUpper || hasLower) &&
    (hasNum || hasSymbol) &&
    passwordLen >= 6
  ) {
    setIndicator("#ffff00");
  } 
  else {
    setIndicator("#ff0000");
  }
  console.log("Strn cal fun is completed");
}

function shufflePassword(array) {
  console.log("shuffle array fun is running");

  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i inclusive
    let j = Math.floor(Math.random() * (i + 1));

    // Swap arr[i] with the element
    // at random index
    [array[i], array[j]] = [array[j], array[i]];
  }

  let str = "";
  array.forEach((s) => {
    str += s;
  });
  console.log("Shuffle array fun is complted");

  return str;
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }

  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordLen = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  if (checkCount == 0) {
    return;
  }

  if (checkCount > passwordLen) {
    passwordLen = checkCount;
    handleSlider();
  }
  console.log("Starting the process...");
  password = "";
  let funarr = [];

  if (uppercaseCheck.checked) {
    funarr.push(generateUppercase);
  }
  if (lowercaseCheck.checked) {
    funarr.push(generateLowercase);
  }
  if (symbolCheck.checked) {
    funarr.push(generateSymbol);
  }
  if (numberCheck.checked) {
    funarr.push(generateNumber);
  }

  console.log("Doing the mandatory part...");
  for (let i = 0; i < funarr.length; i++) {
    password += funarr[i]();
  }

  console.log("Doing the remaining part...");

  for (let i = 0; i < passwordLen - funarr.length; i++) {
    let randIndex = getRandomInt(0, funarr.length);
    password += funarr[randIndex]();
  }

  console.log("Shuffling...");

  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;
  console.log("Calc the strength");
  calcStrength();
});
