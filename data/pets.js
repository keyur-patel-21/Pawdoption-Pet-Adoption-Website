import {pets} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import helpers from '../helpers.js';

export async function createPet(creatorId, 
    name, 
    age, 
    gender, 
    breed, 
    description,
    typeOfAnimal,
    zip,
    picture,
    adoptionStatus) {

    const petCollection = await pets();

    name = helpers.checkString(name);
    age = helpers.checkStringisNumber(age);
    gender = helpers.checkString(gender);  //implement as drop down menu
    breed = helpers.checkString(breed);  //implement as drop down menu
    description = helpers.checkString(description);
    typeOfAnimal = helpers.checkString(typeOfAnimal);  //implement as drop down menu
    zip = helpers.checkZip(zip);
    //picture file validation 
    //adoption validation

    let newPet = {
        _id : new ObjectId(),
        creatorId : creatorId,
        name : name, 
        age : age, 
        gender : gender, 
        breed : breed, 
        description : description,
        typeOfAnimal : typeOfAnimal,
        zip : zip,
        picture : picture,
        adoptionStatus : adoptionStatus,
        lastUpdated : new Date().toLocaleDateString(),
        comments : []
    };
    newPet._id = newPet._id.toString();

    let insertInfo = await petCollection.insertOne(newPet);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: could not add pet to database";
        
    return newPet;
};

export async function getAllPets() {
    const petsCollection = await pets();
    let petList = await petsCollection.find({}).toArray();
    if (!petList) throw "Error: Could not get all pets";

    return petList;
};

export async function getPetById(id) {
    id = helpers.checkId(id);
    if (!id) throw "Error: id must be given";
    const petsCollection = await pets();
    const user = await petsCollection.findOne({ _id: id});
    if (!user) throw "Erro: no pet with that id exist";
    return user;
};

export async function getPetByCreator(id) {
    id = helpers.checkId(id);
    if (!id) throw "Error: id must be given";
    const petsCollection = await pets();
    const user = await petsCollection.findOne({ creatorId: id});
    if (!user) throw "Erro: no pet with that id exist";
    return user;
};