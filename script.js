const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".button");
const iconToOperator = {
  "fa-divide": "÷",
  "fa-xmark": "x",
  "fa-minus": "-",
  "fa-plus": "+",
  "fa-equals": "=",
  "fa-percent": "%",
};

let currentInput = "";
let lastResult = "";
let resetNext = false;

function updateScreen() {
  screen.value = currentInput || "0";
}


