export default (sequelize, DataTypes) => {
  const Inquiry = sequelize.define('Inquiry', {
    question: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please provide user question'
      }
    },

    answer: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please provide chatbot answer'
      }
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Please provide id of the user that asked the question'
      }
    },

    confidence: {
      type: DataTypes.FLOAT,
      allowNull: {
        args: false,
        msg: 'Please provide confidence of the chatbot for the given answer'
      }
    }

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
