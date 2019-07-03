export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^[a-z]+(\s+[a-z]+)*$/i,
                    msg: 'Only letters allowed for the user name'
                },
                notNull: {
                    args: true,
                    msg: "User's name cannot be null"
                },
                notEmpty: {
                    args: true,
                    msg: "User's name cannot be empty"
                }
            }
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Email already exists'
            },
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Please enter a valid email address'
                },
                notNull: {
                    args: true,
                    msg: "User's email cannot be null"
                },
                notEmpty: {
                    args: true,
                    msg: "User's email cannot be empty"
                }
            },
        },

        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: "Boolean value for admin status is needed"
                }
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: "User's password cannot be null"
                },
                notEmpty: {
                    args: true,
                    msg: "User's password cannot be empty"
                }
            },
        },

        userHash: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },

        salt: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: 16,
                notNull: true,
                notEmpty: true
            }
        },

        auth_token: {
            type: DataTypes.STRING,
            defaultValue: null,
            unique: {
                args: true,
                msg: 'Token already exists'
            },
            allowNull: {
                args: false,
                msg: 'Token cannot be null'
            }
        },

        auth_token_valid_to: {
            type: DataTypes.INTEGER,
            defaultValue: null,
            allowNull: {
                args: false,
                msg: 'Token validity date cannot be null'
            }
        }
    }, {
        timestamps: false
    });
    User.associate = (models) => {
        User.hasMany(models.Inquiry, {
            foreignKey: 'userId',
        });
    };
    return User;
};