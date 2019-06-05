import Users from '../controllers/user';
const authUtil       = require('./authUtil');
const _ = require('lodash');

exports.authenticateUser = async (userData, email, password) => {
    try {
        // check if either email or password is empty and if so throw appropriate error
        switch (true) {
            case _.isEmpty(email):
                throw new Error('Email cannot be empty');
            case _.isEmpty(password):
                throw new Error('Password cannot be empty');
        }
    }
    catch (err) {
        console.log(err);
        throw err;
    }

    /**
     * Pull out stored hashedPassword, salt string and admin status from the user data object
     */
    const userPw = userData.get('password');
    const userSalt = userData.get('salt');
    const isAdmin = (/true/i).test(userData.get('isAdmin'));


    // TODO: add admin and change it in the code here as well
    const isPasswordValid = Users.passwordComparison(userPw, userSalt,
        isAdmin, password);
    if (!isPasswordValid) {
        throw new Error('Password is invalid');
    }

    await authUtil.verifyOrCreateAuthToken(userData);
    // return user.toAuthJSON()
};
