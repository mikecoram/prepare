const ValueGenerator = require('../../quiz-templating/value-generator').ValueGenerator;

exports.info = {
    name: 'Tester 2',
    difficulty: 10
};

exports.entries = [
    {
        input: '1 + 3',
        output: '4',
        difficulty: 0
    },
    {
        inputTemplate: 'print(${1} + ${2})',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10),
            new ValueGenerator('integer', 1, 10)
        ],
        output: (a, b) => { return a + b; },
        difficulty: 70
    }
];