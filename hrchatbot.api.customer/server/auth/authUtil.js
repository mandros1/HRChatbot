const crypto = require('crypto');

/**
 * Function that securely increases the passed date for a number of months that is passed via the
 * count parameter and by securely it safely increases 31.05. to 30.5.
 * @param date is the date that is passed to the function which is to be modified
 * @param count is the amount of months we add on the passed date
 * @return {*} returns the date that is increased by a number of months defined by the count
 */
function addMonthsUTC (date, count) {
    if (date && count) {
        let m, d = (date = new Date(+date)).getUTCDate();

        date.setUTCMonth(date.getUTCMonth() + count, 1);
        m = date.getUTCMonth();
        date.setUTCDate(d);
        if (date.getUTCMonth() !== m) date.setUTCDate(0)
    }
    return date
}

/**
 * Takes in the date and creates the integer from it by year+month+day+hours+minutes, ex.
 * 23.09.1994. 15:03 -> 199409231503
 * @param date that is to be reformatted into the integer to be stored inside the database
 * @return {number} integer representation of the passed date
 */
function generateIntegerDateFormat (date) {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const dateDay = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return parseInt(year+month+dateDay+hours+minutes);
}


/**
 *
 * @param userData is the JSON object from which it pulls all the needed data for the authentication
 * @return {Promise<*>}
 */
exports.verifyOrCreateAuthToken = async (userData) => {

    // fetching user token and it's date of validity
    const token = userData.get('auth_token');
    const tokenValidToDate = userData.get('auth_token_valid_to');

    // boolean value of if the date is still valid
    const hasExpired = tokenValidToDate < new Date();

    // if the token exists and is still valid then just return userData
    if(token && !hasExpired) return userData;

    // if there is no token then the API creates one
    if (!token) {
        // generates the salt for the auth_token
        // NOTE - different from the salt stored in the database
        const salt = crypto.randomBytes(Math.ceil(16/2))
            .toString('hex')
            .slice(0, 16);

        let hash = crypto.createHmac('sha512', salt);
        hash.update(userData.get('email'));

        userData.set({
            auth_token: hash.digest('hex')
        });
    }
    // if there is no date of expiration for the token set or it has expired API renews/creates it
    if(!tokenValidToDate || hasExpired) {
        // generate the date with 1 month on top of it
        const dateOfValidity = addMonthsUTC(new Date(), 1);
        // convert that date into a integer
        const tokenDateValid = generateIntegerDateFormat(dateOfValidity);
        userData.set({
            auth_token_valid_to: tokenDateValid
        });
    }
    userData.save();
};
