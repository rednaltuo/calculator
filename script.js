const calculator = {
    expression: '0',
    // Flag used to clear the display upon digit or point insertion if a result was being displayed
    displayingResult: false,
    DIVIDE_BY_ZERO_MESSAGE: 'bruh',

    html: document.querySelector('#calculator'),
    display: document.querySelector('#display'),

    '+'(a, b) { return this.round(a + b) },
    '−'(a, b) { return this.round(a - b) },
    '×'(a, b) { return this.round(a * b) },
    '÷'(a, b) { return b == 0? this.DIVIDE_BY_ZERO_MESSAGE : this.round(a / b) },

    round: num => +(num).toFixed(5),

    updateDisplay() { this.display.textContent = this.expression },

    calculate(operator) {
        // part[0]: first operand | part[1]: operator | part[2]: second operand
        const parts = this.expression.split(' ');
        this.expression = '' + this[parts[1]](+parts[0], +parts[2]);
        
        if (operator && this.expression !== this.DIVIDE_BY_ZERO_MESSAGE)
            this.expression += ` ${operator} `;
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
        if (!expression.endsWith(' ') && expression.includes(' ') && expression !== this.DIVIDE_BY_ZERO_MESSAGE) {
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

    if (key >= 0 && key <= 9)
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