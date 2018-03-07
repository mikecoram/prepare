exports.get = get;
exports.all = all;
exports.save = save;
exports.userAllowed = userAllowed;

const Op = require("sequelize").Op;
const { GlobalSetting } = require("../models");
const GLOBAL_SETTING_TITLES = require("../constants").GLOBAL_SETTING_TITLES;

async function userAllowed() {
	let setting = await get(GLOBAL_SETTING_TITLES.allowUserToSeeResultBreakdown);
	if (!setting) return false;
	return setting.value == 'on';
}

async function get(title) {
	let setting = await GlobalSetting.findOne({
		where: {
			title: title
		}
	});
	return setting;
}

async function all() {
	let globalSettings = await GlobalSetting.findAll({
		where: {
			title: {
				[Op.in]: GLOBAL_SETTING_TITLES.toArray()
			}
		}
	});

	let resultsBreakdown = globalSettings.find(s => {
		return s.title == GLOBAL_SETTING_TITLES.allowUserToSeeResultBreakdown;
	});

	let settings = {
		allowUserToSeeResultBreakdown:
			resultsBreakdown ? (resultsBreakdown.value == "on" ? true : false) : false
	};
	return settings;
}

async function save(settings) {
	if (
		!Object.keys(settings).find(k => {
			return k == GLOBAL_SETTING_TITLES.allowUserToSeeResultBreakdown;
		})
	) {
		settings[GLOBAL_SETTING_TITLES.allowUserToSeeResultBreakdown] = false;
	}

	for (let k of Object.keys(settings)) {
		let existingSetting = await GlobalSetting.findOne({
			where: {
				title: k
			}
		});

		if (existingSetting) {
			await existingSetting.update({
				value: settings[k]
			});
		} else {
			await GlobalSetting.create({
				title: k,
				value: settings[k]
			});
		}
	}
}
