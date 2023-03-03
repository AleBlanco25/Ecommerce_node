const { DataTypes, Model } = require("sequelize");
const { db } = require("../database/db");

const ProductImg = db.define('productsImgs', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    productId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: true,
    }
})

module.exports = ProductImg