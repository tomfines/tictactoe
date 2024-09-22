const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post(
    '/calculate',
    (req, res) => {
        const expression = req.body.expression;
        console.log(`expression is being calcualted on the server:`, expression);
        const calculated_value = solve(expression);
        res.json({resulting_value: calculated_value});
    }
);


app.get(
    '/',
    (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
    }
)

app.listen(
    port,
    () => {
        console.log(`Server running at http://localhost:${port}`);
    }
);


function solve(formula) {
    formula = formula.split("=")[0];
    formula = formula.replace("\u00F7", "/");
    formula = formula.replace("\u00D7", "*");
    return String(eval(formula));
}
