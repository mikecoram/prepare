const DateHelper = require('../lib/date-helper');

describe('date helper', function() {
    it('formats the date', done => {
        let formatted = DateHelper.format(new Date(2018, 0, 01, 8, 30));
        if (formatted == 'Monday, Jan 1, 2018, 8:30 AM')
            done();
    });
});