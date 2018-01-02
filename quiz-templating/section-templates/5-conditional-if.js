const ValueGenerator = require('../value-generator').ValueGenerator;

exports.info = {
    name: 'Conditional logic: if',
    difficulty: 30
};

exports.entries = [
    {
        input:  
            'let x = 5\n' +
            'if (x = 5)\n' +
                '\tprint("x is equal to 5")\n' +
            'if (x > 3)\n' +
                '\tprint("x is greater than 3")\n' +
            'if (x < 3)\n' +
                '\tprint("x is less than 3")\n' +
            'if (x > 5)\n' +
                '\tprint("x is greater than 5")\n' +
            'if (x >= 5)\n' +
                '\tprint("x is greater than or equal to 5")',
        output: 
            'x is equal to 5\n'+
            'x is greater than 3\n'+
            'x is greater than or equal to 5',
        difficulty: 30
    },
    {
        inputTemplate: 
            'let x = ${1}\n'+
            'if (x = ${1})\n'+
                '\tprint("x is equal to ${1}")',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10)
        ],
        output: (a) => {
            return 'x is equal to ' + a;
        },
        difficulty: 30
    },
    {
        inputTemplate:
            'let x = ${1}\n'+
            'if (x = ${2})\n'+
                '\tprint("x is equal to ${2}")',
        valueGenerators: [
            new ValueGenerator('integer', 1, 5),
            new ValueGenerator('integer', 6, 10)
        ],
        output: (a, b) => {
            return '';
        },
        difficulty: 40
    },
    {
        inputTemplate: 
            'let x = ${1}\n'+
            'if (x < ${1})\n'+
                '\tprint("x is less than ${1}")\n'+
            'if (x <= ${1})\n'+
                '\tprint("x is less than or equal to ${1}")',
        valueGenerators: [
            new ValueGenerator('integer', 1, 10),
        ],
        output: (a) => {
            return 'x is less than or equal to ' + a;
        },
        difficulty: 50
    },
    {
        inputTemplate: 
            'let x = ${1}\n'+
            'if (x > ${2})\n'+
                '\tprint("x is greater than ${2}")\n'+
            'if (x > ${3})\n'+
                '\tprint("x is greater than ${3}")\n',
        valueGenerators: [
            new ValueGenerator('integer', 5, 8),
            new ValueGenerator('integer', 1, 4),
            new ValueGenerator('integer', 9, 10)
        ],
        output: (a, b, c) => {
            return 'x is greater than ' + b;
        },
        difficulty: 60
    }
];