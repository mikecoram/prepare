const ValueGenerator = require('../value-generator').ValueGenerator;

exports.info = {
    name: 'Variable assignment',
    difficulty: 0
};

exports.entries = [
    {
        input: 'let x = 5\nprint(x)',
        output: '5',
        difficulty: 0
    },
    {
        inputTemplate: 'let x = ${1}\nprint(x)',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10)
        ],
        output: (a) => {
            return a;
        },
        difficulty: 0
    },
    {
        inputTemplate: 'let x = ${1}\nlet y = x\nprint(y)',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10)
        ],
        output: (a) => {
            return a;
        },
        difficulty: 20
    },
    {
        inputTemplate: 'let x = ${1}\nlet y = x\nprint(x)',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10)
        ],
        output: (a) => {
            return a;
        },
        difficulty: 40
    },
    {
        inputTemplate: 'let x = ${1}\nlet y = x + ${2}\nprint(y)',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10),
            new ValueGenerator('integer', 1, 10)
        ],
        output: (a, b) => {
            return a + b;
        },
        difficulty: 40
    },
    {
        inputTemplate: 'let x = ${1} * ${2}\nlet y = x * ${3}\nprint(y)',
        valueGenerators: [
            new ValueGenerator('integer', 1, 7),
            new ValueGenerator('integer', 1, 4),
            new ValueGenerator('integer', 1, 4),
        ],
        output: (a, b, c) => {
            return a * b * c;
        },
        difficulty: 50
    },
    {
        input: 'let x = 7\nlet x = 1\nprint(x)',
        output: '1',
        difficulty: 60
    },
    {
        inputTemplate: 'let x = ${1}\nlet x = ${2}\nprint(x)',
        valueGenerators: [
            new ValueGenerator('integer', 1, 6),
            new ValueGenerator('integer', 6, 10),
        ],
        output: (a, b) => {
            return b;
        },
        difficulty: 60
    },
    {
        input: 'let x = 5\nlet x = x + 3\nprint(x)',
        output: '8'
    },
    {
        inputTemplate: 'let x = ${1}\nlet x = x + ${2}\nprint(x)',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10),
            new ValueGenerator('integer', 1, 10),
        ],
        output: (a, b) => {
            return a + b;
        },
        difficulty: 70
    }
];