import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import userDataFunctions from '../data/users.js';
import petDataFunctions  from '../data/pets.js';

const db = await dbConnection();
await db.dropDatabase();

const users = userDataFunctions;
const pets = petDataFunctions;
//create users
let fiona;
try {
    fiona = await users.createUser(
        "Fiona",
        "Brockner",
        "fbrockne@stevens.edu",
        "testerpassword");
} catch (e) {
    console.log(e);
}
try {
    const allUsers = await users.getAllUsers();
    //console.log(allUsers);
} catch (e) {
    console.log(e);
}

//create pets
let pella;
try {
    pella = await pets.createPet(fiona._id, 
        "Pella", 
        "12", 
        "Female", 
        "Labrador", 
        "Pella is a sweet dog who loves going on hikes and chasing squirrels.",
        "Dog",
        "06812",
        "pellaPicture.png",
        "false");
} catch (e) {
    console.log(e);
}

try {
    const allPets = await pets.getAllPets();
    console.log(allPets);
} catch (e){
    console.log (e)
}

try {
    const petPella = await pets.getPetById(pella._id);
    console.log(petPella);
} catch (e){
    console.log (e)
}

try {
    const fionaPet = await pets.getPetByCreator(fiona._id);
    console.log(fionaPet);
} catch (e){
    console.log (e)
}

try {
    const fionaPet = await users.getUserById(fiona._id);
    console.log(fionaPet);
} catch (e){
    console.log (e)
}

 await closeConnection();