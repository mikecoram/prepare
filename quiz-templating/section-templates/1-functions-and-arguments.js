const ValueGenerator = require('../value-generator').ValueGenerator;

exports.info = {
    name: 'Function calls and arguments',
    difficulty: 0
};

exports.entries = [
    {
        input: 'print("Hello")',
        output: 'Hello'
    },
    {
        inputTemplate: 'print("Goodbye")',
        output: () => { return 'Goodbye'; },
        difficulty: 0
    },
    {
        inputTemplate: 'print(${1})',
        output: (a) => { return a; },
        difficulty: 0,
        valueGenerators: [
            new ValueGenerator('string')
        ]
    },
    {
        input: 'printMultiple("Hello", 3)',
        output: 'Hello\nHello\nHello'
    },
    {
        inputTemplate: 'printMultiple("Goodbye", 5)',
        output: () => {
            return 'Goodbye\nGoodbye\nGoodbye\nGoodbye\nGoodbye';
        },
        difficulty: 0
    },
    {
        inputTemplate: 'printMultiple(${1}, ${2})',
        output: (str, amount) => {
            let out = '';
            for (let i = 0; i < amount; i++) {
                out += str + '\n';
            }
            return out;
        },
        difficulty: 0,
        valueGenerators: [
            new ValueGenerator('string'),
            new ValueGenerator('integer', 1, 5)
        ]
    }
];