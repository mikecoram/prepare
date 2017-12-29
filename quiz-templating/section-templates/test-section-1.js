const ValueGenerator = require('../value-generator').ValueGenerator;

exports.info = {
    name: 'test-section',
    difficulty: 0
}

exports.entries = [
    {
        input: 'print(3 + 7)',
        output: 10
    },
    {
        inputTemplate: 'print(${1} + ${2})',
        output: (x, y) => {
            return x + y;
        },
        difficulty: 10,
        valueGenerators: [
            new ValueGenerator('integer', 1, 10),
            new ValueGenerator('integer', 1, 10)
        ]
    }
];