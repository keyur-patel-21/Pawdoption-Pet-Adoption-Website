import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import users from '../data/users.js';
import pets from '../data/pets.js';

const db = await dbConnection();
await db.dropDatabase();

// seed database for testing purposes

await closeConnection();