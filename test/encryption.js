const Encryption = require('../lib/encryption');

describe('encryption', () => {
    it('generates hash', done => {
        let hash = Encryption.generatePasswordHash('password1');
        if (hash != 'password1')
            done();
    });

    it('matches hash', done => {
        if (Encryption.passwordMatchesHash('password1', Encryption.generatePasswordHash('password1')))
            done();
    });
});