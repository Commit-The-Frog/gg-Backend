const { User } = require('../config/mongodbConfig');
var UserNameDuplicateError = require('../exception/userException');

// CREATE user
const addUser = async function (name, profileImg) {
	try {
		const result = await User.create({
			name : name,
			profile_img : profileImg
		});
		console.log("successfully added user : " + result.name + " id : " + result._id);
		return result;
	} catch (error) {
		if (error.code === 11000) {
			throw new UserNameDuplicateError("name duplicated : reject from repository");
		}
		else
			throw error;
	}
};

// FIND user by id
const findUserById = async function (userId) {
	try {
		const result = await User.find({ _id : userId });
		console.log(result);
		return result;
	} catch (error) {
		console.log(error);
	}
}

// FIND all users
const findAllUsers = function () {
	return User.find({});
}

module.exports = {
	addUser,
	findUserById,
	findAllUsers
};