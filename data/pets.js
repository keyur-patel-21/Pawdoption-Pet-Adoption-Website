import { pets } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import helpers from "../helpers.js";
import userFn from "./users.js";

const exportedMethods = {
  async createPet(
    creatorId,
    name,
    age,
    gender,
    breed,
    description,
    typeOfAnimal,
    zip,
    picture,
    adoptionStatus
  ) {
    creatorId = helpers.checkId(creatorId, "creator id");
    name = helpers.checkString(name, "pet name");
    age = helpers.checkStringisNumber(age);
    gender = helpers.checkString(gender, "gender"); 
    breed = helpers.checkString(breed, "breed");
    description = helpers.checkString(description, "description");
    typeOfAnimal = helpers.checkString(typeOfAnimal, "typeOfAnimal");
    zip = helpers.checkZip(zip);
    // TODO: picture file validation
    adoptionStatus = helpers.checkAdoptedStatus(adoptionStatus);
    //picture = '\\' + picture;

    const petCollection = await pets();

    let newPet = {
      _id: new ObjectId(),
      creatorId: new ObjectId(creatorId),
      name: name,
      age: age,
      gender: gender,
      breed: breed,
      description: description,
      typeOfAnimal: typeOfAnimal,
      zip: zip,
      picture: picture,
      adoptionStatus: adoptionStatus,
      lastUpdated: new Date().toLocaleDateString(),
      comments: [],
    };

    let insertInfo = await petCollection.insertOne(newPet);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Error: could not add pet to database";

    return newPet;
  },

  async getAllPets() {
    const petsCollection = await pets();
    let petList = await petsCollection.find({}).toArray();
    if (!petList) throw "Error: Could not get all pets";

    return petList;
  },

  async getPetById(id) {
    id = helpers.checkId(id, "pet id");
    const petsCollection = await pets();
    const user = await petsCollection.findOne({ _id: new ObjectId(id) });
    if (!user) throw "Error: no pet with that id exist";

    return user;
  },

  async getPetByCreator(id) {
    id = helpers.checkId(id, "creator id");
    const petsCollection = await pets();
    const pet = await petsCollection.findOne({ creatorId: new ObjectId(id) });
    if (!pet) throw "Error: no pet with that id exist";

    return pet;
  },

  async createComment(petId, userId, comment) {
    petId = helpers.checkId(petId, "pet id");
    userId = helpers.checkId(userId, "user id");
    comment = helpers.checkString(comment, "comment");

    let userName = await userFn.getUserById(userId)

    let newComment = {
      _id: new ObjectId(),
      userId: userId,
      userName: userName.firstName + " " + userName.lastName,
      commentContent: comment,
    };

    const petsCollection = await pets();

    const updatedInfo = await petsCollection.updateOne(
      { _id: new ObjectId(petId) },
      { $push: { comments: newComment } }
    );

    if (!updatedInfo) {
      throw "Error: could not create comment successfully";
    }

    return { commentId: newComment._id };
  },

  async updatePet(
    id,
    updatedData
  ) {
    const name = helpers.checkString(updatedData.nameInput, "pet name");
    const age = helpers.checkStringisNumber(updatedData.ageInput);
    const gender = helpers.checkString(updatedData.genderInput, "gender");
    const breed = helpers.checkString(updatedData.breedInput, "breed");
    const description = helpers.checkString(updatedData.descriptionInput, "description");
    const typeOfAnimal = helpers.checkString(updatedData.typeInput, "typeOfAnimal");
    const zip = helpers.checkZip(updatedData.zipInput);
    // TODO: picture file validation
    const adoptionStatus = helpers.checkAdoptedStatus(updatedData.adoptionStatusInput);
    updatedData.picture = '\\' + updatedData.picture ;

    const petsCollection = await pets();

    let setPet = {
      name: name,
      age: age,
      gender: gender,
      breed: breed,
      description: description,
      typeOfAnimal: typeOfAnimal,
      zip: zip,
      picture: updatedData.picture,
      adoptionStatus: adoptionStatus,
      lastUpdated: new Date().toLocaleDateString(),
    };

    const updatedInfo = await petsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: setPet }
    );

    if (!updatedInfo) {
      throw "Error: could not update pet successfully";
    }

    // return getPetById(id);
  },

  // method to delete pet need to make changes
  async removePet(petId, userInfo) {
    try{
      petId = helpers.checkId(petId, "pet id");
      const petCollection = await pets();
      
      const deletionInfo = await petCollection.deleteOne({
        _id: new ObjectId(petId),
      });

      if (!deletionInfo) {
        throw `Could not delete pet with id of ${petId}`;
      }
    }catch(error){
      console.log(error.message)
    }
  },

  async removeComment(commentId) {
    commentId = helpers.checkId(commentId, "comment id");
    const petsCollection = await pets();

    const deletionInfo = await petsCollection.findOneAndUpdate(
      { "comments._id": commentId },
      { $pull: { comments: { _id: commentId } } },
      { returnDocument: "after" }
    );

    if (!deletionInfo) {
      throw `Error: Could not delete comment with id of ${commentId}`;
    }

    return deletionInfo;
  },

  async getPetsBySearch(zip, typeOfAnimal) {
    zip = helpers.checkZip(zip);
    typeOfAnimal = typeOfAnimal.toLowerCase();
    const petsCollection = await pets();
		let petList = [];

    if (zip && typeOfAnimal.length === 0) {
      petList = await petsCollection.find({ zip: zip }).toArray();
    } else {
      petList = await petsCollection.find({ typeOfAnimal: typeOfAnimal, zip: zip }).toArray();
    }

    if(!petList) throw "Error: no pets with that type and zip exist";

    return petList;
  }
};

export default exportedMethods;