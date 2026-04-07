const display = document.getElementById("display");

const numberButtons = document.querySelectorAll("[data-number]");
const decimalButton = document.querySelector('[data-action="decimal"]');
const clearButton = document.querySelector('[data-action="clear"]');
const backspaceButton = document.querySelector('[data-action="backspace"]');

let currentValue = "0";

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
