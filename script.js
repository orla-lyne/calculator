(function () {
  const screen = document.getElementById("screen");
  if (!screen) return;

  const buttons = document.querySelectorAll(".button");
  let current = "";
  let justEvaluated = false;

  const OPERATORS = ["+", "-", "×", "÷"];

  function render() {
    screen.value = current === "" ? "0" : current;
  }

  // Strips strict-mode illegal leading zeros from operands (e.g., "1+05" -> "1+5")
  function sanitizeLeadingZeros(expr) {
    return expr.split(/([\+\-\×\÷])/).map(part => {
      if (OPERATORS.includes(part) || part === "") return part;
      if (/^0+\d/.test(part)) {
        return part.replace(/^0+/, '');
      }
      return part;
    }).join('');
  }

  // Runs expression calculations safely
  function calculate(expr) {
    try {
      const sanitizedWithNoZeros = sanitizeLeadingZeros(expr);
      const mathExpression = sanitizedWithNoZeros.replace(/÷/g, "/").replace(/×/g, "*");
      
      // Fixed: Character whitelist check using the correct regex anchor structure
      if (!/^[\d+\-*/.() ]+$/.test(mathExpression)) return "Error";
      
      const result = new Function('"use strict"; return (' + mathExpression + ')')();
      return Number.isFinite(result) ? String(result) : "Error";
    } catch {
      return "Error";
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      let val = (btn.textContent || "").trim();
      
      // Correctly extract the operation values mapped from FontAwesome icon classes
      const opsMap = { 
        "fa-divide": "÷", 
        "fa-xmark": "×", 
        "fa-minus": "-", 
        "fa-plus": "+", 
        "fa-equals": "=" 
      };
      
      const icon = btn.querySelector("i");
      if (icon) {
        for (const cls of icon.classList) {
          if (opsMap[cls]) { 
            val = opsMap[cls]; 
            break; 
          }
        }
      }

      if (val.toUpperCase() === "AC") {
        current = "";
        justEvaluated = false;
        render();
        return;
      }

      if (icon && icon.classList.contains("fa-delete-left")) {
        current = current.slice(0, -1);
        render();
        return;
      }

      if (icon && icon.classList.contains("fa-plus-minus")) {
        if (current && current !== "Error") {
          if (OPERATORS.some(op => current.includes(op))) {
            let res = calculate(current);
            current = res.startsWith("-") ? res.slice(1) : "-" + res;
          } else {
            current = current.startsWith("-") ? current.slice(1) : "-" + current;
          }
        }
        render();
        return;
      }

      if (icon && icon.classList.contains("fa-percent")) {
        if (current && current !== "Error") {
          let trimmed = current;
          while (trimmed.length && OPERATORS.includes(trimmed[trimmed.length - 1])) {
            trimmed = trimmed.slice(0, -1);
          }
          if (trimmed) {
            let res = calculate(trimmed);
            if (res !== "Error") {
              current = String(parseFloat(res) / 100);
            } else {
              current = "Error";
            }
          }
        }
        render();
        return;
      }

      if (!val) return;

      if (val === "=") {
        if (!current || current === "Error") { render(); return; }
        let trimmed = current;
        while (trimmed.length && OPERATORS.includes(trimmed[trimmed.length - 1])) {
          trimmed = trimmed.slice(0, -1);
        }
        if (!trimmed) { current = ""; render(); return; }
        current = calculate(trimmed);
        justEvaluated = true;
        render();
        return;
      }

      if (OPERATORS.includes(val)) {
        if (current === "" || current === "Error") {
          if (val === "-") { current = "-"; render(); }
          return;
        }
        if (justEvaluated) justEvaluated = false;

        const lastChar = current.slice(-1);
        if (OPERATORS.includes(lastChar)) {
          if (val === "-" && (lastChar === "×" || lastChar === "÷")) {
            current += val;
          } else {
            current = current.slice(0, -1) + val;
          }
          render();
          return;
        }
        if (lastChar === ".") {
          current = current.slice(0, -1) + val;
          render();
          return;
        }
        current += val;
        render();
        return;
      }

      if (justEvaluated && "0123456789.".includes(val)) {
        current = "";
        justEvaluated = false;
      } else if (justEvaluated) {
        justEvaluated = false;
      }

      if (val === ".") {
        const parts = current.split(/[\+\-\×\÷]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes(".")) return;
        if (current === "" || OPERATORS.includes(current.slice(-1))) {
          current += "0.";
          render();
          return;
        }
      }

      if (current === "0" && "0123456789".includes(val)) {
        current = val;
      } else {
        current += val;
      }
      render();
    });
  });

  render();
})();


