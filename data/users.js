import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

export async function createUser(firstName,
    lastName,
    emailAddress,
    password  ) {

    const userCollection = await users();

    // TODO: hash password 

    let newUser = {
        _id : new ObjectId(),
        firstName : firstName,
        lastName : lastName,
        emailAddress : emailAddress,
        hashedPassword : password,
        favoritePets : []
    };

    let insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: could not add user to database";
        
    return newUser;
    };

export async function getAll() {
    const usersCollection = await users();
    let userList = await usersCollection.find({}).toArray();
    if (!userList) throw "Error: Could not get all pets";
    return userList;
};