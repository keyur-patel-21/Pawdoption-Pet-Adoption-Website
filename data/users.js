import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers.js';

export async function createUser(firstName,
    lastName,
    emailAddress,
    password  ) {

    firstName = helpers.checkString(firstName, "first name");
    lastName = helpers.checkString(lastName, "last name");
    emailAddress = helpers.checkEmail(emailAddress);
    // TODO: hash password 

    const userCollection = await users();

    let newUser = {
        _id : new ObjectId(),
        firstName : firstName,
        lastName : lastName,
        emailAddress : emailAddress,
        hashedPassword : password,
        favoritePets : []
    };

    newUser._id = newUser._id.toString();

    let insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: could not add user to database";
        
    return newUser;
    };

export async function getAllUsers() {
    const usersCollection = await users();
    let userList = await usersCollection.find({}).toArray();
    if (!userList) throw "Error: Could not get all users";

    return userList;
};

export async function getUserById(id) {
    id = helpers.checkId(id, "user id");
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: id});
    if (!user) throw "Error: no user with that id exist";

    return user;
};

export async function updateUser(id,
        firstName,
        lastName,
        emailAddress) {
    id = helpers.checkId(id, "user id");
    firstName = helpers.checkString(firstName, "first name");
    lastName = helpers.checkString(lastName, "last name");
    emailAddress = helpers.checkEmail(emailAddress);

    const usersCollection = await users();   

    let setUser = {
        firstName : firstName,
        lastName : lastName,
        emailAddress : emailAddress,
    };

    const updatedInfo = await usersCollection.updateOne(
        {_id: id},
        {$set: setUser}
    );

    if (!updatedInfo) {
        throw 'Error: could not update user successfully';
    }

    return updatedInfo;
};

export async function addFavoritePet(petId, userId){
    petId = helpers.checkId(petId, "pet id");
    userId = helpers.checkId(userId, "user id");

    let newFavoritePet = {
        _id: new ObjectId(),
        petId: petId
    };

    newFavoritePet._id = newFavoritePet._id.toString();
    const usersCollection = await users();   

    const updatedInfo = await usersCollection.updateOne(
        {_id: userId}, {$push: {favoritePets: newFavoritePet}});

    return updatedInfo;
};