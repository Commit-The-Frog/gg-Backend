const { User } = require('../config/mongodbConfig');
var userException = require('../exception/userException');

// CREATE user
const addUser = async function (name, profileImg) {
	try {
		const result = await User.create({
			name : name,
			profile_img : profileImg
		});
		console.log(`added user to DB : [${result.name}, ${result._id}]`);
		return result;
	} catch (error) {
		if (error.code === 11000)
			throw new userException.UserNameDuplicateError("name duplicated : reject from repository");
		else
			throw error;
	}
};

// FIND user by id
const findUserById = async function (userId) {
	try {
		const result = await User.find({ _id : userId });
		console.log(`user searched from DB : [${result.name}, ${result._id}]`)
		return result;
	} catch (error) {
		throw new userException.UserNotFoundError("user not found : reject from repository");
	}
}

// FIND all users
const findAllUsers = function () {
	try {
		console.log('all user searched from DB')
		return User.find({});
	} catch (error) {
		throw error;
	}
}

// DELETE user by id
const deleteUserById = async function (userId) {
	try {
		var user = await User.find({ _id : userId });
		if (user.length === 0)
			throw new userException.UserNotFoundError("user not found : reject from repository");
		await User.deleteOne({ _id : userId });
		console.log(`user deleted from DB : [${user.name}, ${user._id}]`);
		return user;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	addUser,
	findUserById,
	findAllUsers,
	deleteUserById
};