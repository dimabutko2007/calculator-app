const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const display = document.getElementById("display");

const numberButtons = document.querySelectorAll("[data-number]");
const decimalButton = document.querySelector('[data-action="decimal"]');
const clearButton = document.querySelector('[data-action="clear"]');
const backspaceButton = document.querySelector('[data-action="backspace"]');
const signButton = document.querySelector('[data-action="sign"]');

let currentValue = "0";

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
        if (currentValue === "0") {
            currentValue = number;
        } else {
            currentValue += number;
        }

        display.textContent = currentValue;
    });
});

// "."
decimalButton.addEventListener("click", () => {
    if (!currentValue.includes(".")) {
        currentValue += ".";
        display.textContent = currentValue;
    }
});

// "C"
clearButton.addEventListener("click", () => {
    currentValue = "0";
    display.textContent = currentValue;
});

// "←"
backspaceButton.addEventListener("click", () => {
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = "0";
    }

    display.textContent = currentValue;
});

// "+/-"
signButton.addEventListener("click", () => {
    if (currentValue === "0") return;

    if (currentValue.startsWith("-")) {
        currentValue = currentValue.slice(1);
    } else {
        currentValue = "-" + currentValue;
    }

    display.textContent = currentValue;
});
