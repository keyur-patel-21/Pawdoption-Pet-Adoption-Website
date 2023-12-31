import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import helpers from "../helpers.js";
import bcrypt from "bcryptjs";
import petsFn from "./pets.js";

const checkDuplicateEmail = async (email) => {
	const userCollection = await users();
	const existingUser = await userCollection.findOne({ emailAddress: email });
	return !!existingUser;
};

const exportedMethods = {
	async createUser(firstName, lastName, emailAddress, password) {
		firstName = helpers.checkString(firstName, "first name");
		lastName = helpers.checkString(lastName, "last name");
		emailAddress = helpers.checkEmail(emailAddress);
		const passwordReg = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()\-_=+{}[\]:;"'<>,.?/|\\]).{8,}$/;

		if (password.length === 0 || /\s/.test(password) || !passwordReg.test(password)) {
			throw "Please provide valid password"
		}
		const isDuplicateEmail = await checkDuplicateEmail(emailAddress);
		if (isDuplicateEmail) {
			throw "Email address already exists.";
		}

		var salt = bcrypt.genSaltSync(10);

		const userCollection = await users();

		let newUser = {
			_id: new ObjectId(),
			firstName: firstName,
			lastName: lastName,
			emailAddress: emailAddress,
			hashedPassword: bcrypt.hashSync(password, salt),
			favoritePets: []
		};

		let insertInfo = await userCollection.insertOne(newUser);
		if (!insertInfo.acknowledged || !insertInfo.insertedId) {
			throw "Error: could not add user to database";
		} else {
			return { insertedUser: true, insertedUserId: newUser._id };
		}
		// return newUser;
	},

	async loginUser(emailAddress, password) {
		emailAddress = helpers.checkEmail(emailAddress);
		password = password.trim();

		const lowerCaseEmail = emailAddress.toLowerCase();

		const userCollection = await users();
		const user = await userCollection.findOne({ emailAddress: lowerCaseEmail });

		if (!user) {
			throw "Please provide a valid email and password.";
		}

		const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

		if (passwordMatch) {
			const { _id, firstName, lastName, emailAddress, favoritePets } = user;
			return { _id, firstName, lastName, emailAddress, favoritePets };
		} else {
			throw "Please provide a valid email and password.";
		}
	},

	async getAllUsers() {
		const usersCollection = await users();
		let userList = await usersCollection.find({}).toArray();
		if (!userList) throw "Error: Could not get all users";

		return userList;
	},

	async getUserById(id) {
		id = helpers.checkId(id, "user id");
		const usersCollection = await users();
		const user = await usersCollection.findOne({ _id: new ObjectId(id) });
		if (!user) throw "Error: no user with that id exist";

		return user;
	},

	// not implemented in website yet
	async updateUser(id, firstName, lastName, emailAddress) {
		id = helpers.checkId(id, "user id");
		firstName = helpers.checkString(firstName, "first name");
		lastName = helpers.checkString(lastName, "last name");
		emailAddress = helpers.checkEmail(emailAddress);

		const usersCollection = await users();

		let setUser = {
			firstName: firstName,
			lastName: lastName,
			emailAddress: emailAddress
		};

		const updatedInfo = await usersCollection.updateOne(
			{ _id: id },
			{ $set: setUser }
		);

		if (!updatedInfo) {
			throw "Error: could not update user successfully";
		}

		return updatedInfo;
	},

	async addFavoritePet(petId, userId) {
		petId = helpers.checkId(petId, "pet id");
		userId = helpers.checkId(userId, "user id");

		try {
			const usersCollection = await users();

			const favPet = await petsFn.getPetById(petId)

			const updatedInfo = await usersCollection.updateOne(
				{ _id: new ObjectId(userId) },
				{ $addToSet: { favoritePets: favPet } }
			);

			return { favoritePetId: petId, userId: userId };
		} catch (error) {
			console.log(error);
		}
	},

	async removeUser(userId) {
		userId = helpers.checkId(userId, "user id");
		const usersCollection = await users();
		const deletionInfo = await usersCollection.findOneAndDelete({
			_id: userId,
		});
		if (!deletionInfo) {
			throw `Error: Could not delete user with id of ${userId}`;
		}
		let result = { userName: deletionInfo._id, deleted: true };
		return result;
	},

	async removeFavoritePet(petId, userSession) {
		petId = helpers.checkId(petId, "pet id");
		let userId = helpers.checkId(userSession.id, "user id");

		try {
			const usersCollection = await users();

			const updatedInfo = await usersCollection.findOneAndUpdate(
				{ _id: new ObjectId(userId) },
				{ $pull: { favoritePets: { _id: new ObjectId(petId) } } },
				{ returnDocument: "after" }
			);
			return { favoritePetId: petId, userId: userId, updatedInfo: updatedInfo };
		} catch (error) {
			console.log(error);
		}
	},
};

export default exportedMethods;