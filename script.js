const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".button");
const iconToOperator = {
  "fa-divide": "÷",
  "fa-xmark": "×",
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




buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let value = button.textContent.trim();

    
    const icon = button.querySelector("i");
    if (icon) {
      const iconClass = Array.from(icon.classList).find((c) => c.startsWith("fa-") && c !== "fa-solid");
      if (iconToOperator[icon.classList[1]]) {
        value = iconToOperator[icon.classList[1]];
      }
    }

    
    if (button.querySelector(".fa-delete-left")) {
      
      if (resetNext) {
        currentInput = "";
        resetNext = false;
      } else {
        currentInput = currentInput.slice(0, -1);
      }
      updateScreen();
      return;
    }  
    if (button.querySelector(".fa-plus-minus")){
      if(currentInput) {
        if(currentInput.startsWith("-")) {
          currentInput= currentInput.slice(1)
        } else {
          currentInput= "-" + currentInput
        }
      }
      updateScreen();
      return;
    } 
    if (button.querySelector(".fa-percent")) {
      if(currentInput) {
        try {
          currentInput=parseFloat(currentInput/100).toString();
        } catch {
          currentInput= "error"
          
        }
      }
      updateScreen();
      return;
    }

    if (value === "=") {
      try {
        let expression = currentInput
          .replace(/÷/g, "/")
          .replace(/×/g, "*");
        if (/^[\d+\-*/.() ]+$/.test(expression)) {
          let result = Function('"use strict";return (' + expression + ")")();
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
      const parts = currentInput.split(/[\+\-\×\÷]/);
      if (parts[parts.length - 1].includes(".")) return;
    }

    currentInput += value;
    updateScreen();
  });
});

updateScreen();
