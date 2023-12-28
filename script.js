let expression = '0';
const DIGITS_AFTER_POINT = 5;
const DIVIDE_BY_ZERO_MESSAGE = 'bruh';
// Flag used to clear the display upon digit or point insertion if a result was being displayed
let displayingResult = false;

const operations = {
    '+': (a, b) => round(a + b),
    '−': (a, b) => round(a - b),
    '×': (a, b) => round(a * b),
    '÷': (a, b) => b == 0? DIVIDE_BY_ZERO_MESSAGE : round(a / b),
}
function round(result) { return +(result.toFixed(5)) }

function calculate(operatorPressed) {
    let [firstOperand, operator, secondOperand] = expression.split(' ');

    expression = '' + operations[operator](+firstOperand, +secondOperand);

    if (operatorPressed && expression !== DIVIDE_BY_ZERO_MESSAGE)
        expression += ` ${operatorPressed} `;
}

function insertDigit(digit) {
    checkClear();

    if (expression === '0' || expression.endsWith(' 0'))
        expression = expression.slice(0, -1) + digit;
    else
        expression += digit;
}

function insertOperator(operator) {
    displayingResult = false;
    checkClear();

    // An operator is set but no second operand
    if (expression.endsWith(' '))
        // Change the operator
        expression = expression.slice(0, -2) + operator + ' ';
    // Both operator and second operand are set
    else if (expression.includes(' '))
        calculate(operator);
    else
        expression += ` ${operator} `;
}

function insertPoint() {
    checkClear();

    // Last item inserted is an operator
    if (expression.endsWith(' '))
        expression += '0.';
    // The current number doesn't have a '.' yet
    else if (!expression.split(' ').pop().includes('.'))
       expression += '.'; 
}

function equals() {
    // Last item inserted is not an operator and two operands have been inserted
    if (!expression.endsWith(' ') && expression.includes(' ') && expression !== DIVIDE_BY_ZERO_MESSAGE) {
        calculate();
        displayingResult = true;
    }
}

function backspace() {
    displayingResult = false;

    if (expression === DIVIDE_BY_ZERO_MESSAGE || expression.length === 1)
        clear();
    // Last item inserted is an operator
    else if (expression.endsWith(' '))
        expression = expression.slice(0, -3);
    // Last item inserted is a digit
    else
        expression = expression.slice(0, -1);
}

function clear() {
    expression = '0';
    displayingResult = false;
}

function checkClear() {
    if (displayingResult || expression === DIVIDE_BY_ZERO_MESSAGE)
        clear();
}

const display = document.querySelector('#display');
function updateDisplay() { display.textContent = expression; }

const calculator = document.querySelector('#calculator');
calculator.addEventListener('click', (e) => {
    switch (e.target.className) {
        case 'digit':
            insertDigit(e.target.value);
            break;
        case 'operator':
            insertOperator(e.target.value);
            break;
        case 'equals':
            equals();
            break;
        case 'point':
            insertPoint();
            break;
        case 'backspace':
            backspace();
            break;
        case 'clear':
            clear();
    }

    updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;

    // key === '0' to avoid entering this by pressing the space button (key === ' ')
    if (key === '0' || key > '0' && key <= '9')
        insertDigit(key);
    else if (['+', '-', '*', '/'].includes(key))
        insertOperator(({ '+': '+', '-': '−', '*': '×', '/': '÷' })[key]);
    else if (key === '=' || key === 'Enter')
        equals();
    else if (key === '.')
        insertPoint();
    else if (key === 'Backspace')
        backspace();
    else if (key === 'Escape' || key === 'c')
        clear();

    updateDisplay();
});