const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const display = document.getElementById("display");
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

const numberButtons = document.querySelectorAll("[data-number]");
const decimalButton = document.querySelector('[data-action="decimal"]');
const clearButton = document.querySelector('[data-action="clear"]');
const backspaceButton = document.querySelector('[data-action="backspace"]');
const signButton = document.querySelector('[data-action="sign"]');
const operatorButtons = document.querySelectorAll(".btn--operator");
const equalsButton = document.querySelector('[data-action="equals"]');

let currentValue = "0";
let isFinished = false;

// "theme"
themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';

    if (isDark) {
        body.removeAttribute('data-theme');
        themeToggle.textContent = 'Dark Mode';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = 'Light Mode';
    }
});

// "0-9"
numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        const number = button.dataset.number;
        if (isFinished) {
            currentValue = number;
            expressionDisplay.textContent = "";
            isFinished = false;
        } else if (currentValue === "0") {
            currentValue = number;
        } else {
            currentValue += number;
        }

        resultDisplay.textContent = currentValue;
    });
});


// "."
decimalButton.addEventListener("click", () => {
    if (isFinished) {
        currentValue = "0.";
        expressionDisplay.textContent = "";
        isFinished = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
        resultDisplay.textContent = currentValue;
    }
});


// "C"
clearButton.addEventListener("click", () => {
    currentValue = "0";
    expressionDisplay.textContent = "";
    resultDisplay.textContent = "0";
    isFinished = false;
});

// "←"
backspaceButton.addEventListener("click", () => {
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = "0";
    }

    resultDisplay.textContent = currentValue;
});


// "+", "-", "*", "÷"
operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (isFinished) isFinished = false;

        const symbol = button.textContent;
        const lastChar = currentValue.slice(-1);
        const operators = ["+", "-", "*", "÷"];

        if (operators.includes(lastChar)) {
            currentValue = currentValue.slice(0, -1) + symbol;
        } else {
            currentValue += symbol;
        }

        resultDisplay.textContent = currentValue;
    });
});

// "="
equalsButton.addEventListener("click", () => {
    const operators = ["+", "-", "*", "÷"]; // перевірка, чи є в поточному виразі оператор
    const hasOperator = operators.some(op => currentValue.includes(op));
    if (!hasOperator) return;

    const lastChar = currentValue.slice(-1); // перевірка, чи останній символ є оператором
    if (operators.includes(lastChar)) return;

    try {
        expressionDisplay.textContent = currentValue;
        let mathString = currentValue.replace(/÷/g, "/").replace(/--/g, "- -");

        let result = eval(mathString);

        if (!isFinite(result)) { // для перевірки на ділення на нуль та інші нечислові результати
            resultDisplay.textContent = "Error: Division by zero";
            currentValue = "0";
            expressionDisplay.textContent = "";
            return;
        }

        let formattedResult;
        if (result % 1 === 0) {
            formattedResult = result.toString();
        } else {
            formattedResult = result.toFixed(5).replace(/\.?0+$/, '');
        }
        resultDisplay.textContent = formattedResult;

        currentValue = formattedResult;
        isFinished = true;
    } catch (error) {
        resultDisplay.textContent = "Error";
        currentValue = "0";
    }
});

// "+/-"
signButton.addEventListener("click", () => {
    if (currentValue === "0") return;
    if (isFinished) {
        currentValue = currentValue.startsWith("-") ? currentValue.slice(1) : "-" + currentValue;
        resultDisplay.textContent = currentValue;
        return;
    }

    const operators = ["+", "*", "÷", "-"];
    let lastOpIndex = -1;

    for (let i = currentValue.length - 1; i >= 0; i--) {
        if (operators.includes(currentValue[i])) {
            if (currentValue[i] === "-") {
                if (i > 0 && /\d/.test(currentValue[i - 1])) {
                    lastOpIndex = i;
                    break;
                }
            } else {
                lastOpIndex = i;
                break;
            }
        }
    }

    if (lastOpIndex === -1) {
        currentValue = currentValue.startsWith("-") ? currentValue.slice(1) : "-" + currentValue;
    } else {
        let prefix = currentValue.slice(0, lastOpIndex + 1);
        let lastNumber = currentValue.slice(lastOpIndex + 1);

        if (lastNumber.startsWith("-")) {
            lastNumber = lastNumber.slice(1);
        } else if (lastNumber !== "") {
            lastNumber = "-" + lastNumber;
        }
        
        currentValue = prefix + lastNumber;
    }

    resultDisplay.textContent = currentValue;
});
