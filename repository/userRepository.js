const { User } = require('../config/mongodbConfig');

// CREATE user
const addUser = async function (name, profileImg) {
	const result = await User.create({
		name : name,
		profile_img : profileImg
	});
	console.log("successfully added user : " + result.name + " id : " + result._id);
	return result;
};

// FIND user
const findUserById = function (userId) {
	return User.find({ _id : userId });
}

module.exports = {
	addUser,
	findUserById
};