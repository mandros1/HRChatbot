import Users from '../controllers/user';
const authUtil       = require('./authUtil');
const _ = require('lodash');

exports.authenticateUser = async (userData, email, password) => {
    try {
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

    // if(user === null || user === undefined) {
    //     throw new Error('There is no user by this email')
    // }
    // console.log(`User data is: ${user.email}, ${user.password}, ${user.salt}`);
    const userPw = userData.get('password');
    const userSalt = userData.get('salt');
    // userData.set({email: 'Jozo@gjg.hr'});
    // userData.save();

    // TODO: add admin and change it in the code here as well
    const isPasswordValid = Users.passwordComparison(userPw, userSalt, false, password);
    if (!isPasswordValid) {
        throw new Error('Password is invalid');
    }

    await authUtil.verifyOrCreateAuthToken(userData);
    // return user.toAuthJSON()
};
