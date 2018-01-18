exports.USER_ROLE = {
    USER: 'user',
    TUTOR: 'tutor',
    ADMIN: 'admin'
};

exports.USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

exports.FROM_EMAIL = 'noreply@boilerplate.com';

exports.GLOBAL_SETTING_TITLES = {
    allowUserToSeeResultBreakdown: 'allowUserToSeeResultBreakdown',
    toArray: function() {
        return [this.allowUserToSeeResultBreakdown];
    }
}