import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import userDataFunctions from '../data/users.js';
import petDataFunctions  from '../data/pets.js';
const db = await dbConnection();
await db.dropDatabase();
const users = userDataFunctions;
const pets = petDataFunctions;

//create users
let fiona, dhanvin, keyur;
try {
    fiona = await users.createUser(
        "Fiona",
        "Brockner",
        "fbrockne@stevens.edu",
        "Tester123!");
} catch (e) {
    console.log(e);
}

try {
    dhanvin = await users.createUser(
        "Dhanvin",
        "Patel",
        "dhanvin@stevens.edu",
        "Tester123!");
} catch (e) {
    console.log(e);
}

try {
    keyur = await users.createUser(
        "Keyur",
        "Patel",
        "keyur@stevens.edu",
        "Tester123!");
} catch (e) {
    console.log(e);
}

// create dogs
let pella, coco;
try {
    pella = await pets.createPet(fiona.insertedUserId, 
        "Pella", 
        "12", 
        "Female", 
        "Labrador", 
        "Pella is a sweet dog who loves going on hikes and chasing squirrels.",
        "dog",
        "06812",
        "public/img/pet/pellaPicture.jpeg",
        "false");
} catch (e) {
    console.log(e);
}
try {
    coco = await pets.createPet(dhanvin.insertedUserId, 
        "Coco", 
        "12", 
        "Female", 
        "German Shepard", 
        "Coco is looking for a new home. She loves other dogs and playing fetch!",
        "dog",
        "07020",
        "public/img/pet/cocoPicture.jpeg",
        "false");
} catch (e) {
    console.log(e);
}

// create cats
let polly, murphy
try {
    polly = await pets.createPet(keyur.insertedUserId, 
        "Polly", 
        "3", 
        "Female", 
        "Domestic Shorthair", 
        "Polly loves bird watching. She can't wait to find a loving home.",
        "cat",
        "07020",
        "public/img/pet/pollyPicture.jpg",
        "false");
} catch (e) {
    console.log(e);
}

try {
    murphy = await pets.createPet(fiona.insertedUserId, 
        "Murphy", 
        "7", 
        "Male", 
        "Domestic Shorthair", 
        "Murphy is a lazy cat who loves cat treats and cuddling!",
        "cat",
        "07020",
        "public/img/pet/murphyPicture.jpg",
        "false");
} catch (e) {
    console.log(e);
}

// create fish
let fin;
try {
    fin = await pets.createPet(dhanvin.insertedUserId, 
        "Fin", 
        "1", 
        "Male", 
        "Goldfish", 
        "Fin is a quiet fish who needs a new home.",
        "fish",
        "07020",
        "public/img/pet/finPicture.jpg",
        "false");
} catch (e) {
    console.log(e);
}

// create rabbit
let bunny;
try {
    bunny = await pets.createPet(keyur.insertedUserId, 
        "Bunny", 
        "2", 
        "Male", 
        "English Spot", 
        "Bunny's favrotie food is hay and he loves playing hide and seek.",
        "rabbit",
        "07020",
        "public/img/pet/bunnyPicture.jpg",
        "false");
} catch (e) {
    console.log(e);
}

// create reptile
let rex;
try {
    rex = await pets.createPet(fiona.insertedUserId, 
        "Rex", 
        "10", 
        "Male", 
        "Chameleon", 
        "Rex loves his sun lamp. He's looking for a new owner that loves chameleons!",
        "reptile",
        "07020",
        "public/img/pet/diegoPicture.jpg",
        "false");
} catch (e) {
    console.log(e);
}

// create bird
let diego;
try {
    rex = await pets.createPet(dhanvin.insertedUserId, 
        "Diego", 
        "3", 
        "Male", 
        "Parrot", 
        "Rex is looking for a new home, preferably with another bird",
        "bird",
        "07020",
        "public/img/pet/diegoPicture.jpg",
        "false");
} catch (e) {
    console.log(e);
}

 await closeConnection();