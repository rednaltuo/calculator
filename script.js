const DIVIDE_BY_ZERO_MESSAGE = 'bruh';

const calculator = {
    expression: '0',
    // Used to clear the display upon digit or point insertion if a result was being displayed
    displayingResult: false,

    html: document.querySelector('#calculator'),
    display: document.querySelector('#display'),

    '+': (a, b) => a + b,
    '−': (a, b) => a - b,
    '×': (a, b) => +((a * b).toFixed(5)),
    '÷': (a, b) => b == 0? DIVIDE_BY_ZERO_MESSAGE : +((a / b).toFixed(5)),

    updateDisplay() { this.display.textContent = this.expression },

    calculate(operator) {
        const parts = this.expression.split(' ');
        this.expression = '' + this[parts[1]](+parts[0], +parts[2]);
        
        if (operator && this.expression !== DIVIDE_BY_ZERO_MESSAGE)
            this.expression += ` ${operator} `;
    },

    insertDigit(digit) {
        this.checkClear();
        const expression = this.expression;
    
        if (expression === '0' || expression.endsWith(' 0')) 
            this.expression = expression.slice(0, expression.length-1) + digit;
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
            this.expression = expression.slice(0, expression.length-2) + operator + ' ';
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
        if (expression.length === 1 || expression.endsWith(' ') || !expression.split(' ').pop().includes('.'))
            this.expression += '.';
    },

    equals() {
        const expression = this.expression;
        // Last item inserted is not an operator and two operands have been inserted
        if (!expression.endsWith(' ') && expression.includes(' ') && expression !== DIVIDE_BY_ZERO_MESSAGE) {
            this.calculate();
            this.displayingResult = true;
        }
    },

    backspace() {
        const expression = this.expression;
        this.displayingResult = false;
    
        if (expression === DIVIDE_BY_ZERO_MESSAGE || expression.length === 1)
            this.clear();
        // Last item inserted is an operator
        else if (expression.endsWith(' '))
            this.expression = expression.slice(0, expression.length-3);
        // Last item inserted is a digit
        else
            this.expression = expression.slice(0, expression.length-1);
    },

    clear() {
        this.expression = '0';
        this.displayingResult = false;
    },

    checkClear() {
        if (this.displayingResult || this.expression === DIVIDE_BY_ZERO_MESSAGE) 
            this.clear();
    }
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