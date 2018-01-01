const ValueGenerator = require('../value-generator').ValueGenerator;

exports.info = {
    name: 'Function returns',
    difficulty: 0
};

exports.entries = [
    {
        input: 'let x = halfOf(4)\nprint(x)',
        output: '2'
    },
    {
        inputTemplate: 'let x = halfOf(${1})\nprint(x)',
        valueGenerators: [
            new ValueGenerator('even-integer', 4, 20)
        ],
        output: (a) => {
            return a / 2;
        },
        difficulty: 0
    },
    {
        inputTemplate: 'let x = ${1}\nlet y = halfOf(x)\nprint(y)',
        valueGenerators: [
            new ValueGenerator('even-integer', 4, 20)
        ],
        output: (a) => {
            return a / 2;
        },
        difficulty: 0
    }
];