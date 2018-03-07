const Validation = require('../lib/validation');

describe('email validation', () => {
    it('accepts a valid email address', done => {
        if (Validation.isValidEmailAddress("user@user.com"))
            done();
    });

    it('rejects an email address with no @ symbol', done => {
        if (!Validation.isValidEmailAddress("useruser.com"))
            done();
    });

    it('rejects an email address with no . symbol', done => {
        if (!Validation.isValidEmailAddress("user@usercom"))
            done();
    });

    it('rejects an email address with a 1 character extension', done => {
        if (!Validation.isValidEmailAddress("user@user.c"))
            done();
    });
});

describe('password validation', () => {
    it('accepts a valid password', done => {
        if (Validation.isValidPassword("password1"))
            done();
    });

    it ('rejects a password shorter than 6 characters', done => {
        if (!Validation.isValidPassword("passw"))
            done();
    });
});