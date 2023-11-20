import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers.js';

export async function createUser(firstName,
    lastName,
    emailAddress,
    password  ) {

    firstName = helpers.checkString(firstName);
    lastName = helpers.checkString(lastName);
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
    if (!userList) throw "Error: Could not get all pets";
    return userList;
};

export async function getUserById(id) {
    id = helpers.checkId(id);
    if (!id) throw "Error: id must be given";
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: id});
    if (!user) throw "Erro: no user with that id exist";
    return user;
};