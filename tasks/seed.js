import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import * as users from '../data/users.js';
import * as pets from '../data/pets.js';

const db = await dbConnection();
await db.dropDatabase();

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
    const allUsers = await users.getAll();
    console.log(allUsers);
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
    const allPets = await pets.getAll();
    console.log(allPets);
} catch (e){
    console.log (e)
}

 await closeConnection();