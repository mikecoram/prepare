const ValueGenerator = require('../../quiz-templating/value-generator').ValueGenerator;

exports.info = {
    name: 'Tester 1',
    difficulty: 0
};

exports.entries = [
    {
        input: 'print("Test")',
        output: 'Hello',
        difficulty: 0
    },
    {
        inputTemplate: 'print("Tester")',
        output: () => { return 'Tester'; },
        difficulty: 0
    },
    {
        inputTemplate: 'print(${1})',
        valueGenerators: [
            new ValueGenerator('string')
        ],
        output: (a) => { return a; },
        difficulty: 40
    }
];