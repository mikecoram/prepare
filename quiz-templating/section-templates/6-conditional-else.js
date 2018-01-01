const ValueGenerator = require('../value-generator').ValueGenerator;

exports.info = {
    name: 'Conditional logic: else',
    difficulty: 0
};

exports.entries = [
    {
        input:
            'let x = 4\n'+
            'if (x = 3)\n'+
                '\tprint("x is equal to 3")\n'+
            'else\n'+
                '\tprint("x is not equal to 3")',
        output: 'x is not equal to 3'
    },
    {
        inputTemplate: 
            'let x = ${1}\n'+
            'if (x > ${1})\n'+
                '\tprint("x is greater than ${1}")\n'+
            'else\n'+
                '\tprint("x is not greater than ${1}")\n',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10)
        ],
        output: (a) => {
            return 'x is not greater than ' + a;
        },
        difficulty: 0
    },
    {
        inputTemplate:
            'let x = ${1}\n'+
            'if (x = ${1})\n'+
                '\tprint("x is equal to ${1}")\n'+
            'else\n'+
                '\tprint("x is not equal to ${1}")\n'+
            '\nif (x = ${2})\n'+
                '\tprint("x is equal to ${2}")\n'+
            'else\n'+
                '\tprint("x is not equal to ${2}")\n',
        valueGenerators: [
            new ValueGenerator('integer', 1, 5),
            new ValueGenerator('integer', 5, 10)
        ],
        output: (a, b) => {
            return 'x is equal to ' + a 
                + '\nx is not equal to ' + b;
        },
        difficulty: 0
    },
    // Same question but with a reassignment
    {
        inputTemplate:
            'let x = ${1}\n'+
            'if (x = ${1})\n'+
                '\tprint("x is equal to ${1}")\n'+
            'else\n'+
                '\tprint("x is not equal to ${1}")\n'+
            '\nlet x = ${2}\n'+
            'if (x = ${2})\n'+
                '\tprint("x is equal to ${2}")\n'+
            'else\n'+
                '\tprint("x is not equal to ${2}")\n',
        valueGenerators: [
            new ValueGenerator('integer', 1, 5),
            new ValueGenerator('integer', 5, 10)
        ],
        output: (a, b) => {
            return 'x is equal to ' + a 
                + '\nx is equal to ' + b;
        },
        difficulty: 0
    }
];