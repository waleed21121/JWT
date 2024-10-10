const mongoose = require('mongoose');

const DB_URL = 'mongodb://127.0.0.1:27017/JWT_USERS';

// Schema for the users
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('user', userSchema);

exports.createNewUser = async (username, password) => {
    await mongoose.connect(DB_URL);
    let users = await User.find({username: username});
    if(users.length) {
        return Promise.reject();
    }
    let newUser = new User({
        username: username,
        password: password
    });
    await newUser.save();
}

exports.login = async (username, password) => {
    await mongoose.connect(DB_URL);
    let user = await User.findOne({username : username});
    let userExist;
    if(!user) {
        return Promise.reject();
    }
    else {
        userExist = (password == user.password);
    }
    if(!userExist) {
        return Promise.reject();
    }   
}