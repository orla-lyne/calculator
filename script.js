const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".button");

const iconToOperator = {
  "fa-divide": "÷",
  "fa-xmark": "x",
  "fa-minus": "-",
  "fa-plus": "+",
  "fa-equals": "=",
};

let currentInput = "";
let lastResult = "";
let resetNext = false;

function updateScreen() {
  screen.value = currentInput || "0";
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const rawText = button.textContent.trim();

    if (rawText.toUpperCase() === "AC") {
      currentInput = "";
      lastResult = "";
      resetNext = false;
      updateScreen();
      return;
    }

    let value = rawText;

    if (button.querySelector(".fa-delete-left")) {
      if (resetNext) {
        currentInput = "";
        resetNext = false;
      } else if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
      }
      updateScreen();
      return;
    }

    if (button.querySelector(".fa-plus-minus")) {
      if (currentInput && currentInput !== "Error") {
        if (currentInput.startsWith("-")) {
          currentInput = currentInput.slice(1);
        } else {
          currentInput = "-" + currentInput;
        }
      }
      updateScreen();
      return;
    }

    if (button.querySelector(".fa-percent")) {
      if (currentInput && currentInput !== "Error") {
        const num = parseFloat(currentInput);
        if (!isNaN(num)) currentInput = (num / 100).toString();
      }
      updateScreen();
      return;
    }
    const icon = button.querySelector("i");
    if (icon) {
      const match = Array.from(icon.classList).find((c) => iconToOperator[c]);
      if (match) value = iconToOperator[match];
    }

    if (!value || value.toUpperCase() === "AC") return;

    if (value === "=") {
      if (!currentInput || currentInput === "Error") {
        updateScreen();
        return;
      }
      try {
        const expression = currentInput.replace(/÷/g, "/").replace(/x/g, "*");
        if (/\/0(?!\d)/.test(expression)) {
          currentInput = "Error";
          resetNext = true;
          updateScreen();
          return;
        }
        if (/^[\d+\-*/.() ]+$/.test(expression)) {
          const result = Function('"use strict";return (' + expression + ")")();
          currentInput = result.toString();
          lastResult = currentInput;
          resetNext = true;
        } else {
          currentInput = "Error";
        }
      } catch {
        currentInput = "Error";
      }
      updateScreen();
      return;
    }

    if (resetNext && "0123456789.".includes(value)) {
      currentInput = "";
      resetNext = false;
    }
    if (resetNext && "+-×÷".includes(value)) {
      resetNext = false;
    }

    if (value === ".") {
      const parts = currentInput.split(/[\+\-\x\÷]/);
      const last = parts[parts.length - 1];
      if (last.includes(".")) return;
      if (last === "") {
        currentInput += "0.";
        updateScreen();
        return;
      }
    }

    if (currentInput === "0" && "0123456789".includes(value)) {
      currentInput = value;
    } else {
      currentInput += value;
    }

    updateScreen();
  });
});

updateScreen();