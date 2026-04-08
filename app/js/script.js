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
const factorialButton = document.querySelector('[data-action="factorial"]');
const percentButton = document.querySelector('[data-action="percent"]');
const sqrtButton = document.querySelector('[data-action="sqrt"]');
const powerButton = document.querySelector('[data-action="power"]');

let currentValue = "0";
let isFinished = false;

const OPERATORS = ["+", "-", "*", "÷"];

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
    if (isFinished) {
        currentValue = "0";
        isFinished = false;
        resultDisplay.textContent = currentValue;
        return;
    }

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

        if (OPERATORS.includes(lastChar)) {
            currentValue = currentValue.slice(0, -1) + symbol;
        } else {
            currentValue += symbol;
        }

        resultDisplay.textContent = currentValue;
    });
});

// "="
equalsButton.addEventListener("click", () => {
    const hasOperator = OPERATORS.some(op => currentValue.includes(op));
    if (!hasOperator) return;

    const lastChar = currentValue.slice(-1);
    if (OPERATORS.includes(lastChar)) return;

    try {
        expressionDisplay.textContent = currentValue;

        let tokens = tokenize(currentValue);
        let result = calculate(tokens);

        if (!isFinite(result)) {
            resultDisplay.textContent = "Error";
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

function tokenize(expression) {
    let tokens = [];
    let number = "";

    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];

        if ("0123456789.".includes(char)) {
            number += char;
        } else if (char === "-" && (i === 0 || "+-*÷".includes(expression[i - 1]))) {
            number += char;
        } else {
            if (number !== "") {
                tokens.push(parseFloat(number));
                number = "";
            }
            tokens.push(char);
        }
    }

    if (number !== "") {
        tokens.push(parseFloat(number));
    }

    return tokens;
}

function calculate(tokens) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "*" || tokens[i] === "÷") {
            let left = tokens[i - 1];
            let right = tokens[i + 1];
            let result;

            if (tokens[i] === "*") {
                result = left * right;
            } else {
                result = left / right;
            }

            tokens.splice(i - 1, 3, result);
            i -= 1;
        }
    }

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "+" || tokens[i] === "-") {
            let left = tokens[i - 1];
            let right = tokens[i + 1];
            let result;

            if (tokens[i] === "+") {
                result = left + right;
            } else {
                result = left - right;
            }

            tokens.splice(i - 1, 3, result);
            i -= 1;
        }
    }

    return tokens[0];
}

// "+/-"
signButton.addEventListener("click", () => {
    if (currentValue === "0") return;
    if (isFinished) {
        currentValue = currentValue.startsWith("-") ? currentValue.slice(1) : "-" + currentValue;
        resultDisplay.textContent = currentValue;
        return;
    }

    let lastOpIndex = -1;

    for (let i = currentValue.length - 1; i >= 0; i--) {
        if (OPERATORS.includes(currentValue[i])) {
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
