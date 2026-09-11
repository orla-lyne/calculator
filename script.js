(function () {
  const screen = document.getElementById("screen");
  if (!screen) { console.error("No #screen element found!"); return; }

  const buttons = document.querySelectorAll(".button");
  console.log("Attaching listeners to", buttons.length, "buttons");

  let current = "";
  let justEvaluated = false;

  const ops = {
    "fa-divide": "÷",
    "fa-xmark": "×",
    "fa-minus": "-",
    "fa-plus": "+",
    "fa-equals": "=",
  };

  const OPERATORS = "+-×÷";

  function render() {
    screen.value = current === "" ? "0" : current;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();

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
          current = current.startsWith("-") ? current.slice(1) : "-" + current;
        }
        render();
        return;
      }

      if (btn.querySelector(".fa-percent")) {
        const n = parseFloat(current);
        if (!isNaN(n)) current = (n / 100).toString();
        render();
        return;
      }

      let val = text;
      const icon = btn.querySelector("i");
      if (icon) {
        for (const cls of icon.classList) {
          if (ops[cls]) { val = ops[cls]; break; }
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
        try {
          const expr = trimmed.replace(/÷/g, "/").replace(/×/g, "*");
          if (/\/0(?!\d)/.test(expr)) {
            current = "Error";
          } else if (/^[\d+\-*/.() ]+$/.test(expr)) {
            current = Function('"use strict";return (' + expr + ")")() + "";
          } else {
            current = "Error";
          }
        } catch (e) {
          current = "Error";
        }
        justEvaluated = true;
        render();
        return;
      }

      if (OPERATORS.includes(val)) {
        if (current === "" || current === "Error") {
          if (val === "-") {
            current = "-";
            render();
          }
          return;
        }

        if (justEvaluated) {
          justEvaluated = false;
        }

        const lastChar = current[current.length - 1];

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
        const last = parts[parts.length - 1];
        if (last.includes(".")) return;
        if (last === "") {
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
  console.log("Calculator ready.");
})();