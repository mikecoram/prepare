const TutorSettings = require('../lib/tutor-settings');
const { GlobalSetting } = require("../models");
const GLOBAL_SETTING_TITLES = require("../constants").GLOBAL_SETTING_TITLES;

describe('tutor settings', () => {
    it('creates setting', done => {
        let test = async function() {
            await clearGlobalSettings();
            await createResultBreakdownSetting();
            return await getResultsBreakdownSetting();
        }

        test().then((setting) => {
            if (setting.value == 'on')
                done();
        })
    });

    it('updates setting', done => {
        let test = async function() {
            await clearGlobalSettings();
            await createResultBreakdownSetting();

            let settings = {};
            settings[GLOBAL_SETTING_TITLES.allowUserToSeeResultBreakdown] = 'off';

            await TutorSettings.save(settings);
            return await getResultsBreakdownSetting();
        };

        test().then((setting) => {
            if (setting.value == 'off')
                done();
        });
    });

    it('gets setting by title', done => {
        let test = async function() {
            await clearGlobalSettings();
            await createResultBreakdownSetting();

            return await TutorSettings.get(GLOBAL_SETTING_TITLES.allowUserToSeeResultBreakdown);
        }

        test().then(setting => {
            if (setting)
                done();
        });
    });

    it('gets results breakdown setting in boolean format', done => {
        let test = async function() {
            await clearGlobalSettings();
            await createResultBreakdownSetting();

            return await TutorSettings.userAllowed();
        }

        test().then(result => {
            if (result == true)
                done();
        });
    });

    it('gets all settings', done => {
        let test = async function() {
            await clearGlobalSettings();
            await createGroupOfSettings();

            return await TutorSettings.all();
        }

        test().then(result => {
            if (result.length == TEST_SETTINGS.length)
                done();
        });
    });

});

function clearGlobalSettings() {
    return GlobalSetting.destroy({where: {}});
}

var TEST_SETTINGS = {};
TEST_SETTINGS["one"] = "on";
TEST_SETTINGS["two"] = "off";
TEST_SETTINGS["three"] = "on";
function createGroupOfSettings() {
    return TutorSettings.save(TEST_SETTINGS);
}

function createResultBreakdownSetting() {
    let settings = {};
    settings[GLOBAL_SETTING_TITLES.allowUserToSeeResultBreakdown] = 'on';

    return TutorSettings.save(settings);
}

function getResultsBreakdownSetting() {
    return GlobalSetting.findOne({
        where: {
            title: GLOBAL_SETTING_TITLES.allowUserToSeeResultBreakdown
        }
    });
}