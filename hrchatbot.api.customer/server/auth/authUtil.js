const crypto = require('crypto');

function addMonthsUTC (date, count) {
    if (date && count) {
        var m, d = (date = new Date(+date)).getUTCDate();

        date.setUTCMonth(date.getUTCMonth() + count, 1);
        m = date.getUTCMonth();
        date.setUTCDate(d);
        if (date.getUTCMonth() !== m) date.setUTCDate(0)
    }
    return date
}

exports.verifyOrCreateAuthToken = async (userData) => {
    const token = userData.get('auth_token');
    const tokenValidToDate = userData.get('auth_token_valid_to');
    const hasExpired = tokenValidToDate < new Date();

    if(token && !hasExpired) {
        return userData;
    }

    const salt = crypto.randomBytes(Math.ceil(16/2))
                    .toString('hex')
                    .slice(0, 16);

    var hash = crypto.createHmac('sha512', salt);
    hash.update(userData.get('email'));
    const authToken = hash.digest('hex');
    const authTokenValidTo = addMonthsUTC(new Date(), 1);

    userData.set({
        auth_token: authToken
    });
    userData.set({
        auth_token_valid_to: authTokenValidTo
    });

    userData.save();
};
