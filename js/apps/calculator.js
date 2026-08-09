const calcButtonValues = [
  "AC", "+/-", "%", "÷",
  "7", "8", "9", "×",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", ".", "="
];

const calcRightSymbols = ["÷", "×", "-", "+", "="];
const calcTopSymbols = ["AC", "+/-", "%"];

function getCalculatorHTML() {
  return `
    <div class="calc-container">
      <div class="calc-display-wrapper">
        <span class="calc-operator-indicator" id="calc-op-indicator"></span>
        <input type="text" class="calc-display" id="calc-display" readonly value="0" />
      </div>
      <div class="calc-buttons-grid" id="calc-grid"></div>
    </div>
  `;
}

function initCalculatorApp(winElement) {
  const display = winElement.querySelector('.calc-display');
  const opIndicator = winElement.querySelector('#calc-op-indicator');
  const buttonsGrid = winElement.querySelector('.calc-buttons-grid');

  if (!display || !buttonsGrid) return;

  let previousValue = null;
  let currentOperator = null;
  let shouldResetDisplay = false;

  function clearAll() {
    previousValue = null;
    currentOperator = null;
    shouldResetDisplay = false;
    display.value = "0";
    opIndicator.textContent = "";
  }

  function formatOutput(numStr) {
    if (numStr === "Error" || numStr === "NaN") return "Error";
    const num = Number(numStr);
    if (isNaN(num)) return "Error";
    // Limit total digits to fit display comfortably
    if (numStr.length > 12) {
      return num.toPrecision(8).toString();
    }
    return numStr;
  }

  calcButtonValues.forEach((value) => {
    const button = document.createElement("button");
    button.className = "calc-btn";
    button.innerText = value;

    // Span "0" button across 2 grid columns
    if (value === "0") {
      button.classList.add("calc-btn-zero");
    }

    // Color button types
    if (calcRightSymbols.includes(value)) {
      button.classList.add("btn-operator");
    } else if (calcTopSymbols.includes(value)) {
      button.classList.add("btn-function");
    } else {
      button.classList.add("btn-number");
    }

    button.addEventListener("click", () => {
      // 1. OPERATOR BUTTONS (÷, ×, -, +, =)
      if (calcRightSymbols.includes(value)) {
        if (value === "=") {
          if (previousValue !== null && currentOperator !== null) {
            const numA = Number(previousValue);
            const numB = Number(display.value);
            let result = 0;

            if (currentOperator === "÷") {
              result = numB !== 0 ? numA / numB : "Error";
            } else if (currentOperator === "×") {
              result = numA * numB;
            } else if (currentOperator === "-") {
              result = numA - numB;
            } else if (currentOperator === "+") {
              result = numA + numB;
            }

            display.value = formatOutput(result.toString());
            previousValue = null;
            currentOperator = null;
            opIndicator.textContent = "";
            shouldResetDisplay = true;
          }
        } else {
          // Chain continuous calculations if pressing operators repeatedly
          if (previousValue !== null && currentOperator !== null && !shouldResetDisplay) {
            const numA = Number(previousValue);
            const numB = Number(display.value);
            let interimResult = numA;

            if (currentOperator === "÷") interimResult = numB !== 0 ? numA / numB : "Error";
            else if (currentOperator === "×") interimResult = numA * numB;
            else if (currentOperator === "-") interimResult = numA - numB;
            else if (currentOperator === "+") interimResult = numA + numB;

            display.value = formatOutput(interimResult.toString());
          }

          previousValue = display.value;
          currentOperator = value;
          opIndicator.textContent = value;
          shouldResetDisplay = true;
        }
      } 
      // 2. TOP FUNCTION BUTTONS (AC, +/-, %)
      else if (calcTopSymbols.includes(value)) {
        if (value === "AC") {
          clearAll();
        } else if (value === "+/-") {
          if (display.value !== "0" && display.value !== "Error") {
            display.value = display.value.startsWith("-") 
              ? display.value.slice(1) 
              : "-" + display.value;
          }
        } else if (value === "%") {
          if (display.value !== "Error" && display.value !== "") {
            display.value = (Number(display.value) / 100).toString();
          }
        }
      } 
      // 3. DIGITS AND DECIMAL (.)
      else {
        if (shouldResetDisplay) {
          display.value = value === "." ? "0." : value;
          shouldResetDisplay = false;
        } else {
          if (value === ".") {
            if (!display.value.includes(".")) {
              display.value += ".";
            }
          } else if (display.value === "0") {
            display.value = value;
          } else {
            display.value += value;
          }
        }
      }
    });

    buttonsGrid.appendChild(button);
  });
}