'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ride extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ride.init({
    driver_id: DataTypes.INTEGER,
    pickup_location: DataTypes.STRING,
    drop_location: DataTypes.STRING,
    available_seats: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ride',
  });
  return Ride;
};