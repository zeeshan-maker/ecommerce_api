const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
    user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("User", "Admin"), // Define ENUM for roles
        defaultValue: "User",
    },
    isVerified:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
     resetToken:{
        type:DataTypes.STRING
    },
    refreshToken:{
        type:DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    tableName:"User"
});


module.exports= User;