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

  function sanitizeLeadingZeros(expr) {
    return expr.replace(/\b0+(\d+)/g, '\$1');
  }

  function calculate(expr) {
    try {
      const sanitized = sanitizeLeadingZeros(expr.replace(/÷/g, "/").replace(/×/g, "*"));
      if (!/^[\d+\-*/.() ]+\$/.test(sanitized)) return "Error";
      
      const result = new Function(`"use strict"; return (${sanitized})`)();
      return Number.isFinite(result) ? String(result) : "Error";
    } catch {
      return "Error";
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = (btn.textContent || "").trim();
      
      if (text.toUpperCase() === "AC") {
        current = "";
        justEvaluated = false;
        render();
        return;
      }

      if (btn.querySelector(".fa-delete-left")) {
        current = current.slice(0, -1);
        render();
        return;
      }

      if (btn.querySelector(".fa-plus-minus")) {
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

      if (btn.querySelector(".fa-percent")) {
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

      let val = text;
      const opsMap = { "fa-divide": "÷", "fa-xmark": "×", "fa-minus": "-", "fa-plus": "+", "fa-equals": "=" };
      const icon = btn.querySelector("i");
      if (icon) {
        for (const cls of icon.classList) {
          if (opsMap[cls]) { val = opsMap[cls]; break; }
        }
      }

      if (!val || val.toUpperCase() === "AC") return;

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


