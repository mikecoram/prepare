const ValueGenerator = require('../value-generator').ValueGenerator;

exports.info = {
    name: 'Operators',
    difficulty: 0
};

exports.entries = [
    {
        input: 'print(3 + 5)',
        output: '7'
    },
    {
        inputTemplate: 'print(${1} + ${2})',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10),
            new ValueGenerator('integer', 1, 10)
        ],
        output: (a, b) => {
            return a + b;
        },
        difficulty: 0
    },
    {
        inputTemplate: 'print(${1} + ${2} + ${3})',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10),
            new ValueGenerator('integer', 1, 10),
            new ValueGenerator('integer', 1, 10),            
        ],
        output: (a, b, c) => {
            return a + b + c;
        },
        difficulty: 0
    },
    {
        inputTemplate: 'print(${1} - ${2})',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10),
            new ValueGenerator('integer', 1, 10),
        ],
        output: (a, b) => {
            return a - b;
        },
        difficulty: 0
    },
    {
        input: 'print(3 * 2)',
        output: '6'
    },
    {
        inputTemplate: 'print(${1} * ${2})',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10),
            new ValueGenerator('integer', 1, 10),
        ],
        output: (a, b) => {
            return a * b;
        },
        difficulty: 0
    },
    {
        input: 'print(4 / 2)',
        output: '2'
    },
    {
        inputTemplate: 'print(${1} / ${2})',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10),
            new ValueGenerator('integer', 1, 10)
        ],
        output: (a, b) => {
            return a / b;
        },
        difficulty: 0
    }
];