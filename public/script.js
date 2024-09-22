console.log("script ran!")
let expression = null;
let input = null;
let result = null;
let last_pressed = null;
let equal_pressed = false;
const result_box = document.getElementById("result-box");
const input_box = document.getElementById("input-box");

function validate_number(num) {
    if (!num) {
        return "0";
    }
    // ensure only one . exists in expression
    const parts = num.split(".");
    num = parts.length > 2 ? parts.slice(0, 2).join("."): num;

    // if text starts with "0", it must proceed with "."
    if (num.length > 1 && num.startsWith("0") && !(num[1] === ".")) {
        num = num.slice(1);
    }

    return num;
}

function show_expression() {
    equal_pressed = false;
    input_box.value = expression;
}

function show_result() {
    result = validate_number(result);
    result_box.value = result;
}

async function add() {
    if (expression === null) {
        input = validate_number(input);
        expression = `${input} + `;
    }

    else if (expression.includes("=")) {
        await calculate();
        expression = `${result} + `;
    } 

    else if (expression.endsWith("+ ")) {
        input = validate_number(input);
        expression = `${expression}${input}`;
        await calculate();
        expression = `${result} + `;
    } 

    show_expression();
    show_result();
    last_pressed = add;
}

async function subtract() {
    if (expression === null) {
        input = validate_number(input);
        expression = `${input} - `;
    }

    else if (expression.includes("=")) {
        await calculate();
        expression = `${result} - `;
    } 

    else if (expression.endsWith("- ")) {
        input = validate_number(input);
        expression = `${expression}${input}`;
        await calculate();
        expression = `${result} - `;
    } 

    show_expression();
    show_result();
    last_pressed = subtract;
}

async function multiply() {
    if (expression === null) {
        input = validate_number(input);
        expression = `${input} \u00D7 `;
    }

    else if (expression.includes("=")) {
        await calculate();
        expression = `${result} \u00D7 `;
    } 

    else if (expression.endsWith("\u00D7 ")) {
        input = validate_number(input);
        expression = `${expression}${input}`;
        await calculate();
        expression = `${result} \u00D7 `;
    } 

    show_expression();
    show_result();
    last_pressed = multiply;
}

async function divide() {
    if (expression === null) {
        input = validate_number(input);
        expression = `${input} \u00F7 `;
    }

    else if (expression.includes("=")) {
        await calculate();
        expression = `${result} \u00F7 `;
    } 

    else if (expression.endsWith("\u00F7 ")) {
        input = validate_number(input);
        expression = `${expression}${input}`;
        await calculate();
        expression = `${result} \u00F7 `;
    } 

    show_expression();
    show_result();
    last_pressed = divide;
}

async function modulus() {
    if (expression === null) {
        input = validate_number(input);
        expression = `${input} % `;
    }

    else if (expression.includes("=")) {
        await calculate();
        expression = `${result} % `;
    } 

    else if (expression.endsWith("% ")) {
        input = validate_number(input);
        expression = `${expression}${input}`;
        await calculate();
        expression = `${result} % `;
    } 

    show_expression();
    show_result();
    last_pressed = modulus;
}

async function equal() {
    if (last_pressed === null || last_pressed === equal) {
        return;
    }
    input = validate_number(input);
    expression = `${expression}${input}`;
    
    await calculate();
    
    expression = `${expression} = `;
    input = null;
    last_pressed = equal;
    console.log(expression);
    console.log(result);

    show_expression();
    show_result();
}


async function calculate() {
    try {
        const respond = await fetch(
            '/calculate', 
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'expression': expression}),
            }
        );
        const data = await respond.json();
        result = data.resulting_value;
    } catch(error) {
        result = `Error: ${error}`;
    }
}

function number(num) {
    // reset input when any non-numerical button is pressed.
    if (last_pressed != number &&
        last_pressed != decimal &&
        last_pressed != negate) {
        input = null;
    }
    if (last_pressed === equal){
        expression = null;
        result = null;
        input = null;
    }
    // if there's no input, use "0"
    if (input === null) {
        input = "0";
    }
    input = input + String(num);
    result = input;
    show_result();
    last_pressed = number;
}

function backspace() {
    // reset input when any non-numerical button is pressed.
    if (last_pressed != number && 
        last_pressed != decimal && 
        last_pressed != negate && 
        last_pressed != backspace) {
        input = null;
    }
    // if there's no input, use "0"
    if (input === null) {
        input = "0";
    }

    if (input.length > 0) {
        input = input.slice(0,-1);
    }
    result = input;
    show_result();
    last_pressed = backspace;
}

function clean() {
    expression = null;
    input = null;
    result = null;
    last_pressed = null;
    show_expression();
    show_result();
}

function decimal() {
    // reset input when any non-numerical button is pressed.
    if (last_pressed != number && last_pressed != decimal) {
        input = null;
    }
    if (input === null) {
        input = "0.";
    } else {
        input = String(input) + ".";
    }
    result = input;
    show_result();
    last_pressed = decimal;
}


function negate() {
    input = validate_number(input);
    if (input.startsWith('-')) {
        input = input.slice(1,);
    } else {
        input = `-${input}`;
    }
    result = input;
    show_result();
    last_pressed = negate;
}


function updateSizes() {    
    var width = window.innerWidth;
    var height = window.innerHeight;
    var minSize = Math.min(width, height);
    document.body.style.height = `${minSize}px`;
    document.body.style.width = `${minSize}px`;

    // document.querySelectorAll('button').forEach(but => {
    //     const width = but.offsetWidth;
    //     but.style.height = `${width}px`;
    // });
}

updateSizes();

window.addEventListener('resize', updateSizes);