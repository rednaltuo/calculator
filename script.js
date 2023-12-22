const calculator = {
    expression: '0',
    DIGITS_AFTER_POINT: 5,
    DIVIDE_BY_ZERO_MESSAGE: 'bruh',
    // Flag used to clear the display upon digit or point insertion if a result was being displayed
    displayingResult: false,

    html: document.querySelector('#calculator'),
    display: document.querySelector('#display'),

    '+': (a, b) => a + b,
    '−': (a, b) => a - b,
    '×': (a, b) => a * b,
    '÷': (a, b) => a / b,

    updateDisplay() { this.display.textContent = this.expression },

    calculate(operatorPressed) {
        const [firstOperand, operator, secondOperand] = this.expression.split(' ');
        const result = this[operator](+firstOperand, +secondOperand);

        if (result === Infinity) {
            this.expression = this.DIVIDE_BY_ZERO_MESSAGE;
            return;
        }

        this.expression = '' + +result.toFixed(this.DIGITS_AFTER_POINT);

        if (operatorPressed)
            this.expression += ` ${operatorPressed} `;
    },

    insertDigit(digit) {
        this.checkClear();
        const expression = this.expression;
    
        if (expression === '0' || expression.endsWith(' 0')) 
            this.expression = expression.slice(0, -1) + digit;
        else 
            this.expression += digit;
    },

    insertOperator(operator) {
        this.displayingResult = false;
        this.checkClear();
        const expression = this.expression;
        
        // An operator is set but no second operand
        if (expression.endsWith(' '))
            // Change the operator
            this.expression = expression.slice(0, -2) + operator + ' ';
        // Both operator and second operand are set
        else if (expression.includes(' '))
            this.calculate(operator);
        else
            this.expression += ` ${operator} `;
    },

    insertPoint() {
        this.checkClear();
        const expression = this.expression;
    
        // Last item inserted is an operator or the current number doesn't have a '.' yet
        if (expression.endsWith(' ') || !expression.split(' ').pop().includes('.'))
            this.expression += '.';
    },

    equals() {
        const expression = this.expression;
        // Last item inserted is not an operator and two operands have been inserted
        if (!expression.endsWith(' ') && expression.includes(' ') 
                && expression !== this.DIVIDE_BY_ZERO_MESSAGE) {
            this.calculate();
            this.displayingResult = true;
        }
    },

    backspace() {
        const expression = this.expression;
        this.displayingResult = false;
    
        if (expression === this.DIVIDE_BY_ZERO_MESSAGE || expression.length === 1)
            this.clear();
        // Last item inserted is an operator
        else if (expression.endsWith(' '))
            this.expression = expression.slice(0, -3);
        // Last item inserted is a digit
        else
            this.expression = expression.slice(0, -1);
    },

    clear() {
        this.expression = '0';
        this.displayingResult = false;
    },

    checkClear() {
        if (this.displayingResult || this.expression === this.DIVIDE_BY_ZERO_MESSAGE) 
            this.clear();
    },
}


calculator.html.addEventListener('click', (e) => {
    switch(e.target.className) {
    case 'digit':
        calculator.insertDigit(e.target.value);
        break;
    case 'operator':
        calculator.insertOperator(e.target.value);
        break;
    case 'equals':
        calculator.equals();
        break;
    case 'point':
        calculator.insertPoint();
        break;
    case 'backspace':
        calculator.backspace();
        break;
    case 'clear':
        calculator.clear();
    }

    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;

    // key === '0' to avoid entering this by pressing the space button (key === ' ')
    if (key === '0' || key > '0' && key <= '9')
        calculator.insertDigit(key);
    else if (['+', '-', '*', '/'].includes(key))
        calculator.insertOperator(({'+': '+', '-': '−', '*': '×', '/': '÷'})[key]);
    else if (key === '=' || key === 'Enter')
        calculator.equals();
    else if (key === '.')
        calculator.insertPoint();
    else if (key === 'Backspace')
        calculator.backspace();
    else if (key === 'Escape' || key === 'c')
        calculator.clear();

    calculator.updateDisplay();
});