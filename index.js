const display = document.getElementById("display");
const buttons = document.getElementById("buttons");

// Add event listener for keyboard input
document.addEventListener("keydown", handleKeyPress);

// Focus the display input when the page loads
window.addEventListener("load", function () {
  display.focus();

  // Set cursor position to end initially
  setCursorToEnd();
});

// Maintain focus on the display when buttons are clicked
document.addEventListener("click", function () {
  display.focus();
});

function handleKeyPress(event) {
  const key = event.key;

  // Allow arrow keys to navigate the cursor
  if (key === "ArrowLeft" || key === "ArrowRight") {
    return; // Let the default behavior happen for cursor movement
  }

  // Prevent default action for calculator keys
  if (/[\d+\-*/().=]|Enter|Backspace|Escape/.test(key)) {
    event.preventDefault();
  }

  // Numbers, operators, decimal point, and parentheses
  if (/[\d+\-*/().]/.test(key)) {
    insertAtCursor(key);
  }
  // Enter or = for calculation
  else if (key === "Enter" || key === "=") {
    calculate();
  }
  // Backspace for deleting the last character
  else if (key === "Backspace") {
    backspace();
  }
  // Escape or Delete for clearing the display
  else if (key === "Escape" || key === "Delete") {
    clearDisplay();
  }
}

function moveCursorLeft() {
  if (display.selectionStart > 0) {
    display.setSelectionRange(
      display.selectionStart - 1,
      display.selectionStart - 1
    );
  }
  display.focus();
}

function moveCursorRight() {
  if (display.selectionStart < display.value.length) {
    display.setSelectionRange(
      display.selectionStart + 1,
      display.selectionStart + 1
    );
  }
  display.focus();
}

function setCursorToEnd() {
  display.setSelectionRange(display.value.length, display.value.length);
}

function insertAtCursor(value) {
  const startPos = display.selectionStart;
  const endPos = display.selectionEnd;
  const currentValue = display.value;

  // Insert the value at the cursor position
  const newValue =
    currentValue.substring(0, startPos) +
    value +
    currentValue.substring(endPos);
  display.value = newValue;

  // Move cursor after the inserted value
  const newCursorPos = startPos + value.length;
  display.setSelectionRange(newCursorPos, newCursorPos);
}

function appendToDisplay(value) {
  insertAtCursor(value);
}

function clearDisplay() {
  display.value = "";
  display.focus();
}

function backspace() {
  const startPos = display.selectionStart;
  const endPos = display.selectionEnd;

  // If there's selected text, delete it
  if (startPos !== endPos) {
    insertAtCursor("");
  }
  // Otherwise delete the character before the cursor
  else if (startPos > 0) {
    const currentValue = display.value;
    display.value =
      currentValue.substring(0, startPos - 1) +
      currentValue.substring(startPos);
    display.setSelectionRange(startPos - 1, startPos - 1);
  }

  display.focus();
}

function calculate() {
  try {
    // Save the expression for potential error recovery
    const expression = display.value;

    // Using Function instead of eval for slightly better security
    // Still creates a function but with a more controlled scope
    const result = new Function("return " + expression)();

    // Format the result to handle long decimals
    if (Number.isFinite(result)) {
      // Limit to 10 decimal places and remove trailing zeros
      display.value = parseFloat(result.toFixed(10)).toString();
    } else {
      display.value = "Error";
    }
  } catch (error) {
    display.value = "Error";
  }

  // Set cursor to end after calculation
  setCursorToEnd();
  display.focus();
}
