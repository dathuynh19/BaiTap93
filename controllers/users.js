let userModel = require('../schemas/users')
let bcrypt = require('bcrypt')

module.exports = {
    CreateAnUser: async function (username, password, email, role,
        avatarUrl, fullName, status, loginCount
    ) {
        let newUser = new userModel({
            username: username,
            password: password,
            email: email,
            role: role,
            avatarUrl: avatarUrl,
            fullName: fullName,
            status: status,
            loginCount: loginCount
        })
        await newUser.save();
        return newUser;
    },
    QueryByUserNameAndPassword: async function (username, password) {
        let getUser = await userModel.findOne({ username: username });
        if (!getUser) {
            return false;
        }
        let isPasswordMatch = bcrypt.compareSync(password, getUser.password);
        if (isPasswordMatch) {
            return getUser;
        }
        return false;
    },
    FindUserById: async function (id) {
        return await userModel.findOne({
            _id: id,
            isDeleted:false
        }).populate('role')
    },
    changePassword: async function (userId, oldPassword, newPassword) {
        let user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        let isPasswordMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isPasswordMatch) {
            throw new Error("Old password is not correct");
        }
        user.password = newPassword;
        await user.save();
    }
}