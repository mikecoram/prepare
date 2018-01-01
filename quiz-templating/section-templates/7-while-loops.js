const ValueGenerator = require('../value-generator').ValueGenerator;

exports.info = {
    name: 'Loops: while',
    difficulty: 0
};

exports.entries = [
    {
        input: 
            'let x = 1\n'+
            'while (x < 6)\n'+
                '\tprint(x)\n'+
                '\tlet x = x + 1',
        output: '1\n2\n3\n4\n5'
    },
    {
        inputTemplate: 
            'let x = ${1}\n'+
            'while (x > 0)\n'+
                '\tprint(x)\n'+
                '\tlet x = x - 1',
        valueGenerators: [
            new ValueGenerator('integer', 3, 6)
        ],
        output: (a) => {
            let result = '';
            while (a > 0) {
                result += a + '\n';
                a--;
            }
            return result;
        },
        difficulty: 0
    },
    {
        inputTemplate:
            'let x = ${1}\n'+
            'let y = 0\n'+
            'while (y <= ${2})\n'+
                '\tprint(y * x)\n'+
                '\tlet y = y + 1\n',
        valueGenerators: [
            new ValueGenerator('integer', 2, 10),
            new ValueGenerator('integer', 5, 11)
        ],
        output: (multiple, num) => {
            let result = '';
            for (let i = 0; i <= num; i++) {
                result += (multiple * i) + '\n';
            }
            return result;
        },
        difficulty: 0
    }
];