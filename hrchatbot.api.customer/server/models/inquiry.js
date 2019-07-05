export default (sequelize, DataTypes) => {
  const Inquiry = sequelize.define('Inquiry', {

    question: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "User's question cannot be null"
        },
        notEmpty: {
          args: true,
          msg: "User's question cannot be empty"
        }
      }
    },

    intent: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Intent name cannot be null"
        }
      }
    },

    intentConfidence: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Intent confidence cannot be null"
        }
      }
    },

    entity: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Entity name cannot be null"
        }
      }
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
      get: function() {
        return JSON.parse(this.getDataValue('location'));
      },
      set: function(val) {
        return this.setDataValue('location', JSON.stringify(val));
      },
      validate: {
        notNull: {
          args: true,
          msg: "Entity location cannot be null"
        }
      }
    },

    value: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Entity value cannot be null"
        }
      }
    },

    entityConfidence: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Entity confidence cannot be null"
        }
      }
    },

    jsonPayload: {
      type: DataTypes.STRING(2048),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "JSON payload cannot be null"
        }
      }
    },

    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: {
        args: false,
        msg: 'Please provide id of the user that asked the question'
      }
    },

    dateOfCreation: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Date of creation must exist'
      }
    },

  }, {
    timestamps: true,
    updatedAt: false
  });
  Inquiry.associate = (models) => {
    // associations can be defined here
    Inquiry.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Inquiry;
};
