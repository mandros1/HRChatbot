import Users from '../controllers/user';
const authUtil       = require('./authUtil');
const _ = require('lodash');

/**
 *
 * @param userData is the JSON object from which it pulls all the needed data for the authentication
 * @param email is the email address passed by the user for the authentication
 * @param password is the string password passed by the user for the authentication
 * @return {Promise<*>}
 */
exports.authenticateUser = async (userData, email, password) => {
    try{
        // check if either email or password is empty and if so throw appropriate error
        switch (true) {
            case _.isEmpty(email):
                throw new Error('Email cannot be empty');
            case _.isEmpty(password):
                throw new Error('Password cannot be empty');
        }

        // Pull out stored hashedPassword, salt string and admin status from the user data object
        const userPw = userData.get('password');
        const userSalt = userData.get('salt');

        // check if the provided password matches the
        if (!(Users.passwordComparison(userPw, userSalt, password)))
            throw new Error('Invalid login credentials');

        // this will store/update authentication token and it's expiration date
        await authUtil.verifyOrCreateAuthToken(userData);
        return {
            success: true,
            message: "User has been successfully logged in."
        };
    } catch (e) {
        return {
            success: false,
            message: `${e.message}`
        };
    }
};
